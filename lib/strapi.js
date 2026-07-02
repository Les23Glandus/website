/**
 * Couche serveur d'accès à Strapi — remplace src/class/strapiConnector.js.
 *
 * Différences principales avec l'ancien connecteur (T106/T107) :
 *  - Ce module ne s'exécute QUE côté serveur (Server Components / route handlers),
 *    jamais dans le navigateur : plus besoin de passer par le proxy public `/api`,
 *    Next.js peut appeler Strapi directement (réseau interne en prod).
 *  - Le cache maison par en-têtes (`my-cache`, `my-cache-query` + hash md5) est
 *    remplacé par le cache natif de Next (`fetch(url, { next: { revalidate, tags }})`).
 *    Mapping conservé : les anciennes valeurs "cache" de strapiConnector.js
 *    représentaient des unités de ~20 minutes (cf. commentaire d'origine).
 *  - Chaque requête pose des tags de cache (`revalidateTag`) pour permettre une
 *    revalidation à la demande depuis un webhook Strapi "on publish" (voir
 *    app/api/revalidate/route.js et plan.md T107).
 *
 * IMPORTANT : tant que l'étape 0 (audit du proxy /api actuel, cf. plan.md T002)
 * n'est pas terminée, STRAPI_URL doit être renseigné dans .env.local pour que
 * ce module fonctionne (voir .env.example).
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

const MIN = 60; // 1 minute en secondes
const REVALIDATE = {
  NEVER_CACHE: 0, // équivalent ancien "cache:0" (recherche, filtres nocache)
  SHORT: 20 * MIN, // ancien "cache:1"
  MEDIUM: 40 * MIN, // ancien "cache:2"
  DEFAULT: 80 * MIN, // ancien "cache:4" (valeur par défaut des anciennes requêtes)
  LONG: 4 * 60 * MIN, // ancien "cache:12"
};

/**
 * Appel REST vers Strapi (ex: /a-propos, /glanduses, /filter-presets, /escapes/sum).
 */
async function strapiFetch(path, { revalidate = REVALIDATE.DEFAULT, tags = [] } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (STRAPI_API_TOKEN) headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;

  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: "GET",
    headers,
    ...(revalidate === REVALIDATE.NEVER_CACHE
      ? { cache: "no-store" }
      : { next: { revalidate, tags } }),
  });

  if (!res.ok) throw new Error(`Strapi REST ${path} -> ${res.status}`);
  return res.json();
}

/**
 * Appel GraphQL vers Strapi. Reproduit le comportement de graphql() dans
 * l'ancien connecteur : si limit === 1 on renvoie le premier élément (ou
 * l'objet direct s'il n'y a pas de liste), sinon on renvoie la liste brute.
 */
async function strapiGraphQL(query, variables, { revalidate = REVALIDATE.DEFAULT, tags = [] } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (STRAPI_API_TOKEN) headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;

  const res = await fetch(`${STRAPI_URL}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(revalidate === REVALIDATE.NEVER_CACHE
      ? { cache: "no-store" }
      : { next: { revalidate, tags } }),
  });

  if (!res.ok) throw new Error(`Strapi GraphQL -> ${res.status}`);
  const json = await res.json();
  if (!json.data) return null;

  const entries = Object.entries(json.data);
  if (entries.length === 0) return null;

  const [, value] = entries[0];
  if (variables.limit === 1) {
    return Array.isArray(value) ? value[0] : value;
  }
  return value;
}

/** Fragments GraphQL — copiés tels quels depuis strapiConnector.js (`structure`). */
const FRAGMENTS = {
  "selections": `{
    id title
    mini { id url formats }
    image { id url formats }
    color colorpicker priority description
    paragraph { id title article }
    escapes {
      id name uniquepath rate isOpen date
      nbPlayerMin description scenario glandusor nbPlayerMax
      addresses { id town postcode street name pay { id name } region { id name } }
      mini { id url formats }
      tags { id name isMention isGold description english }
      enseigne { id name uniquepath isOpen }
    }
  }`,
  "selections:list": `{ id title uniquepath priority mini { id url formats } color colorpicker description }`,
  "choixSelection": `{ id Selections { selection { id title uniquepath mini { id url formats } color colorpicker description } } }`,
  "carousels": `{ id title link image { id url formats } date description published_at }`,
  "pays:list": `{ id name regions { id name } }`,
  "regroupements": `{ id name region { id name } }`,
  "aPropo": `{ title article illustrations { id formats url } }`,
  "tags:list": `{ id name description english isGold isMention useInFilter }`,
  "actus:list": `{ id uniquepath mini { id formats url } channel date description title }`,
  "actus": `{
    id uniquepath mini { id formats url } illustration { id formats url }
    channel date published_at description paragraph { id title article } title article
  }`,
  "companies": `{
    id name introduction ourExperience published_at updated_at url isOpen
    addresses { id town postcode street name pay { id name } region { id name } }
    logo { id url formats } illustration { id formats url } uniquepath
    escapes { id name uniquepath date nbPlayerMin nbPlayerMax scenario glandusor description isOpen rate
      mini { id formats url }
      tags { id name english isMention isGold description useInFilter } }
  }`,
  "companies:list": `{ id name isOpen logo { id url formats } uniquepath }`,
  "jeuxes": `{ id name uniquepath date article description editeur
    illustration { id formats url } jeux_types { name } mini { id formats url }
    paragraph { id title article } }`,
  "jeuxes:list": `{ id name uniquepath date description jeux_types { name } published_at mini { id formats url } }`,
  "escapes:id": `{ id uniquepath tags { id } }`,
  "escapes:list": `{
    id name rate date description scenario
    mini { id formats url }
    uniquepath
    addresses { id town postcode street name pay { id name } region { id name } }
    tags { id name isMention english isGold description useInFilter }
    preventPush glandusor isOpen nbPlayerMin nbPlayerMax
    enseigne { id name uniquepath isOpen addresses { pay { name } region { name } town } }
  }`,
  "escapes": `{
    id name rate glandusor date
    paragraph { id title article }
    published_at updated_at
    mini { id formats url }
    illustration { id formats url }
    scenario description uniquepath story
    audio { id url }
    lesPlus lesMoins
    tags { id name isMention english isGold description useInFilter }
    preventPush isOpen nbPlayerMin nbPlayerMax
    addresses { pay { id name } region { id name } town regroupement { id } }
    enseigne { id name uniquepath isOpen
      addresses { pay { id name } region { id name } town }
      escapes { id name uniquepath date nbPlayerMin nbPlayerMax tags { id name isGold } } }
    selections { id title priority description uniquepath color colorpicker mini { id url formats } }
    avantapres { id when image { name caption url formats } }
  }`,
};

function tableName(table) {
  return table.replace(/:.+$/, "");
}

function buildListQuery(table) {
  const t = tableName(table);
  return `query($limit:Int, $where:JSON, $start:Int, $sort:String){
    ${t}(limit:$limit, where:$where, start:$start, sort:$sort) ${FRAGMENTS[table]}
  }`;
}

function buildSingleQuery(table) {
  const t = tableName(table);
  return `query{ ${t} ${FRAGMENTS[table]} }`;
}

function defaultListVariables(overrides = {}) {
  return { limit: 10, where: {}, start: 0, sort: "id", ...overrides };
}

// ---------------------------------------------------------------------------
// Sélections
// ---------------------------------------------------------------------------
export async function getChoixSelection() {
  return strapiGraphQL(buildSingleQuery("choixSelection"), defaultListVariables({ limit: 10 }), {
    revalidate: REVALIDATE.LONG,
    tags: ["selections"],
  });
}
export async function getSelections() {
  return strapiGraphQL(buildListQuery("selections:list"), defaultListVariables({ limit: 300 }), {
    revalidate: REVALIDATE.DEFAULT,
    tags: ["selections"],
  });
}
export async function getSelectionByRef(ref) {
  return strapiGraphQL(
    buildListQuery("selections"),
    defaultListVariables({ where: { uniquepath: ref }, limit: 1 }),
    { revalidate: REVALIDATE.DEFAULT, tags: ["selections", `selection:${ref}`] }
  );
}
export async function searchSelection(query, limit) {
  return strapiGraphQL(
    buildListQuery("selections:list"),
    defaultListVariables({ where: { title_contains: query }, limit, sort: "title:ASC" }),
    { revalidate: REVALIDATE.NEVER_CACHE }
  );
}

// ---------------------------------------------------------------------------
// A Propos
// ---------------------------------------------------------------------------
export async function getAPropos() {
  return strapiFetch("/a-propos", { revalidate: REVALIDATE.LONG, tags: ["apropos"] });
}
export async function getHomeAPropos() {
  return strapiGraphQL(buildSingleQuery("aPropo"), defaultListVariables({ limit: 1 }), {
    revalidate: REVALIDATE.LONG,
    tags: ["apropos"],
  });
}
export async function getGlanduses() {
  return strapiFetch("/glanduses", { revalidate: REVALIDATE.LONG, tags: ["glanduses"] });
}

// ---------------------------------------------------------------------------
// Filtres (tags, régions, pays, regroupements) — utilisés par la page Browse
// ---------------------------------------------------------------------------
export async function getTags() {
  return strapiGraphQL(
    buildListQuery("tags:list"),
    defaultListVariables({ where: { useInFilter: true }, limit: 1000, sort: "name:ASC" }),
    { revalidate: REVALIDATE.DEFAULT, tags: ["tags"] }
  );
}
export async function getRegroupements() {
  return strapiGraphQL(buildListQuery("regroupements"), defaultListVariables({ limit: 300, sort: "name:ASC" }), {
    revalidate: REVALIDATE.DEFAULT,
    tags: ["regroupements"],
  });
}
export async function getPays() {
  return strapiGraphQL(buildListQuery("pays:list"), defaultListVariables({ limit: 1000 }), {
    revalidate: REVALIDATE.DEFAULT,
    tags: ["pays"],
  });
}
export async function getFilterPresets() {
  return strapiFetch("/filter-presets", { revalidate: REVALIDATE.DEFAULT, tags: ["filter-presets"] });
}

// ---------------------------------------------------------------------------
// Carousel (accueil)
// ---------------------------------------------------------------------------
export async function getCarousel() {
  return strapiGraphQL(buildListQuery("carousels"), defaultListVariables({ limit: 10, sort: "date:DESC" }), {
    revalidate: REVALIDATE.DEFAULT,
    tags: ["carousel"],
  });
}

// ---------------------------------------------------------------------------
// Escapes
// ---------------------------------------------------------------------------
export async function getEscape(id) {
  return strapiFetch(`/escapes/${id}`, { revalidate: REVALIDATE.SHORT, tags: ["escapes", `escape-id:${id}`] });
}
export async function getRecentEscapes(limit) {
  return strapiGraphQL(
    buildListQuery("escapes:list"),
    defaultListVariables({ where: { preventPush: false, isOpen: true }, limit, sort: "date:DESC" }),
    { revalidate: REVALIDATE.SHORT, tags: ["escapes"] }
  );
}
export async function getEscapeByRef(ref, min) {
  const table = "escapes" + (min ? ":list" : "");
  const isMultiple = Array.isArray(ref);
  return strapiGraphQL(
    buildListQuery(table),
    defaultListVariables({ where: { uniquepath: ref }, limit: isMultiple ? ref.length : 1 }),
    {
      // NEVER_CACHE (cache: "no-store") ici forcerait tout le rendu de la page
      // appelante à basculer en dynamique, ce qui casse le SSG/ISR des pages
      // statiquement générées (generateStaticParams) qui l'utilisent — voir
      // EscapeLatestsTests.js ("à voir aussi"). SHORT reste assez frais tout
      // en restant compatible avec la génération statique.
      revalidate: isMultiple ? REVALIDATE.SHORT : REVALIDATE.LONG,
      tags: ["escapes", ...(isMultiple ? ref.map((r) => `escape:${r}`) : [`escape:${ref}`])],
    }
  );
}
export async function getEscapeBetweenDate(dmin, dmax) {
  return strapiGraphQL(
    buildListQuery("escapes:list"),
    defaultListVariables({
      where: { date_gt: dmin, date_lt: dmax, preventPush: false, isOpen: true },
      sort: "date:DESC",
      limit: 100,
    }),
    { revalidate: REVALIDATE.NEVER_CACHE }
  );
}
export async function browseEscapes(query, limit = 100, sortby = "date:DESC", nocache = false) {
  return strapiGraphQL(
    buildListQuery("escapes:id"),
    defaultListVariables({ where: query, limit, sort: sortby }),
    { revalidate: nocache ? REVALIDATE.NEVER_CACHE : REVALIDATE.DEFAULT, tags: ["escapes"] }
  );
}
/**
 * Variante utilisée par la page Browse (app/escapegame/page.js) : récupère
 * directement les champs complets nécessaires à EscapeCard, au lieu du
 * double appel "ids puis détails" de l'ancien Browse.js (this.inCache +
 * getEscapeByRef par page). Simplification assumée pour la migration (T407) :
 * un peu plus de payload par requête, mais un flux de données beaucoup plus
 * simple ; à ré-optimiser plus tard si besoin réel de perf constaté.
 */
export async function searchEscapesFiltered(query, limit = 1000, sortby = "date:DESC") {
  return strapiGraphQL(
    buildListQuery("escapes:list"),
    defaultListVariables({ where: query, limit, sort: sortby }),
    { revalidate: REVALIDATE.NEVER_CACHE }
  );
}
export async function getRealisation() {
  return strapiFetch("/escapes/sum", { revalidate: REVALIDATE.SHORT, tags: ["escapes", "realisation"] });
}
export async function searchEscapes(query, limit) {
  return strapiGraphQL(
    buildListQuery("escapes:list"),
    defaultListVariables({ where: { name_contains: query }, limit, sort: "date:DESC" }),
    { revalidate: REVALIDATE.NEVER_CACHE }
  );
}

// ---------------------------------------------------------------------------
// Enseignes
// ---------------------------------------------------------------------------
export async function getEnseigne(id) {
  return strapiFetch(`/companies/${id}`, { revalidate: REVALIDATE.DEFAULT, tags: ["enseignes", `enseigne-id:${id}`] });
}
export async function getEnseigneByRef(ref) {
  return strapiGraphQL(
    buildListQuery("companies"),
    defaultListVariables({ where: { uniquepath: ref }, limit: 1 }),
    { revalidate: REVALIDATE.DEFAULT, tags: ["enseignes", `enseigne:${ref}`] }
  );
}
export async function searchEnseigne(query, limit) {
  return strapiGraphQL(
    buildListQuery("companies:list"),
    defaultListVariables({ where: query && Object.keys(query).length ? query : { name_contains: query || "" }, limit, sort: "name:ASC" }),
    { revalidate: query && Object.keys(query || {}).length === 0 ? REVALIDATE.DEFAULT : REVALIDATE.NEVER_CACHE, tags: ["enseignes"] }
  );
}

// ---------------------------------------------------------------------------
// Actus
// ---------------------------------------------------------------------------
export async function getActuByRef(ref) {
  return strapiGraphQL(
    buildListQuery("actus"),
    defaultListVariables({ where: { uniquepath: ref }, limit: 1 }),
    { revalidate: REVALIDATE.DEFAULT, tags: ["actus", `actu:${ref}`] }
  );
}
export async function getRecentActus(limit) {
  return strapiGraphQL(buildListQuery("actus:list"), defaultListVariables({ limit, sort: "date:DESC" }), {
    revalidate: REVALIDATE.MEDIUM,
    tags: ["actus"],
  });
}
export async function searchActus(query, limit) {
  return strapiGraphQL(
    buildListQuery("actus:list"),
    defaultListVariables({ where: { title_contains: query }, limit, sort: "date:DESC" }),
    { revalidate: REVALIDATE.NEVER_CACHE }
  );
}

// ---------------------------------------------------------------------------
// Jeux
// ---------------------------------------------------------------------------
export async function getJeux(limit = 100) {
  return strapiGraphQL(buildListQuery("jeuxes:list"), defaultListVariables({ limit, sort: "date:DESC" }), {
    revalidate: REVALIDATE.DEFAULT,
    tags: ["jeux"],
  });
}
export async function getJeuxByRef(ref) {
  return strapiGraphQL(
    buildListQuery("jeuxes"),
    defaultListVariables({ where: { uniquepath: ref }, limit: 1 }),
    { revalidate: REVALIDATE.DEFAULT, tags: ["jeux", `jeu:${ref}`] }
  );
}
export async function getRecentJeux(limit) {
  return strapiGraphQL(buildListQuery("jeuxes:list"), defaultListVariables({ limit, sort: "date:DESC" }), {
    revalidate: REVALIDATE.SHORT,
    tags: ["jeux"],
  });
}
export async function searchJeux(query, limit) {
  return strapiGraphQL(
    buildListQuery("jeuxes:list"),
    defaultListVariables({ where: { name_contains: query }, limit, sort: "name:ASC" }),
    { revalidate: REVALIDATE.NEVER_CACHE }
  );
}

export { REVALIDATE };

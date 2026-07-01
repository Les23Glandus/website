/**
 * Logique de construction de requête pour la page Browse — portée depuis
 * pages/Browse.js (onFilterChange / reduceListPerTags). Fonctions pures,
 * réutilisables aussi bien côté serveur (Server Action) que dans les tests.
 */
export const ID_FRANCE = "1";

/**
 * Traduit les valeurs brutes du formulaire de filtre (antd Form) en requête
 * GraphQL "where" pour Strapi, + les listes de tags à appliquer en ET / OU.
 */
export function buildBrowseQuery(filter = {}) {
  const query = {};
  let tagsOR = [];
  const reg = /^tags-(\d+)$/;

  Object.keys(filter).forEach((k) => {
    const v = filter[k];
    if (v === undefined || v === false) return;

    const match = reg.exec(k);
    if (match) {
      const tagId = match[1];
      query["tags.id"] = query["tags.id"] || [];
      query["tags.id"].push(tagId);
    } else if (k === "addresses.pay.id" && v === "row") {
      query["addresses.pay.id_ne"] = ID_FRANCE;
    } else if (k === "gold" || k === "english") {
      query["tags.id"] = (query["tags.id"] || []).concat(v);
      tagsOR = tagsOR.concat(v);
    } else if (k === "nbplayer") {
      query["nbPlayerMin_lte"] = v;
      query["nbPlayerMax_gte"] = v;
    } else {
      query[k] = v;
    }
  });

  if (query["tags.id"] && query["tags.id"].length <= 0) delete query["tags.id"];

  const tagsAND = query["tags.id"] ? query["tags.id"].filter((n) => !tagsOR.includes(n)) : null;

  return { query, tagsAND, tagsOR };
}

/** Applique le ET/OU sur les tags après récupération de la liste (l'API Strapi ne fait que du OU nativement). */
export function reduceListPerTags(list, tagsAnd, tagsOr) {
  if (!tagsAnd || (tagsAnd.length <= 1 && !tagsOr?.length)) return list;
  const or = tagsOr || [];

  return list
    .map((n) => {
      const withCounters = { ...n };
      withCounters.__ta = 0;
      withCounters.__to = or.length > 0 ? false : true;
      (n.tags || []).forEach((t) => {
        if (tagsAnd.includes(String(t.id))) withCounters.__ta++;
        if (or.includes(String(t.id))) withCounters.__to = true;
      });
      return withCounters;
    })
    .filter((n) => n.__ta === tagsAnd.length && n.__to);
}

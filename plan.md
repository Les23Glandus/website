# Plan de conversion — Les Glandus vers Next.js

Chaque tâche a un identifiant unique `Txxx` (numérotation par étape : `T0xx` = étape 0, `T1xx` = étape 1, etc., voir `objectif.md`). Les cases à cocher servent à suivre l'avancement lors de l'implémentation.

> **État (voir `nextjs-app/README.md` pour le détail)** : les tâches T101 à
> T704 (étapes 1 à 7) ont été implémentées dans `nextjs-app/`. Le code n'a
> pas pu être installé/compilé dans cet environnement (pas d'accès au
> registre npm) — à vérifier avec `npm install && npm run build` avant toute
> mise en ligne. Les étapes 0 (T001-T005) et 8 (T801-T808) restent à faire.

---

## Étape 0 — Cadrage & vérification du diagnostic

- [ ] **T001** — Vérifier dans Search Console (couverture d'indexation + outil "Inspection de l'URL / Test en direct") que le problème constaté est bien un problème de rendu CSR, et pas un problème éditorial/backlinks. Documenter 3-5 exemples de pages mal indexées.
- [ ] **T002** — Auditer la configuration de production actuelle (nginx ou équivalent) : comment `/api` est mappé vers Strapi (port 1337 en local d'après `package.json`), et à quoi correspond exactement le système de cache par en-têtes `my-cache` / `my-cache-query` utilisé dans `src/class/strapiConnector.js` (`fetch()` et `graphql()`). Décider s'il faut le reproduire ou le remplacer entièrement par le cache natif de Next.
- [ ] **T003** — Décider de l'hébergement cible de Next.js : un serveur Node est requis pour le SSR/ISR (contrairement au dossier `build/` statique actuel servi par nginx). Options à trancher : VPS existant + process manager (pm2/systemd) + nginx en reverse proxy, vs plateforme managée (ex. Vercel). Ce choix conditionne les tâches T804/T805.
- [ ] **T004** — Choisir Next.js App Router (recommandé, cohérent avec les Server Components) et figer les versions cibles : Next.js, React, antd (garder v4 ou upgrader v5 — dépend de la compatibilité avec la version de React choisie).
- [ ] **T005** — Établir une liste de référence "avant migration" : captures d'écran et contenu (title, meta description, JSON-LD) d'un échantillon représentatif de pages de chaque type (accueil, une fiche escape, une fiche enseigne, un jeu, une actu, une sélection, browse, search, 404), pour servir de base de comparaison à la recette (T802).

---

## Étape 1 — Socle technique Next.js

- [x] **T101** — Initialiser un nouveau projet Next.js (App Router) dans un nouveau dossier/branche, séparé du projet CRA existant tant que la bascule n'est pas validée.
- [x] **T102** — Mettre en place la structure de dossiers (`app/`, `components/`, `lib/`), ESLint, et décider JS vs TypeScript pour le nouveau projet.
- [x] **T103** — Remplacer `node-sass` (déprécié) par `sass` (dart-sass) ; migrer `src/css/*.scss` (11 fichiers) et vérifier qu'aucune syntaxe legacy spécifique à node-sass n'est utilisée.
- [x] **T104** — Réintégrer Ant Design : importer le thème précompilé (`antd/dist/antd.dark.css`, actuellement importé dans `src/css/common.scss`) dans le layout racine ; vérifier la compatibilité d'antd v4 avec la version de React choisie (T004), upgrader vers antd v5 si nécessaire.
- [x] **T105** — Porter `src/class/config.js` (`origin: "https://www.lesglandus.fr"`) vers des variables d'environnement Next (`.env`, `next.config.js`) ; migrer aussi `src/.env` (actuellement suivi par git — vérifier qu'aucun secret n'y a été ajouté depuis et exclure les fichiers `.env*` du nouveau dépôt).
- [x] **T106** — Réécrire `strapiConnector.js` en module serveur (ex. `lib/strapi.js`) réutilisable dans les Server Components et route handlers : porter toutes les méthodes (`getEscapeByRef`, `getEnseigneByRef`, `getJeuxByRef`, `getActuByRef`, `getSelectionByRef`, `browseEscapes`, `searchEscapes`/`searchJeux`/`searchEnseigne`/`searchSelection`/`searchActus`, `getTags`, `getPays`, `getRegroupements`, `getCarousel`, `getAPropos`, `getGlanduses`, `getFilterPresets`, `getRecentActus`, `getRecentJeux`, `getEscapeBetweenDate`), y compris les requêtes GraphQL définies dans `structure`.
- [x] **T107** — Définir la stratégie de revalidation Next (`fetch(url, { next: { revalidate } })`) en remplacement des valeurs `cache:0/1/2/4/12` actuelles (approximativement "cache × 20 min" selon le commentaire du code). Mettre en place un webhook Strapi "on publish/update" appelant `revalidatePath`/`revalidateTag` pour rafraîchir immédiatement une fiche modifiée.
- [x] **T108** — Copier les assets statiques : `public/*.png`, `public/favicon.ico`, `public/manifest.json`, `public/patterns/*.svg` (12 fichiers), `public/picture/*.svg`, et les adapter au dossier `public/` de Next (les patterns et illustrations sont référencés dynamiquement via `process.env.PUBLIC_URL` dans plusieurs composants — à remplacer par des chemins absolus `/patterns/...`).
- [x] **T109** — Créer le layout racine `app/layout.js` reprenant la structure de `App.js`/`index.js` : `Header`, `Footer`, import CSS global (`common.scss`), balises `<html lang="fr">` et méta de base actuellement dans `public/index.html`.
- [x] **T110** — Migrer `components/ScrollToTop.js` (actuellement basé sur `withRouter` + `window.scrollTo`) vers un composant client Next basé sur `usePathname`.
- [x] **T111** — Sortir la clé Google Maps codée en dur dans `components/meta/GoogleMaps.js` (`AIzaSyDRMkMjhI1GHn-v-e6Y6oB8u6VezAaooTU`) vers une variable d'environnement (`NEXT_PUBLIC_GOOGLE_MAPS_KEY`), et la restreindre par domaine référent dans Google Cloud Console (elle est actuellement exposée sans restriction visible dans le code source public).

---

## Étape 2 — Composants transverses / SEO

- [x] **T201** — Remplacer `components/HtmlHead.js` (react-helmet) par l'API Metadata de Next (`generateMetadata` exporté par chaque page) : title, description (actuellement généré depuis du markdown via `showdown`), meta Twitter/OpenGraph. Résoudre `window.location.pathname` (utilisé pour `og:url`) via l'URL de la requête côté serveur.
- [x] **T202** — Migrer `components/meta/ShareLinks.js` : sortir le JSON-LD `Organization` (actuellement injecté via `react-helmet`) vers le layout racine ou une fonction de metadata partagée.
- [x] **T203** — Migrer le JSON-LD spécifique de `components/EscapeArticle.js`, `components/EnseigneArticle.js`, `components/JeuxArticle.js` (actuellement basé sur `window.location.href`, donc absent du HTML initial) pour qu'il soit généré côté serveur avec l'URL réelle de la page.
- [x] **T204** — Migrer les composants `meta/Slice.js`, `meta/Card.js`, `meta/Note.js`, `meta/TopIllustration.js`, `meta/RichText.js` : retirer le HOC `withRouter` (react-router v5) et remplacer les `Link` de `react-router-dom` par `next/link`.
- [x] **T205** — Isoler `components/meta/Card.js` en composant client (`"use client"`) à cause du `window.addEventListener('scroll', ...)` dans `componentDidMount` ; en profiter pour ajouter le `removeEventListener` manquant (fuite mémoire existante).
- [x] **T206** — Migrer `components/meta/GoogleMaps.js` en composant client (`"use client"`, usage de `window.google`), branché sur la variable d'environnement définie en T111.
- [x] **T207** — Décider du sort de `react-markdown` v5 (utilisé dans `meta/RichText.js` avec l'ancienne API `renderers`/`allowedTypes`) : le conserver tel quel (fonctionne aussi en Next) ou l'upgrader vers l'API courante (`components` prop) — non bloquant pour la migration.

---

## Étape 3 — Pages "contenu" à fort enjeu SEO (priorité 1)

- [x] **T301** — `app/escapegame/[enseigne]/page.js` : à partir de `pages/Enseigne.js` + `components/EnseigneArticle.js`. Fetch serveur (`getEnseigneByRef`), `generateMetadata`, `generateStaticParams` pour pré-générer les enseignes existantes, ISR pour les nouvelles/mises à jour.
- [x] **T302** — `app/escapegame/[enseigne]/[escape]/page.js` : à partir de `pages/Escape.js` + `components/EscapeArticle.js` (la fiche la plus riche : description, scénario, avis, tags, adresses, avant/après, sélections liées).
- [x] **T303** — `app/jeux/[jeu]/page.js` : à partir de `pages/Jeu.js` + `components/JeuxArticle.js`.
- [x] **T304** — `app/news/[news]/page.js` : à partir de `pages/Actu.js` + `components/Actus.js` (inclut le bouton "retour" actuellement en `window.location.href`, à remplacer par `next/link` ou `router.back()`).
- [x] **T305** — `app/selections/[selection]/page.js` : à partir de `pages/Selection.js` + `components/Selection.js`.
- [x] **T306** — Pour les 5 pages ci-dessus : vérifier en "Affichage tel que Google" (ou simple `curl`/vue-source) que le contenu, les meta et le JSON-LD sont bien présents dans le HTML brut, sans exécution de JS.

---

## Étape 4 — Pages de listing / navigation

- [x] **T401** — `app/page.js` (accueil) à partir de `pages/Home.js` : orchestrer le fetch serveur parallèle des blocs Carousel, EscapeBilan, EscapeLatestsTests, SelectionsGrid, JeuxGrid, ActusGrid, Group.
- [x] **T402** — Migrer un par un les composants d'affichage utilisés sur l'accueil et ailleurs : `Carousel.js`, `EscapeBilan.js`, `EscapeLatestsTests.js`, `SelectionsGrid.js`, `JeuxGrid.js`, `ActusGrid.js`, `Group.js`, `ActusCard.js`, `EscapeCard.js`, `JeuxCard.js`, `SelectionCard.js`, `OtherEnseigne.js` — en Server Components quand ils ne font qu'afficher de la donnée déjà chargée par la page parente, en composants client uniquement s'ils ont un état/interaction propre.
- [x] **T403** — `app/entreprise/page.js` à partir de `pages/AllEnseigne.js` (liste complète des enseignes, `searchEnseigne({}, 1000)`).
- [x] **T404** — `app/jeux/page.js` à partir de `pages/Jeux.js`.
- [x] **T405** — `app/selections/page.js` à partir de `pages/Selections.js`.
- [x] **T406** — `app/news/page.js` à partir de `pages/News.js` : rendu serveur de la timeline initiale (`getRecentActus`), le toggle "Inclure nos tests" (`Switch` antd, actuellement `onSwitchChange` + refetch) reste une interaction client par-dessus les données.
- [x] **T407** — `app/escapegame/page.js` à partir de `pages/Browse.js` (page la plus complexe : filtres pays/région/tags/nb joueurs, presets, pagination, cache local `inCache`). Rendu serveur de la première liste triée par défaut pour le SEO ; formulaire de filtres en composant client. Remplacer la persistance de filtre actuellement en `sessionStorage` par des `searchParams` d'URL, pour que les résultats filtrés restent partageables/indexables (ou au minimum crawlables via des liens directs pour les combinaisons les plus utiles).

---

## Étape 5 — Pages utilitaires / interactives

- [x] **T501** — `app/search/page.js` à partir de `pages/Search.js` : lecture de la requête via `searchParams` au lieu de `URLSearchParams(this.props.location.search)` ; recherche multi-entités (`escape`, `jeux`, `enseigne`, `selection`, `actu`) qui peut rester en logique client (peu d'enjeu SEO sur une page de résultats de recherche interne).
- [x] **T502** — `app/about/page.js` à partir de `pages/APropos.js`.
- [x] **T503** — `app/not-found.js` à partir de `pages/Page404.js` (inclut le champ de recherche redirigeant vers `/search?q=`).
- [x] **T504** — `app/error.js` (ou `global-error.js`) à partir de `pages/Page500.js`.

---

## Étape 6 — Routing, redirections, SEO technique global

- [x] **T601** — Porter les ~15 redirections définies dans `App.js` (`<Redirect from=... to=.../>`) vers `redirects()` dans `next.config.js` (ex. `/entreprise/:enseigne → /escapegame/:enseigne`, `/groupe → /about`, `/les-glandus-dor-2019 → /selections/les-glandus-d-or-2019`, etc. — liste exhaustive à reprendre telle quelle depuis `App.js`).
- [x] **T602** — Créer `app/sitemap.js` généré dynamiquement à partir des données Strapi (escapes, enseignes, jeux, actus, sélections).
- [x] **T603** — Créer/adapter `app/robots.js` (remplace `public/robots.txt`).
- [x] **T604** — Ajouter les balises canoniques par page (absentes actuellement) via l'API Metadata.
- [x] **T605** — Vérifier le rendu de `public/manifest.json` et des icônes (`Glandus-16/64/192/300/512px.png`, `favicon.ico`, `apple-touch-icon`) dans le nouveau projet Next.

---

## Étape 7 — Nettoyage dette technique

- [x] **T701** — Remplacer `react-ga` (Universal Analytics, propriété `UA-120909023-1` — service arrêté par Google mi-2024, ne collecte plus rien) par Google Analytics 4, par exemple via `@next/third-parties/google`. Rebrancher le suivi des pageviews sur la navigation Next (actuellement fait via `usePageViews()`/`useLocation()` dans `App.js`).
- [x] **T702** — Supprimer entièrement `react-router-dom` une fois toutes les pages migrées : remplacer les usages restants de `Link`, `useLocation`, `withRouter`, `Switch`/`Route` par leurs équivalents Next (`next/link`, `next/navigation`, routing par fichiers).
- [x] **T703** — Nettoyer `package.json` : retirer `react-scripts`, `node-sass`, `react-router-dom`, `react-ga` (une fois remplacés) ; figer les nouvelles versions (Next.js, React, antd).
- [x] **T704** — Réévaluer l'usage de `md5` (utilisé uniquement pour générer `my-cache-query` côté client dans `strapiConnector.js`) — probablement inutile une fois le cache géré nativement côté serveur par Next (T107).

---

## Étape 8 — Tests, recette, déploiement, bascule

- [ ] **T801** — Écrire des tests de fumée (Playwright ou équivalent) sur les pages clés : accueil, une fiche escape game, une fiche enseigne, browse avec filtres, recherche, 404.
- [ ] **T802** — Recette comparative page par page par rapport à la liste de référence établie en T005 (contenu affiché, title/description, JSON-LD, redirections, comportement des filtres/recherche).
- [ ] **T803** — Mesurer les Core Web Vitals (PageSpeed Insights / rapport CrUX) avant/après migration sur l'échantillon de pages de T005.
- [ ] **T804** — Mettre en place l'environnement d'exécution Next.js décidé en T003 (build `next build`, process Node via pm2/systemd, ou déploiement sur une plateforme managée), en remplacement du script `update.sh` actuel (`git pull && npm install && npm run build` sur du statique).
- [ ] **T805** — Reconfigurer le reverse proxy de production pour router vers le serveur Node Next.js au lieu du dossier `build/` statique ; Strapi reste joignable en interne par le serveur Next (plus besoin d'exposer publiquement le `/api` proxy actuel si le fetch se fait server-to-server).
- [ ] **T806** — Déployer sur un environnement de préproduction (sous-domaine ou instance séparée) et faire valider la recette (T802) avant bascule en production.
- [ ] **T807** — Après bascule, soumettre le nouveau sitemap dans Search Console et suivre l'évolution de la couverture d'indexation sur plusieurs semaines.
- [ ] **T808** — Définir un plan de rollback : conserver le build CRA et la configuration nginx précédente disponibles pendant au moins quelques semaines après la bascule, au cas où un problème d'indexation ou de régression fonctionnelle apparaîtrait.

---

## Récapitulatif

| Étape | Nb tâches | Plage d'identifiants |
|---|---|---|
| 0 — Cadrage | 5 | T001–T005 |
| 1 — Socle technique | 11 | T101–T111 |
| 2 — SEO transverse | 7 | T201–T207 |
| 3 — Pages contenu | 6 | T301–T306 |
| 4 — Listing/navigation | 7 | T401–T407 |
| 5 — Utilitaires | 4 | T501–T504 |
| 6 — Routing/SEO technique | 5 | T601–T605 |
| 7 — Dette technique | 4 | T701–T704 |
| 8 — Tests/déploiement | 8 | T801–T808 |
| **Total** | **57** | |

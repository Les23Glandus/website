# Les Glandus — lesglandus.fr

Blog/annuaire d'escape games et de jeux de société. Le site consomme un
backend [Strapi](https://strapi.io/) (GraphQL + quelques endpoints REST) et
est servi en **Next.js (App Router)**, avec rendu serveur du contenu et des
balises meta pour une bonne indexation (Google + crawlers IA).

> Ce projet a remplacé début juillet 2026 une ancienne version en Create
> React App (SPA 100% rendue côté client). Voir `objectif.md` et `plan.md`
> pour le détail de cette migration et l'historique Git pour l'ancien code.

## Démarrer en local

```bash
cp .env.example .env.local   # renseigner au minimum STRAPI_URL
npm install
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm run start   # build de production
```

**Important :** ce code n'a pas encore été installé/compilé dans
l'environnement où il a été écrit (pas d'accès au registre npm en sandbox).
Le premier `npm install && npm run build` local doit être considéré comme une
étape de validation à part entière, pas une formalité — voir "Reste à
faire" ci-dessous.

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les plus importantes :

| Variable | Rôle |
|---|---|
| `STRAPI_URL` | URL du serveur Strapi, joignable **depuis le serveur Next** (réseau interne en prod) |
| `STRAPI_API_TOKEN` | Jeton API Strapi si les endpoints ne sont pas publics en lecture |
| `NEXT_PUBLIC_SITE_ORIGIN` | Origine publique du site, utilisée pour les URLs canoniques/OG |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Clé Google Maps (carte affichée sur les fiches enseigne) |
| `NEXT_PUBLIC_GA4_ID` | Identifiant Google Analytics 4 |
| `REVALIDATE_SECRET` | Secret pour le webhook Strapi de revalidation à la demande |

## Architecture

- `app/` — une route par page (App Router). Les segments dynamiques
  (`[enseigne]`, `[escape]`, `[jeu]`, `[news]`, `[selection]`) correspondent
  aux fiches individuelles, générées en SSG + ISR.
- `components/` — composants React ; la plupart des composants de
  listing/fiche (`EscapeArticle`, `EnseigneArticle`, `*Grid`, `*Card`) sont des
  Server Components asynchrones qui interrogent directement Strapi.
- `lib/strapi.js` — couche serveur d'accès à Strapi (GraphQL + REST),
  avec cache et revalidation Next natifs.
- `lib/metadata.js`, `lib/jsonld.js` — génération des balises meta et du
  JSON-LD par page.
- `app/api/revalidate/route.js` — endpoint appelé par un webhook Strapi pour
  invalider le cache d'une fiche à la publication.
- `styles/` — feuilles SCSS (une par page/composant, comme dans l'ancienne
  version), compilées via `sass`.

## Décisions techniques

- Next.js 16 (App Router) + React 19.
- antd v5 + `@ant-design/v5-patch-for-react-19` (patch officiel de
  compatibilité React 19). antd v5 ne fournit plus de CSS précompilé par
  thème (fini `antd.dark.css`) : le thème sombre est piloté par
  `ConfigProvider` (`theme.darkAlgorithm`), et le CSS-in-JS généré est extrait
  côté serveur via `@ant-design/nextjs-registry` (`<AntdRegistry>` dans
  `app/layout.js`) — sans ce wrapper, les styles n'apparaissent qu'après
  hydratation côté client. `antd/dist/reset.css` est importé en complément.
- Plus de dépendance à `react-router-dom`, `react-ga` (Universal Analytics,
  arrêté par Google mi-2024) ni `node-sass` (déprécié) : remplacés
  respectivement par le routing Next, Google Analytics 4, et `sass`.

## Simplifications assumées (à trancher si besoin)

- **Page `/escapegame` (Browse)** : le filtre est encodé dans un seul
  paramètre d'URL JSON (`?f=...`) plutôt qu'un paramètre par champ, et
  récupère directement les fiches complètes au lieu du double appel
  "ids puis détails" de l'ancienne version.
- **Image mobile des fiches escape** : la bannière sert le format "medium" à
  tout le monde plutôt que de fragmenter le cache par device.
- La clé Google Maps a été sortie du code source (elle y était auparavant en
  clair) — pensez à la régénérer/restreindre par domaine avant mise en prod.

## Reste à faire

Le détail complet est dans `plan.md`. En résumé :

- **Étape 0** (cadrage) : confirmer le diagnostic SEO dans Search Console,
  auditer l'ancien proxy `/api`/cache, décider de l'hébergement cible.
- **Étape 8** (recette/déploiement) : `npm install && npm run build` pour
  valider que le code compile, tests de fumée, recette comparative avec
  l'ancien site, mise en place de l'hébergement Node (SSR/ISR nécessite un
  runtime Node, contrairement à l'ancien build statique), bascule progressive
  et suivi de l'indexation post-lancement.

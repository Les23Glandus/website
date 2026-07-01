# Objectif — Conversion du site Les Glandus vers Next.js

## Contexte

Le site actuel (`lesglandus.fr`) est une SPA React 17 (Create React App, react-router v5), entièrement rendue côté client. Toutes les pages sont des composants classe qui chargent leurs données au montage (`componentDidMount`) via `strapiConnector.js`, lequel interroge en GraphQL/REST un backend Strapi à travers un proxy `/api` en production (avec un système de cache maison basé sur des en-têtes `my-cache`).

Ce mode de rendu pénalise l'indexation :
- Google indexe le contenu JS en deux passes (HTML initial vide, rendu différé), ce qui ralentit la prise en compte des nouvelles fiches.
- Les crawlers IA (GPTBot, ClaudeBot, PerplexityBot...) n'exécutent pas le JS et ne voient qu'une coquille vide.
- Les balises meta (title, description, Open Graph) et le JSON-LD des fiches escape game / enseignes / jeux / actus sont injectés côté client (`react-helmet`, `window.location.href`), donc absents du HTML brut.

Le projet est par ailleurs à l'arrêt depuis mai 2022 (dernier commit), avec plusieurs dépendances mortes ou dépréciées (Universal Analytics via `react-ga`, `node-sass`, `react-scripts`/CRA).

## Objectifs

1. **SEO / indexabilité** : que le HTML renvoyé au premier chargement contienne déjà le contenu, les balises meta et le JSON-LD de chaque page (escape games, enseignes, jeux, actus, sélections en priorité).
2. **Conserver Strapi tel quel** : le CMS/back Strapi n'est pas modifié ; seule la couche de connexion à son API est déplacée côté serveur Next.js.
3. **Ne pas perdre de fonctionnalités** : filtres de recherche (`Browse`), recherche globale, timeline d'actus, formulaires, redirections existantes doivent continuer à fonctionner à l'identique pour l'utilisateur.
4. **Ne pas sous-estimer le chantier front** : toutes les pages doivent être reprises (routing, data-fetching, meta), car c'est ce changement — pas seulement le déplacement de l'appel API — qui produit le bénéfice SEO.
5. **Profiter de la migration pour éponger une partie de la dette technique bloquante** (Universal Analytics mort, `node-sass` déprécié, clé Google Maps exposée en dur), sans en faire une refonte visuelle ou fonctionnelle.

## Hors périmètre

- Pas de refonte graphique ou UX : les pages gardent leur contenu, leur structure et leur design actuels.
- Pas de changement de CMS ni de modèle de données côté Strapi.
- Pas de reprise de contenu éditorial.
- Modernisations "de confort" non bloquantes (upgrade antd v4→v5, react-markdown v5→dernière version) : traitées comme options, pas comme prérequis.

## Découpage en grandes étapes

Le détail tâche par tâche est dans `plan.md`. Chaque tâche y porte un identifiant unique (`Txxx`) rattaché à l'une de ces étapes.

| # | Étape | But |
|---|-------|-----|
| 0 | Cadrage & vérification du diagnostic | Confirmer via Search Console que le problème est bien lié au rendu CSR, auditer le proxy `/api` et le cache actuel, décider de l'architecture cible (hébergement, App Router, versions). |
| 1 | Socle technique Next.js | Initialiser le projet, porter la couche d'accès à Strapi côté serveur, définir la stratégie de cache/revalidation, poser le layout racine. |
| 2 | Composants transverses / SEO | Remplacer `react-helmet` par l'API Metadata de Next, porter le JSON-LD côté serveur, adapter les composants partagés (`Slice`, `Card`, `RichText`, `GoogleMaps`...). |
| 3 | Pages "contenu" à fort enjeu SEO | Migrer en priorité les fiches indexables : escape game, enseigne, jeu, actu, sélection (SSG/ISR). |
| 4 | Pages de listing / navigation | Accueil, annuaire, liste des jeux, sélections, news, page de filtre (`Browse`) — rendu serveur pour la liste, interactivité client pour les filtres. |
| 5 | Pages utilitaires / interactives | Recherche, à propos, 404, 500. |
| 6 | Routing, redirections, SEO technique | Redirections, sitemap.xml, robots.txt, canonical. |
| 7 | Nettoyage dette technique | Remplacement Universal Analytics → GA4, suppression de react-router-dom, dépendances obsolètes. |
| 8 | Tests, recette, déploiement, bascule | Tests de fumée, recette comparative avant/après, mise en place de l'hébergement Next.js, bascule progressive, suivi de l'indexation post-lancement. |

## Principe de priorisation

Les étapes 3 (fiches contenu) et 2 (SEO transverse) sont la priorité : ce sont elles qui répondent directement au problème d'indexation. Les étapes 4-5 (listing/interactif) apportent moins de valeur SEO immédiate mais sont nécessaires pour ne pas laisser le site dans un état hybride. Les étapes 7 (dette technique) peuvent être étalées ou repoussées si le temps manque, sans remettre en cause l'objectif principal.

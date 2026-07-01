/**
 * Config Next.js — voir plan.md étape 6 (T601) pour la liste complète des redirections
 * portées depuis src/App.js (react-router <Redirect>).
 */

// Dérivé de NEXT_PUBLIC_STRAPI_MEDIA_URL (voir .env.example et lib/media.js)
// pour autoriser ce host si next/image est utilisé un jour à la place des
// <img>/antd Image actuels (qui ne sont pas soumis à cette allowlist).
function strapiMediaRemotePattern() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "http://localhost:1337");
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
    };
  } catch {
    return { protocol: "http", hostname: "localhost" };
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // À ajuster avec le vrai nom de domaine/CDN de production si besoin
    // (T002 / T003 — décision d'hébergement, étape 0).
    remotePatterns: [strapiMediaRemotePattern()],
  },

  // T601 — redirections historiques de App.js, portées telles quelles.
  async redirects() {
    return [
      { source: "/entreprise/:enseigne", destination: "/escapegame/:enseigne", permanent: true },
      { source: "/groupe", destination: "/about", permanent: true },
      { source: "/author/:x", destination: "/", permanent: true },
      { source: "/categorie/:x", destination: "/escapegame", permanent: true },
      { source: "/badge/:x", destination: "/escapegame", permanent: true },
      { source: "/pays/:x", destination: "/escapegame", permanent: true },
      { source: "/escape-room-le-jeu", destination: "/jeux/escape-room-le-jeu", permanent: true },
      { source: "/sorties-a-venir-ete-2020", destination: "/news/sorties-a-venir-ete-2020", permanent: true },
      { source: "/unlock-star-wars", destination: "/jeux/unlock-star-wars", permanent: true },
      { source: "/detective", destination: "/jeux/detective", permanent: true },
      { source: "/escape_tag/:x", destination: "/escapegame", permanent: true },
      { source: "/les-glandus-dor-2019", destination: "/selections/les-glandus-d-or-2019", permanent: true },
      { source: "/exit", destination: "/jeux", permanent: true },
      { source: "/et-sinon", destination: "/jeux", permanent: true },
    ];
  },

  sassOptions: {
    includePaths: ["./styles"],
  },
};

module.exports = nextConfig;

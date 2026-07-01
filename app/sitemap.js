import config from "../lib/config";
import { getSelections, getJeux, browseEscapes, searchEnseigne, getRecentActus } from "../lib/strapi";

// T602 — sitemap dynamique généré à partir des données Strapi.
export default async function sitemap() {
  const staticRoutes = ["", "/escapegame", "/entreprise", "/jeux", "/selections", "/news", "/search", "/about"].map(
    (path) => ({ url: config.origin + path, changeFrequency: "daily", priority: path === "" ? 1 : 0.6 })
  );

  const [escapes, enseignes, jeux, selections, actus] = await Promise.all([
    browseEscapes({ preventPush: false }, 5000).catch(() => []),
    searchEnseigne({}, 1000).catch(() => []),
    getJeux(1000).catch(() => []),
    getSelections().catch(() => []),
    getRecentActus(1000).catch(() => []),
  ]);

  const escapeRoutes = (escapes || [])
    .filter((n) => n.enseigne)
    .map((n) => ({
      url: `${config.origin}/escapegame/${n.enseigne.uniquepath}/${n.uniquepath}`,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  const enseigneRoutes = (enseignes || []).map((n) => ({
    url: `${config.origin}/escapegame/${n.uniquepath}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const jeuxRoutes = (jeux || []).map((n) => ({
    url: `${config.origin}/jeux/${n.uniquepath}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const selectionRoutes = (selections || []).map((n) => ({
    url: `${config.origin}/selections/${n.uniquepath}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const actuRoutes = (actus || []).map((n) => ({
    url: `${config.origin}/news/${n.uniquepath}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...escapeRoutes, ...enseigneRoutes, ...jeuxRoutes, ...selectionRoutes, ...actuRoutes];
}

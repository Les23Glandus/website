import config from "./config";
import { markdownToPlainText } from "./markdown";

const SITE_TITLE = "Les Glandus";
const DEFAULT_DESCRIPTION =
  "Le Glandu est une espèce nommée depuis 2016 qui appartient à la famille des Homo-escapus. D'un naturel joueur, le Glandu de base est le plus facilement observable aux abords des points d'activités ludiques... en cherchant bien autour d'une table de jeu ou à la sortie d'une escape, vous pourrez aisément en croiser un.";

/**
 * Remplace components/HtmlHead.js (react-helmet). À utiliser dans
 * `generateMetadata()` de chaque page (Server Component), ce qui permet à
 * Next.js de rendre les balises meta directement dans le HTML initial —
 * c'est ce qui corrige le problème d'indexation (cf. objectif.md).
 *
 * @param {Object} opts
 * @param {string} [opts.title] - titre de la page (sans le suffixe " - Les Glandus")
 * @param {string} [opts.description] - markdown ou texte brut
 * @param {string} opts.pathname - chemin de la page (ex: "/escapegame/foo/bar"), pour og:url et canonical
 * @param {string} [opts.image] - URL absolue de l'image de partage (og:image)
 */
export function buildMetadata({ title, description, pathname, image }) {
  const fullTitle = `${title ? title + " - " : ""}${SITE_TITLE} - Blog et Avis Escape Game`;
  const descr = description ? markdownToPlainText(description) : DEFAULT_DESCRIPTION;
  const url = config.origin + pathname;

  return {
    title: fullTitle,
    description: descr,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: descr,
      url,
      siteName: "LesGlandus.fr",
      locale: "fr_FR",
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: descr,
    },
    other: {
      subject: "Avis et évaluation des salles d'Escape Game.",
      coverage: "Worldwide",
      Classification: "Business",
      "fb:app_id": config.fbAppId,
      "article:author": "Les Glandus",
      "article:section": "Escape Games",
    },
  };
}

export { SITE_TITLE, DEFAULT_DESCRIPTION };

import config from "./config";
import { mediaUrl } from "./media";
import { markdownToPlainText } from "./markdown";

/**
 * Générateurs de JSON-LD — portés depuis components/EscapeArticle.js,
 * components/EnseigneArticle.js, components/JeuxArticle.js,
 * components/Selection.js, components/meta/ShareLinks.js.
 *
 * Différence clé avec l'ancien code (T203) : `mainEntityOfPage["@id"]` utilisait
 * `window.location.href` (donc absent du HTML servi aux crawlers). Ici l'URL est
 * calculée côté serveur et passée explicitement.
 */

export function organizationJsonLd() {
  return {
    "@context": "http://schema.org",
    "@type": "Organization",
    name: "Les Glandus",
    alternateName: "LesGlandus.fr",
    url: config.origin + "/",
    sameAs: [
      "https://lesglandus.fr/",
      "https://www.facebook.com/lesglandus/",
      "https://www.instagram.com/les_glandus/",
      "https://www.youtube.com/channel/UCHroxKGnXQsRAvr9W6SsV4Q",
    ],
  };
}

function itemListJsonLd(items, toUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((n, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: toUrl(n),
      name: n.name || n.title,
      image: n.mini ? mediaUrl(n.mini.url) : "",
    })),
  };
}

export function escapeListJsonLd(escapes) {
  return itemListJsonLd(escapes, (n) => {
    const enseigne = n.enseigne ? n.enseigne.uniquepath : "avis";
    return `${config.origin}/escapegame/${enseigne}/${n.uniquepath}`;
  });
}

export function jeuxListJsonLd(jeux) {
  return itemListJsonLd(jeux, (n) => `${config.origin}/jeux/${n.uniquepath}`);
}

export function enseigneReviewJsonLd(details, url) {
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CriticReview",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    itemReviewed: { "@type": "Organization", name: details.name, url: details.url },
    headline: details.name,
    image: [],
    datePublished: details.published_at,
    dateModified: details.updated_at,
    author: { "@type": "Organization", name: "Les Glandus" },
    publisher: {
      "@type": "Organization",
      name: "Les Glandus",
      logo: { "@type": "ImageObject", url: config.origin + "/AMP-logo.png" },
    },
  };
  if (details.illustration) jsonld.image.push(mediaUrl(details.illustration.url));
  if (details.logo) jsonld.image.push(mediaUrl(details.logo.url));
  return jsonld;
}

export function escapeReviewJsonLd(details, url) {
  const scen = markdownToPlainText(details.scenario);
  const descr = markdownToPlainText(details.description);
  const reviewCount = Math.max(1, details.avantapres ? details.avantapres.length : 1) * 5;

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ReviewNewsArticle",
    itemReviewed: {
      "@type": "Game",
      name: details.name,
      numberOfPlayers: { minValue: details.nbPlayerMin, maxValue: details.nbPlayerMax },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: { "@type": "Language", name: "French", alternateName: "fr" },
    reviewAspect: "Rating",
    abstract: descr || scen,
    articleSection: "Escape Game",
    headline: details.name,
    image: [],
    datePublished: details.published_at,
    dateModified: details.updated_at,
    author: { "@type": "Organization", name: "Les Glandus" },
    reviewRating: {
      "@type": "AggregateRating",
      ratingValue: details.rate,
      bestRating: 5,
      worstRating: 0,
      reviewCount,
    },
    publisher: {
      "@type": "Organization",
      name: "Les Glandus",
      logo: { "@type": "ImageObject", url: config.origin + "/AMP-logo.png" },
    },
  };

  const jsonldAlt = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: details.name,
    brand: { "@type": "Organization", name: details.enseigne ? details.enseigne.name : "" },
    description: scen,
    image: [],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: details.rate,
      bestRating: 5,
      worstRating: 0,
      reviewCount,
    },
    review: {
      "@type": "Review",
      author: { "@type": "Organization", name: "Les Glandus" },
      reviewBody: descr,
      reviewRating: { "@type": "Rating", ratingValue: details.rate, bestRating: 5, worstRating: 0 },
      itemReviewed: {
        "@type": "Product",
        name: details.name,
        brand: details.enseigne ? details.enseigne.name : "",
        image: [],
        description: scen,
        url: details.enseigne ? details.enseigne.url : "",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: details.rate,
          bestRating: 5,
          worstRating: 0,
          reviewCount,
        },
      },
    },
  };

  if (details.mini) {
    jsonld.image.push(mediaUrl(details.mini.url));
    jsonldAlt.image.push(mediaUrl(details.mini.url));
    jsonldAlt.review.itemReviewed.image.push(mediaUrl(details.mini.url));
  }

  return [jsonld, jsonldAlt];
}

export function jeuxReviewJsonLd(details, url) {
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ReviewNewsArticle",
    itemReviewed: { "@type": "Game", name: details.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: { "@type": "Language", name: "French", alternateName: "fr" },
    reviewAspect: "Review",
    abstract: details.description,
    articleSection: "BoardGame",
    headline: details.name,
    image: [],
    datePublished: details.published_at,
    dateModified: details.updated_at,
    author: { "@type": "Organization", name: "Les Glandus" },
    publisher: {
      "@type": "Organization",
      name: "Les Glandus",
      logo: { "@type": "ImageObject", url: config.origin + "/AMP-logo.png" },
    },
  };
  if (details.illustration) jsonld.image.push(mediaUrl(details.illustration.url));
  if (details.mini) jsonld.image.push(mediaUrl(details.mini.url));
  return jsonld;
}

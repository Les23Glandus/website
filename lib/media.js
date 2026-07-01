/**
 * Résolution des URLs de médias renvoyées par Strapi (mini.url, logo.url,
 * illustration.url, formats.*.url, audio.url...).
 *
 * Strapi renvoie ces champs en chemin relatif (ex: "/uploads/small_xxx.png").
 * L'ancien connecteur ne gérait pas ce cas explicitement : ça fonctionnait
 * en production parce que le même nom de domaine reverse-proxait à la fois
 * `/api` ET `/uploads` vers Strapi. En local (Next dev server), il n'y a pas
 * cet effet de bord, donc les <img src="/uploads/..."> pointent vers
 * localhost:3000 au lieu de Strapi -> 404.
 *
 * D'où deux variables d'env distinctes (voir .env.example) :
 *  - STRAPI_URL              : base pour les appels API (GraphQL/REST), côté serveur uniquement.
 *  - NEXT_PUBLIC_STRAPI_MEDIA_URL : base pour les fichiers média, utilisée aussi côté navigateur
 *    (d'où le préfixe NEXT_PUBLIC_, requis par Next pour exposer une variable au client).
 */
const STRAPI_MEDIA_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || process.env.STRAPI_URL || "http://localhost:1337";

/**
 * Transforme un chemin de média Strapi (relatif ou déjà absolu) en URL absolue.
 * Laisse passer les valeurs déjà absolues (http/https) ou vides sans y toucher.
 */
export function mediaUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = STRAPI_MEDIA_URL.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return base + path;
}

export { STRAPI_MEDIA_URL };

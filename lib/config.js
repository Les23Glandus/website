/**
 * Remplace src/class/config.js.
 * Toutes les valeurs viennent de l'environnement (voir .env.example) au lieu
 * d'être en dur dans le code.
 */
const config = {
  origin: process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.lesglandus.fr",
  fbAppId: process.env.NEXT_PUBLIC_FB_APP_ID || "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
};

export default config;

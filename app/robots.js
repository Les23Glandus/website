import config from "../lib/config";

// T603 — remplace public/robots.txt
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${config.origin}/sitemap.xml`,
  };
}

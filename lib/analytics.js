"use client";

/**
 * Remplace ReactGA.event(...) (react-ga / Universal Analytics — mort depuis
 * mi-2024, cf. objectif.md et plan.md T701). Le tag GA4 est chargé globalement
 * via <GoogleAnalytics/> de @next/third-parties dans app/layout.js, qui expose
 * `window.gtag`.
 */
export function trackEvent(category, action, label) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
  });
}

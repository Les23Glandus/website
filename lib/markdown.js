import { Converter } from "showdown";

/**
 * Convertit du markdown en texte brut pour les meta description / og:description
 * (repris de la logique de HtmlHead.js et EscapeCard.js).
 */
export function markdownToPlainText(markdown, maxLength) {
  if (!markdown) return "";
  const converter = new Converter();
  let html = converter.makeHtml(markdown) || "";
  let text = html.replace(/(<([^>]+)>)/gi, " ").replace(/\s+/g, " ").trim();
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength) + "...";
  }
  return text;
}

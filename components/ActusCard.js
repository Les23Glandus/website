import Card from "./meta/Card";
import RichText from "./meta/RichText";
import { markdownToPlainText } from "../lib/markdown";
import { mediaUrl } from "../lib/media";

/**
 * L'ancien composant tronquait la description via une manipulation du DOM
 * côté client (ref + innerText, après montage) — donc absente du HTML initial.
 * Ici le texte est tronqué côté serveur, donc bien présent dans le HTML rendu.
 */
export default function ActusCard({ details, reduce, compact }) {
  let imageUrl;
  if (details.mini) {
    imageUrl = mediaUrl(details.mini.formats?.small ? details.mini.formats.small.url : details.mini.url);
  }

  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(details.date));
  const description = markdownToPlainText(details.description, 300);

  return (
    <Card
      className="actu-card"
      reduce={!!reduce}
      compact={!!compact}
      url={`/news/${details.uniquepath}`}
      title={details.title}
      supTitle={!reduce && date}
      subTitle={reduce && date}
      imageUrl={imageUrl}
      more={<div className="description"><RichText>{description}</RichText></div>}
    />
  );
}

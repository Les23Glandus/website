import Card from "./meta/Card";
import RichText from "./meta/RichText";
import { mediaUrl } from "../lib/media";
import "../styles/jeuxcard.scss";

export default function JeuxCard({ jeux, reduce, compact, date }) {
  let imageUrl;
  if (jeux.mini) {
    imageUrl = mediaUrl(jeux.mini.formats?.small ? jeux.mini.formats.small.url : jeux.mini.url);
  }

  return (
    <Card
      className="jeux-card"
      reduce={!!reduce}
      compact={!!compact}
      url={`/jeux/${jeux.uniquepath}`}
      title={<span>{jeux.name}</span>}
      subTitle={jeux.jeux_types && jeux.jeux_types.map((n) => n.name).join(", ")}
      imageUrl={imageUrl}
      imageTitle={jeux.description}
      more={<div className="description"><RichText>{jeux.description}</RichText></div>}
    >
      {date && <p className="date">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date(jeux.date))}</p>}
    </Card>
  );
}

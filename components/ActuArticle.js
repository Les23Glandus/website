import { Image } from "antd";
import RichText from "./meta/RichText";
import ActusCard from "./ActusCard";
import { getActuByRef } from "../lib/strapi";
import { mediaUrl } from "../lib/media";

export default async function ActuArticle({ actuRef }) {
  const details = await getActuByRef(actuRef);
  if (!details) return null;

  return (
    <div className="article-container article-actu">
      <div className="article-part">
        <div className="left"><ActusCard details={details} reduce /></div>
        <div className="right">
          <h2>{details.title}</h2>
          <p className="date">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date(details.date))}</p>
        </div>
      </div>

      <div className="article-part">
        <div className="left" />
        <div className="right">
          {details.description && <div className="long-text"><RichText>{details.description}</RichText></div>}
        </div>
      </div>

      {details.paragraph?.map((n) => (
        <div className="article-part" key={n.id}>
          <div className="left"><h3>{n.title}</h3></div>
          <div className="right"><div className="longtext"><RichText>{n.article}</RichText></div></div>
        </div>
      ))}

      <div className="article-part">
        <div className="left" />
        <div className="right">
          <RichText>{details.article}</RichText>
          <div className="illustrations">
            {details.illustration && <Image src={mediaUrl(details.illustration.url)} alt={details.title} />}
          </div>
        </div>
      </div>
    </div>
  );
}

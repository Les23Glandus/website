import { Tag } from "antd";
import Card from "./meta/Card";
import RichText from "./meta/RichText";
import JeuxGrid from "./JeuxGrid";
import TopIllustration from "./meta/TopIllustration";
import Slice from "./meta/Slice";
import { getJeuxByRef } from "../lib/strapi";
import { mediaUrl } from "../lib/media";
import "../styles/article.scss";

export default async function JeuxArticle({ jeuRef }) {
  const details = await getJeuxByRef(jeuRef);
  if (!details) return null;

  const illusUrl = details.illustration ? mediaUrl(details.illustration.url) : "/patterns/Pattern04.svg";

  return (
    <div>
      {details.illustration ? (
        <div className="article-illustration top-illustration" title={details.description} style={{ backgroundImage: `url(${illusUrl})` }} />
      ) : (
        <TopIllustration seed={jeuRef} />
      )}

      <Slice className="article-container article-jeux">
        <div className="article-part">
          <div className="left">
            {details.mini && <Card url="#" imageUrl={mediaUrl(details.mini.url)} imageTitle={details.description} />}
          </div>
          <div className="right">
            <h2>{details.name}</h2>
            {details.editeur && <p>{details.editeur}</p>}
            <p className="tags-line">
              {details.jeux_types?.map((t) => <Tag key={t.id}>{t.name}</Tag>)}
            </p>
          </div>
        </div>

        {details.paragraph?.map((n) => (
          <div className="article-part" key={n.id}>
            <div className="left"><h3>{n.title}</h3></div>
            <div className="right"><div className="longtext"><RichText>{n.article}</RichText></div></div>
          </div>
        ))}
      </Slice>

      <Slice breath>
        <JeuxGrid title="A voir aussi..." />
      </Slice>
    </div>
  );
}

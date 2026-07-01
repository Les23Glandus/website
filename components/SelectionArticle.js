import EscapeCard from "./EscapeCard";
import SelectionCard from "./SelectionCard";
import RichText from "./meta/RichText";
import SelectionsGrid from "./SelectionsGrid";
import Slice from "./meta/Slice";
import TopIllustration from "./meta/TopIllustration";
import { getSelectionByRef } from "../lib/strapi";
import { mediaUrl } from "../lib/media";
import "../styles/selection.scss";

export default async function SelectionArticle({ selectionRef, hide }) {
  const details = await getSelectionByRef(selectionRef);
  if (!details) return null;

  return (
    <div className="selection-main">
      {details.image ? (
        <div
          className="article-illustration top-illustration"
          title={details.description}
          style={{ backgroundImage: `url(${mediaUrl(details.image.url)})` }}
        />
      ) : (
        <TopIllustration seed={selectionRef} />
      )}

      <Slice breath>
        <div className="article-container article-selection">
          <div className="article-part">
            <div className="left">
              <div className="logo-area">
                <SelectionCard details={details} reduce arrow={false} />
              </div>
            </div>
            <div className="right">
              <h2>{details.title}</h2>
              <div>{details.description && <RichText>{details.description}</RichText>}</div>
            </div>
          </div>

          {details.paragraph?.map((n) => (
            <div className="article-part" key={n.id}>
              <div className="left"><h3>{n.title}</h3></div>
              <div className="right"><div className="longtext"><RichText>{n.article}</RichText></div></div>
            </div>
          ))}
        </div>

        {details.escapes?.length > 0 && (
          <div>
            {details.escapes
              .filter((n) => n.id !== parseInt(hide))
              .sort((a, b) => b.rate - a.rate)
              .map((n) => (
                <EscapeCard key={n.id} escape={n} enseigne={n.enseigne} />
              ))}
          </div>
        )}
      </Slice>

      <Slice colored breath>
        <SelectionsGrid />
      </Slice>
    </div>
  );
}

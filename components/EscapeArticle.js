import Link from "next/link";
import { Image, Tag } from "antd";
import Note from "./meta/Note";
import EnseigneArticle from "./EnseigneArticle";
import SelectionCard from "./SelectionCard";
import EscapeLatestsTests from "./EscapeLatestsTests";
import Card from "./meta/Card";
import RichText from "./meta/RichText";
import TopIllustration from "./meta/TopIllustration";
import Slice from "./meta/Slice";
import { getEscapeByRef } from "../lib/strapi";
import { mediaUrl } from "../lib/media";
import "../styles/article.scss";
import "../styles/escapeArticle.scss";

/**
 * Server Component asynchrone — remplace components/EscapeArticle.js.
 * Metadata + JSON-LD gérés par app/escapegame/[enseigne]/[escape]/page.js.
 *
 * Simplification assumée (à documenter/valider en étape 0) : l'ancienne
 * version choisissait une image "medium" plutôt que l'originale sur mobile
 * (détection via react-device-detect côté client). En SSR, cette détection
 * nécessiterait de fragmenter le cache par device ; on sert ici l'image
 * "medium" à tout le monde quand elle existe, ce qui reste plus léger que
 * l'original pour la bannière d'illustration.
 */
export default async function EscapeArticle({ escapeRef }) {
  const details = await getEscapeByRef(escapeRef);
  if (!details) return null;

  const pays = [];
  const paysID = [];
  const regions = [];
  const regionID = [];
  const town = [];
  const regroupements = [];
  (details.addresses || []).forEach((addr) => {
    if (addr.pay && !pays.includes(addr.pay.name)) pays.push(addr.pay.name);
    if (addr.pay && !paysID.includes(addr.pay.id)) paysID.push(addr.pay.id);
    if (addr.region && !regions.includes(addr.region.name)) regions.push(addr.region.name);
    if (addr.town && !regions.includes(addr.town) && !town.includes(addr.town)) town.push(addr.town);
    if (addr.regroupement && !regroupements.includes(addr.regroupement.id)) regroupements.push(addr.regroupement.id);
    if (addr.region && !regionID.includes(addr.region.id)) regionID.push(addr.region.id);
  });

  const illusUrl = details.illustration
    ? mediaUrl(details.illustration.formats?.medium?.url || details.illustration.url)
    : "/patterns/Pattern04.svg";

  return (
    <div>
      {details.illustration ? (
        <div className="article-illustration top-illustration" title={details.description} style={{ backgroundImage: `url(${illusUrl})` }} />
      ) : (
        <TopIllustration seed={escapeRef} />
      )}

      <Slice breath>
        <div className="article-container article-escape">
          {details.glandusor && (
            <div className="glandus-or">
              <p><span>{details.glandusor}</span></p>
            </div>
          )}

          <div className="article-part">
            <div className="left">
              {details.mini && <Card url="#" imageUrl={mediaUrl(details.mini.url)} imageTitle={details.description} />}
            </div>
            <div className="right">
              <div className="title-flex">
                <div>
                  {pays.length > 0 && (
                    <p className="region">
                      {pays.join(", ")}
                      {regions.length > 0 && ` - ${regions.join(", ")}`}
                      {town.length > 0 && ` - ${town.join(", ")}`}
                    </p>
                  )}
                  <h2>
                    {details.name}{" "}
                    {(details.isOpen === false || details.enseigne?.isOpen === false) && <span className="closed-info">(Fermée)</span>}
                  </h2>
                  {details.enseigne && (
                    <p>
                      Chez <Link href={`/escapegame/${details.enseigne.uniquepath}`}>{details.enseigne.name}</Link>
                      {details.date && <span>&nbsp;|&nbsp;Testé en {details.date.substring(0, 4)}</span>}
                    </p>
                  )}
                </div>
                <div>
                  <Note value={details.rate} />
                </div>
              </div>

              <div className="tags-line">
                {details.nbPlayerMax === details.nbPlayerMin && details.nbPlayerMin === 1 && <Tag>{details.nbPlayerMin} joueur</Tag>}
                {details.nbPlayerMax === details.nbPlayerMin && details.nbPlayerMin >= 1 && details.nbPlayerMin !== 1 && (
                  <Tag>{details.nbPlayerMin} joueurs</Tag>
                )}
                {details.nbPlayerMax !== details.nbPlayerMin && (
                  <Tag>{details.nbPlayerMin} à {details.nbPlayerMax} joueurs</Tag>
                )}
                {(details.tags || [])
                  .filter((t) => t.isMention)
                  .sort((a, b) => (!b.name ? 1 : a.name.localeCompare(b.name)))
                  .map((t) => (
                    <Tag key={t.id} title={t.description} className="mention">{t.name}</Tag>
                  ))}
                {(details.tags || [])
                  .filter((t) => !t.isMention && !t.isGold)
                  .sort((a, b) => (!b.name ? 1 : a.name.localeCompare(b.name)))
                  .map((t) => (
                    <Tag key={t.id} title={t.description}>{t.name}</Tag>
                  ))}
              </div>

              {details.scenario && <div className="longtext scenario"><RichText>{details.scenario}</RichText></div>}
            </div>
          </div>

          {details.story && (
            <div className="article-part">
              <div className="left"><h3>Notre Histoire</h3></div>
              <div className="right">
                <div className="longtext">
                  {details.audio && (
                    <audio controls controlsList="nodownload">
                      <source src={mediaUrl(details.audio.url)} type="audio/mpeg" />
                    </audio>
                  )}
                  <RichText>{details.story}</RichText>
                </div>
              </div>
            </div>
          )}

          {details.paragraph?.map((n) => (
            <div className="article-part" key={n.id}>
              <div className="left"><h3>{n.title}</h3></div>
              <div className="right"><div className="longtext"><RichText>{n.article}</RichText></div></div>
            </div>
          ))}

          {(details.lesPlus || details.lesMoins) && (
            <div className="article-highlight">
              {details.lesPlus && (
                <div className="article-part">
                  <div className="left"><h3>Les plus</h3></div>
                  <div className="right"><div className="longtext"><RichText>{details.lesPlus}</RichText></div></div>
                </div>
              )}
              {details.lesMoins && (
                <div className="article-part">
                  <div className="left"><h3>Les moins</h3></div>
                  <div className="right"><div className="longtext"><RichText>{details.lesMoins}</RichText></div></div>
                </div>
              )}
            </div>
          )}

          {details.avantapres?.length > 0 && (
            <div className="article-part">
              <div className="left"><h3>Avant / Aprés</h3></div>
              <div className="right avantapres">
                {details.avantapres.map((n, i) => {
                  const rot = ["-4deg", "3deg", "-1deg", "10deg"];
                  return (
                    <Image
                      style={{ transform: `rotate(${rot[i % rot.length]})` }}
                      key={n.id}
                      width={300}
                      src={mediaUrl(n.image.url)}
                      alt={n.when || ""}
                      title={n.when}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Slice>

      {details.selections?.length > 0 && (
        <Slice className="in-selection">
          <h3>Présente dans {details.selections.length === 1 ? "la sélection" : "les sélections suivantes"} :</h3>
          <div className="flexgrid">
            {details.selections.map((n) => <SelectionCard reduce key={n.id} details={n} />)}
          </div>
        </Slice>
      )}

      {details.enseigne && (
        <Slice colored nopadding>
          <EnseigneArticle enseigneRef={details.enseigne.uniquepath} embeded hide={details.id} />
        </Slice>
      )}

      <Slice breath>
        <EscapeLatestsTests
          title="A voir aussi dans le coin..."
          notID={details.id}
          regroupement={regroupements}
          notEnseingeID={details.enseigne ? details.enseigne.id : null}
          nbCards={7}
          paysID={paysID}
          region={regionID}
          tagslist={details.tags ? details.tags.map((n) => n.id) : []}
        />
      </Slice>
    </div>
  );
}

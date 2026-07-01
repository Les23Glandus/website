import { Tag } from "antd";
import Card from "./meta/Card";
import Note from "./meta/Note";
import RichText from "./meta/RichText";
import { markdownToPlainText } from "../lib/markdown";
import { mediaUrl } from "../lib/media";
import "../styles/escapecard.scss";

export default function EscapeCard({ escape, enseigne, reduce, compact, date }) {
  const descriptionText = markdownToPlainText(escape.scenario, 300);

  let imageUrl;
  if (escape.mini) {
    imageUrl = mediaUrl(escape.mini.formats?.small ? escape.mini.formats.small.url : escape.mini.url);
  }

  const enseigneuip = enseigne ? enseigne.uniquepath : "avis";

  const pays = [];
  const regions = [];
  const town = [];
  (escape.addresses || []).forEach((addr) => {
    if (addr.pay && !pays.includes(addr.pay.name)) pays.push(addr.pay.name);
    if (addr.region && !regions.includes(addr.region.name)) regions.push(addr.region.name);
    if (addr.town && !regions.includes(addr.town) && !town.includes(addr.town)) town.push(addr.town);
  });

  let topinfo;
  if (pays.length > 0) {
    let addrTxt = pays.join(", ");
    if (regions.length > 0) addrTxt += " - " + regions.join(", ");
    if (town.length > 0) addrTxt += " - " + town.join(", ");
    topinfo = <span className="region" title={addrTxt}>{addrTxt}</span>;
  }

  return (
    <Card
      className="escape-card"
      preview={!escape.name}
      compact={!!compact}
      reduce={!!reduce}
      url={`/escapegame/${enseigneuip}/${escape.uniquepath}`}
      title={
        <span title={escape.name}>
          <span className="t">{escape.name}</span> <Note value={escape.rate} light={!!reduce} compact />
        </span>
      }
      subTitle={enseigne ? enseigne.name : <span>&nbsp;</span>}
      supTitle={topinfo}
      imageUrl={imageUrl}
      imageTitle={descriptionText}
      more={<div className="description"><RichText>{descriptionText}</RichText></div>}
    >
      {date && <p className="date">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date(escape.date))}</p>}
      {escape.glandusor && (
        <div className="tags taggold">
          <Tag>{escape.glandusor}</Tag>
        </div>
      )}
      <div className="tags">
        {escape.nbPlayerMax === escape.nbPlayerMin && escape.nbPlayerMin === 1 && <Tag>{escape.nbPlayerMin} joueur</Tag>}
        {escape.nbPlayerMax === escape.nbPlayerMin && escape.nbPlayerMin >= 1 && escape.nbPlayerMin !== 1 && (
          <Tag>{escape.nbPlayerMin} joueurs</Tag>
        )}
        {escape.nbPlayerMax !== escape.nbPlayerMin && (
          <Tag>
            {escape.nbPlayerMin} à {escape.nbPlayerMax} joueurs
          </Tag>
        )}
        {(escape.tags || [])
          .filter((t) => !t.isGold && t.isMention)
          .sort((a, b) => (!b.name ? 1 : a.name.localeCompare(b.name)))
          .map((t) => (
            <Tag key={t.id} className="mention">{t.name}</Tag>
          ))}
        {(escape.tags || [])
          .filter((t) => !t.isGold && !t.isMention)
          .sort((a, b) => (!b.name ? 1 : a.name.localeCompare(b.name)))
          .map((t) => (
            <Tag key={t.id}>{t.name}</Tag>
          ))}
      </div>
      {escape.name && (!escape.isOpen || (enseigne && !enseigne.isOpen)) && (
        <div className="tags">
          <Tag className="closed-tag">Fermée</Tag>
        </div>
      )}
    </Card>
  );
}

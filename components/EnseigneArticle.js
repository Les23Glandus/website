import Link from "next/link";
import EscapeCard from "./EscapeCard";
import TopIllustration from "./meta/TopIllustration";
import RichText from "./meta/RichText";
import GoogleMaps from "./meta/GoogleMaps";
import OtherEnseigne from "./OtherEnseigne";
import Slice from "./meta/Slice";
import { getEnseigneByRef } from "../lib/strapi";
import { mediaUrl } from "../lib/media";
import "../styles/enseigneArticle.scss";

/**
 * Server Component asynchrone — remplace components/EnseigneArticle.js.
 * La génération de metadata/JSON-LD est désormais gérée par la page qui
 * l'utilise (app/escapegame/[enseigne]/page.js), pas par ce composant : voir
 * lib/metadata.js et lib/jsonld.js.
 */
export default async function EnseigneArticle({ enseigneRef, embeded = false, hide }) {
  let details;
  try {
    details = await getEnseigneByRef(enseigneRef);
  } catch {
    details = null;
  }
  if (!details) return null;

  const address = [];
  const city = [];
  const region = [];
  const pays = [];
  (details.addresses || []).forEach((n) => {
    let pics = null;
    if (details.logo) {
      pics = mediaUrl(details.logo.formats?.thumbnail ? details.logo.formats.thumbnail.url : details.logo.url);
    }
    const ad = [n.street, n.postcode, n.town];
    if (n.pay) ad.push(n.pay.name);
    const adTxt = ad.join(" ");
    if (!/^\s*$/.test(adTxt)) address.push({ name: n.name, icone: pics, address: adTxt });

    if (!city.includes(n.town)) city.push(n.town);
    if (n.region && !region.includes(n.region.name)) region.push(n.region.name);
    if (n.pay && !pays.includes(n.pay.name)) pays.push(n.pay.name);
  });

  return (
    <div className="enseigne-main">
      {!embeded && details.illustration && (
        <div
          className="article-illustration top-illustration"
          title={details.description}
          style={{ backgroundImage: `url(${mediaUrl(details.illustration.url)})` }}
        />
      )}
      {!embeded && !details.illustration && <TopIllustration seed={enseigneRef} />}

      <Slice breath>
        <div className="article-container article-enseigne">
          <div className="article-part">
            <div className="left">
              <div className="logo-area">
                {details.logo?.formats && !embeded && <img src={mediaUrl(details.logo.formats.thumbnail.url)} alt={details.name} />}
                {details.logo?.formats && embeded && (
                  <Link href={`/escapegame/${details.uniquepath}`}>
                    <img src={mediaUrl(details.logo.formats.thumbnail.url)} alt={details.name} />
                  </Link>
                )}
              </div>
            </div>
            <div className="right">
              <h2>
                {details.name} {details.isOpen === false && <span className="closed-info">(Enseigne fermée)</span>}
              </h2>
              {!embeded && (pays.length > 0 || region.length > 0 || city.length > 0) && (
                <p className="loc">{city.concat(region, pays).join(" - ")}</p>
              )}
              {details.introduction && <RichText>{details.introduction}</RichText>}
            </div>
          </div>

          {details.ourExperience && (
            <div className="article-part">
              <div className="left"><h3>Notre expérience</h3></div>
              <div className="right"><RichText>{details.ourExperience}</RichText></div>
            </div>
          )}

          {details.url && (
            <div className="article-part">
              <div className="left"><h3>Site de l'enseigne</h3></div>
              <div className="right">
                <a href={details.url} target="_blank" rel="noreferrer" className="outlink">{details.url}</a>
              </div>
            </div>
          )}

          {!embeded && address.length > 0 && (
            <div className="googlemaps">
              <GoogleMaps address={address} />
            </div>
          )}
        </div>

        {details.escapes?.filter((n) => n.isOpen && parseInt(n.id) !== parseInt(hide)).length > 0 && (
          <div>
            {details.escapes.filter((n) => n.isOpen && parseInt(n.id) !== parseInt(hide)).map((n) => (
              <EscapeCard key={n.id} escape={n} enseigne={details} />
            ))}
          </div>
        )}
        {!embeded && (
          <div>
            {details.escapes?.filter((n) => !n.isOpen && parseInt(n.id) !== parseInt(hide)).map((n) => (
              <EscapeCard key={n.id} escape={n} enseigne={details} />
            ))}
          </div>
        )}
      </Slice>

      {!embeded && (
        <Slice breath colored>
          <OtherEnseigne />
        </Slice>
      )}
    </div>
  );
}

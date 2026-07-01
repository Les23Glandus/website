import Card from "./meta/Card";
import JeuxCard from "./JeuxCard";
import { getJeux, getRecentJeux } from "../lib/strapi";

/**
 * Note : l'ancienne version injectait aussi le <HtmlHead>/JSON-LD ItemList
 * quand showAll=true. Ce n'est plus le rôle de ce composant (T201) : c'est
 * app/jeux/page.js qui gère generateMetadata + JsonLd, à partir des mêmes
 * données (lib/jsonld.js -> jeuxListJsonLd).
 */
export default async function JeuxGrid({ showAll, title = "Nos articles" }) {
  let details;
  try {
    details = showAll ? await getJeux() : await getRecentJeux(3);
  } catch {
    return null;
  }
  if (!details) return null;

  if (!showAll) {
    return (
      <div className="selections-list">
        {title && <h3>{title}</h3>}
        <div className="flexgrid grid-actus">
          {details.map((n) => (
            <JeuxCard key={"jc" + n.id} jeux={n} reduce />
          ))}
          <Card className="seemore-card" reduce url="/jeux" bigText="Tous nos articles" />
        </div>
      </div>
    );
  }

  const years = [];
  for (let y = new Date().getFullYear(); y >= 2017; y--) years.push(y);

  return (
    <div className="selections-list">
      <div className="flexgrid grid-actus">
        {years.map((y) => {
          const list = details.filter((n) => (n.date || "2021").indexOf(y) >= 0);
          if (list.length === 0) return null;
          return (
            <div key={y}>
              <h3>{y}</h3>
              <div className="flexgrid grid-actus">
                {list.map((n) => (
                  <JeuxCard key={"jc" + n.id} jeux={n} reduce />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

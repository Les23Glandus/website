import EscapeCard from "./EscapeCard";
import Card from "./meta/Card";
import { browseEscapes, getEscapeByRef, getRecentEscapes } from "../lib/strapi";

/**
 * Server Component asynchrone : la sélection aléatoire d'escapes "à voir
 * aussi" est calculée côté serveur au moment du rendu, donc présente dans le
 * HTML initial (utile pour le maillage interne / SEO), contrairement à
 * l'ancienne version qui la chargeait après montage.
 */
export default async function EscapeLatestsTests({
  title,
  tagslist,
  notID,
  notEnseingeID,
  regroupement,
  paysID,
  region,
  nbCards = 3,
}) {
  const lastescapes = await loadEscapes({ tagslist, notID, notEnseingeID, regroupement, paysID, region, nbCards });

  return (
    <div className="latest-ei-tests">
      <h3>{title || "Les nouveaux tests"}</h3>
      <div>
        {lastescapes && (
          <div className="flexgrid grid-escape">
            {lastescapes.map((n) => (
              <EscapeCard key={"ec" + n.id} reduce escape={n} enseigne={n.enseigne} />
            ))}
            <Card
              className="seemore-card"
              reduce
              url="/escapegame"
              bigText="Toutes les expériences immersives"
              subTitle={<span>&nbsp;</span>}
              title={<span>&nbsp;</span>}
            />
          </div>
        )}
      </div>
    </div>
  );
}

async function loadEscapes({ tagslist, notID, notEnseingeID, regroupement, paysID, region, nbCards }) {
  if (!tagslist) {
    const list = await getRecentEscapes(nbCards);
    return Array.isArray(list) ? list : [list];
  }

  const sortOptions = ["date:ASC", "name:ASC", "rate:ASC", "date:DESC", "name:DESC", "rate:DESC"];
  const query = { isOpen: true, preventPush: false, "enseigne.isOpen": true };
  if (tagslist.length > 0) query.tags = tagslist;
  if (notID) query["id_ne"] = notID;
  if (notEnseingeID) query["enseigne.id_ne"] = notEnseingeID;
  if (regroupement && regroupement.length > 0) query["addresses.regroupement.id"] = regroupement;
  else if (paysID && paysID.length > 0) query["addresses.pay.id"] = paysID;
  if (region && region.length > 0) query["addresses.region.id"] = region;

  let list = await browseEscapes(query, 30, sortOptions[~~(Math.random() * sortOptions.length)], true);
  list = list || [];

  let subList;
  if (list.length > nbCards) {
    subList = [];
    for (let i = 0; i < nbCards; i++) {
      const index = ~~(Math.random() * list.length);
      subList.push(list.splice(index, 1)[0].uniquepath);
    }
  } else {
    subList = list.map((n) => n.uniquepath);
    delete query.tags;
    let nlist = await browseEscapes(query, 10, sortOptions[~~(Math.random() * sortOptions.length)], true);
    nlist = (nlist || []).filter((n) => !subList.includes(n.uniquepath));
    for (let i = subList.length; i < nbCards && nlist.length > 0; i++) {
      const index = ~~(Math.random() * nlist.length);
      const up = nlist.splice(index, 1)[0].uniquepath;
      if (!subList.includes(up)) subList.push(up);
    }
  }

  if (subList.length === 0) return [];
  const result = await getEscapeByRef(subList);
  return Array.isArray(result) ? result : [result];
}

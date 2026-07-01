import { getRealisation } from "../lib/strapi";

export default async function EscapeBilan() {
  let realisation = null;
  try {
    realisation = await getRealisation();
  } catch {
    realisation = null;
  }

  if (!realisation) return null;

  return (
    <div className="bilan-ei-tests">
      <div className="realisation">
        Au cours de nos {realisation.count} escapes, nous avons sauvé le monde {realisation.saveWorld} fois et sauvé
        notre peau {realisation.saveUs} fois. Nous avons déjoué {realisation.rituals} rituels sataniques et{" "}
        {realisation.plan} plans machiavéliques. Nous pouvons mentionner également {realisation.timeTravels} voyages
        dans le temps, {realisation.tresors} trésors trouvés et {realisation.prisons} séjours derrière les
        barreaux… bref, nous avons une vie trépidante !
      </div>
    </div>
  );
}

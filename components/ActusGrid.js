import ActusCard from "./ActusCard";
import Card from "./meta/Card";
import { getRecentActus } from "../lib/strapi";

export default async function ActusGrid() {
  let details;
  try {
    details = await getRecentActus(7);
  } catch {
    return null;
  }
  if (!details) return null;

  return (
    <div className="actus-list">
      <h3>Actus Glandus</h3>
      <div>
        <div className="flexgrid grid-actus">
          {details.map((n) => (
            <ActusCard key={"ac" + n.id} details={n} reduce />
          ))}
          <Card className="seemore-card" reduce url="/news" bigText="Toutes nos actus" />
        </div>
      </div>
    </div>
  );
}

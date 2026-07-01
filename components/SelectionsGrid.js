import SelectionCard from "./SelectionCard";
import Card from "./meta/Card";
import { getChoixSelection, getSelections } from "../lib/strapi";

export default async function SelectionsGrid({ showAll }) {
  let details;
  try {
    details = showAll ? await getSelections() : await getChoixSelection();
  } catch {
    return null;
  }

  if (!details) return null;

  const list = showAll ? [...details].sort((a, b) => b.priority - a.priority) : details.Selections;

  return (
    <div className="selections-list">
      <h3>Nos sélections</h3>
      <div>
        <div className="flexgrid grid-actus">
          {!showAll && list.map((n) => <SelectionCard key={"sc" + n.selection.id} details={n.selection} reduce />)}
          {showAll && list.map((n) => <SelectionCard key={"sc" + n.id} details={n} reduce />)}
          {!showAll && <Card className="seemore-card" reduce url="/selections" bigText="Toutes nos sélections" />}
        </div>
      </div>
    </div>
  );
}

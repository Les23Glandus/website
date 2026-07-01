import Card from "./meta/Card";

export default function OtherEnseigne() {
  return (
    <div className="browse-enseigne">
      <h3>Les enseignes</h3>
      <div className="flexgrid grid-actus">
        <Card className="toenseigne-card" reduce url="/entreprise/" bigText="Voir toutes les enseignes" compact arrow={false} />
      </div>
    </div>
  );
}

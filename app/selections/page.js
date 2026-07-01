import SelectionsGrid from "../../components/SelectionsGrid";
import Slice from "../../components/meta/Slice";
import TopIllustration from "../../components/meta/TopIllustration";
import { buildMetadata } from "../../lib/metadata";

// T405
export const metadata = buildMetadata({ title: "Nos sélections", pathname: "/selections" });

export default function SelectionsListPage() {
  return (
    <div>
      <TopIllustration seed="selections" />
      <Slice breath>
        <div className="all-selections">
          <h2>Les Glandus ont fait leurs choix !</h2>
          <p>
            Voici une liste de nos sélections régulièrement mises à jour. Elles devraient vous aider à rechercher
            votre prochaine salle !
          </p>
          <p>En laissant la souris au dessus d'une image vous aurez une brève description de la sélection.</p>
          <SelectionsGrid showAll />
        </div>
      </Slice>
    </div>
  );
}

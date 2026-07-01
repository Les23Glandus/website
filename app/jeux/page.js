import JeuxGrid from "../../components/JeuxGrid";
import JsonLd from "../../components/meta/JsonLd";
import Slice from "../../components/meta/Slice";
import TopIllustration from "../../components/meta/TopIllustration";
import { buildMetadata } from "../../lib/metadata";
import { jeuxListJsonLd } from "../../lib/jsonld";
import { getJeux } from "../../lib/strapi";

// T404
export const metadata = buildMetadata({
  title: "Nos articles Jeux de société",
  description: "Liste des articles sur les jeux de société et livres d'escapes.",
  pathname: "/jeux",
});

export default async function JeuxListPage() {
  let jeux = [];
  try {
    jeux = (await getJeux()) || [];
  } catch {
    jeux = [];
  }

  return (
    <div>
      <JsonLd data={jeuxListJsonLd(jeux)} />
      <TopIllustration seed="jeux" />
      <Slice className="all-selections" breath>
        <h2>Les Glandus sont joueurs !</h2>
        <p>
          Entre deux missions, on s'entraîne et puis on aime bien jeter des dés, mélanger des cartes, fomenter les
          pires trahisons etc… etc…
        </p>
        <JeuxGrid showAll title={false} />
      </Slice>
    </div>
  );
}

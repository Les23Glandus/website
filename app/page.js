import { Suspense } from "react";
import Carousel from "../components/Carousel";
import EscapeBilan from "../components/EscapeBilan";
import EscapeLatestsTests from "../components/EscapeLatestsTests";
import SelectionsGrid from "../components/SelectionsGrid";
import JeuxGrid from "../components/JeuxGrid";
import ActusGrid from "../components/ActusGrid";
import Group from "../components/Group";
import Slice from "../components/meta/Slice";
import { buildMetadata } from "../lib/metadata";
import "../styles/home.scss";

// T401 — page d'accueil
export const metadata = buildMetadata({ pathname: "/" });

export default function HomePage() {
  return (
    <div className="home">
      {/* Carousel = hero, above the fold, probable candidate LCP : reste
          synchrone pour ne pas retarder l'affichage initial.
          Le reste est en dessous de la ligne de flottaison et fait chacun un
          appel Strapi indépendant : Suspense permet d'envoyer le shell de la
          page immédiatement et de streamer ces blocs en parallèle dès qu'ils
          sont prêts, plutôt que d'attendre les 5 fetch avant le premier
          octet envoyé au navigateur. */}
      <Carousel />

      <Slice breath>
        <h2 className="main-subtitle">Expériences Immersives</h2>
        <Suspense fallback={null}>
          <EscapeBilan />
        </Suspense>
        <EscapeLatestsTests />
        <Suspense fallback={null}>
          <SelectionsGrid />
        </Suspense>
      </Slice>

      <Slice breath colored className="section-jeux">
        <h2>Jeux de société</h2>
        <Suspense fallback={null}>
          <JeuxGrid />
        </Suspense>
      </Slice>

      <Slice breath>
        <h2>Notre actualité</h2>
        <Suspense fallback={null}>
          <ActusGrid />
        </Suspense>
      </Slice>

      <Suspense fallback={null}>
        <Group />
      </Suspense>
    </div>
  );
}

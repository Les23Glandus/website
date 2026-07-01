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
      <Carousel />

      <Slice breath>
        <h2 className="main-subtitle">Expériences Immersives</h2>
        <EscapeBilan />
        <EscapeLatestsTests />
        <SelectionsGrid />
      </Slice>

      <Slice breath colored className="section-jeux">
        <h2>Jeux de société</h2>
        <JeuxGrid />
      </Slice>

      <Slice breath>
        <h2>Notre actualité</h2>
        <ActusGrid />
      </Slice>

      <Group />
    </div>
  );
}

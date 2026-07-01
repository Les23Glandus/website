import Link from "next/link";
import ShareLinks from "./meta/ShareLinks";

export default function Footer() {
  return (
    <div className="main-footer">
      <div>
        <img src="/Glandus-192px.png" alt="Logo Les Glandus" />
      </div>
      <div>
        <ul className="sitemap">
          <li className="home"><Link href="/">Accueil</Link></li>
          <li><Link href="/escapegame/">Immersive Game</Link></li>
          <li><Link href="/selections/">Nos sélections</Link></li>
          <li><Link href="/jeux/">Jeux de société</Link></li>
          <li><Link href="/news">Actualités</Link></li>
          <li><Link href="/about">A propos</Link></li>
          <li><Link href="/search">Recherchez</Link></li>
        </ul>
      </div>
      <ShareLinks />
    </div>
  );
}

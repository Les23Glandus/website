import "../../styles/meta_topillustration.scss";

/**
 * Server Component : le pattern est choisi de façon déterministe (basé sur le
 * chemin fourni) plutôt qu'aléatoirement au rendu (Math.random() côté client
 * dans l'ancienne version) pour éviter tout mismatch d'hydratation SSR/CSR.
 */
export default function TopIllustration({ seed = "" }) {
  const patterns = 12;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const n = (hash % patterns) + 1;
  const imageUrl = `/patterns/Pattern${n < 10 ? "0" : ""}${n}.svg`;

  return <div className="top-illustration" style={{ backgroundImage: `url(${imageUrl})` }} />;
}

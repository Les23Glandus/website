import Link from "next/link";
import Slice from "../../components/meta/Slice";
import TopIllustration from "../../components/meta/TopIllustration";
import { buildMetadata } from "../../lib/metadata";
import { searchEnseigne } from "../../lib/strapi";
import { mediaUrl } from "../../lib/media";
import "../../styles/allEnseigne.scss";

// T403
export const metadata = buildMetadata({ title: "Toutes les enseignes", pathname: "/entreprise" });

export default async function AllEnseignePage() {
  let details = [];
  try {
    details = (await searchEnseigne({}, 1000)) || [];
  } catch {
    details = [];
  }

  return (
    <div>
      <TopIllustration seed="entreprise" />
      <Slice breath className="all-enseignes">
        <h2>Toutes les enseignes en une seule liste.</h2>
        <div className="list">
          {details.map((n) => {
            let img = "/patterns/Pattern04.svg";
            if (n.logo) {
              img = mediaUrl(n.logo.formats?.thumbnail ? n.logo.formats.thumbnail.url : n.logo.url);
            }
            return (
              <div key={"c" + n.id}>
                <Link href={`/escapegame/${n.uniquepath}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={n.name} title={n.name} width={150} height={150} />
                </Link>
              </div>
            );
          })}
        </div>
      </Slice>
    </div>
  );
}

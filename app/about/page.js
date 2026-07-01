import { Image } from "antd";
import Slice from "../../components/meta/Slice";
import TopIllustration from "../../components/meta/TopIllustration";
import { buildMetadata } from "../../lib/metadata";
import { getAPropos, getGlanduses } from "../../lib/strapi";
import { mediaUrl } from "../../lib/media";
import "../../styles/apropos.scss";

// T502
export async function generateMetadata() {
  const details = await getAPropos().catch(() => null);
  return buildMetadata({ title: "A propos", description: details?.article, pathname: "/about" });
}

export default async function AboutPage() {
  const [details, glandus] = await Promise.all([
    getAPropos().catch(() => null),
    getGlanduses().catch(() => []),
  ]);

  if (!details) {
    return (
      <div>
        <TopIllustration seed="about" />
        <div className="main-content-page">Page indisponible pour le moment.</div>
      </div>
    );
  }

  const illustrations = details.illustrations ? [...details.illustrations] : [];
  const firstImage = illustrations.length > 0 ? illustrations.shift() : null;

  return (
    <Slice>
      <div className="top-illustrations">{firstImage && <Image src={mediaUrl(firstImage.url)} alt="" />}</div>

      <div className="a-propos main-content-page">
        <div className="article">
          <h2>{details.title}</h2>
          <div>{details.article}</div>
        </div>

        <div className="groupe">
          {(glandus || []).map((n) => (
            <div className="gland" key={"g" + n.id}>
              <h3>{n.name}</h3>
              <div>{n.description}</div>
            </div>
          ))}
        </div>

        <div className="illustrations">
          {illustrations.map((n) => <Image key={"img" + n.id} src={mediaUrl(n.url)} alt="" />)}
        </div>
      </div>
    </Slice>
  );
}

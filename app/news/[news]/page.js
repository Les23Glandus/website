import Link from "next/link";
import { notFound } from "next/navigation";
import ActuArticle from "../../../components/ActuArticle";
import ActusGrid from "../../../components/ActusGrid";
import EscapeLatestsTests from "../../../components/EscapeLatestsTests";
import TopIllustration from "../../../components/meta/TopIllustration";
import Slice from "../../../components/meta/Slice";
import { buildMetadata } from "../../../lib/metadata";
import { getActuByRef, getRecentActus } from "../../../lib/strapi";
import { mediaUrl } from "../../../lib/media";
import "../../../styles/actus.scss";

// T304
export async function generateStaticParams() {
  try {
    const list = await getRecentActus(1000);
    return (list || []).map((n) => ({ news: n.uniquepath }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { news } = await params;
  const details = await getActuByRef(news);
  if (!details) return {};

  const ogimage = details.mini?.formats?.medium?.url || details.mini?.url;
  return buildMetadata({
    title: `News - ${details.title}`,
    description: details.description,
    pathname: `/news/${news}`,
    image: ogimage ? mediaUrl(ogimage) : undefined,
  });
}

export default async function ActuPage({ params }) {
  const { news } = await params;
  const details = await getActuByRef(news);
  if (!details) notFound();

  return (
    <div className="actu-main-page">
      <TopIllustration seed={news} />
      <Slice breath>
        {/* Ancien <PageHeader onBack={() => window.location.href="/news"}/> (antd
            PageHeader, retiré du cœur d'antd en v5) remplacé par un simple lien. */}
        <div className="page-header-back">
          <Link href="/news">&larr; Actualité</Link>
        </div>
        <ActuArticle actuRef={news} />
      </Slice>
      <Slice colored breath>
        <ActusGrid />
      </Slice>
      <Slice breath>
        <EscapeLatestsTests />
      </Slice>
    </div>
  );
}

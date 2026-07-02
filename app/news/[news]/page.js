import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ActuArticle from "../../../components/ActuArticle";
import ActusGrid from "../../../components/ActusGrid";
import EscapeLatestsTests from "../../../components/EscapeLatestsTests";
import TopIllustration from "../../../components/meta/TopIllustration";
import Slice from "../../../components/meta/Slice";
import { buildMetadata } from "../../../lib/metadata";
import { getActuByRef } from "../../../lib/strapi";
import { mediaUrl } from "../../../lib/media";
import "../../../styles/actus.scss";

// T304 — pas de generateStaticParams, voir app/selections/[selection]/page.js
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
      {/* Suspense : ces deux blocs font chacun un appel Strapi indépendant du
          contenu principal (déjà chargé ci-dessus) — on ne bloque pas l'envoi
          de l'article pour eux, ils sont streamés dès qu'ils sont prêts. */}
      <Slice colored breath>
        <Suspense fallback={null}>
          <ActusGrid />
        </Suspense>
      </Slice>
      <Slice breath>
        <Suspense fallback={null}>
          <EscapeLatestsTests />
        </Suspense>
      </Slice>
    </div>
  );
}

import { notFound } from "next/navigation";
import EnseigneArticle from "../../../components/EnseigneArticle";
import JsonLd from "../../../components/meta/JsonLd";
import { buildMetadata } from "../../../lib/metadata";
import { enseigneReviewJsonLd, escapeListJsonLd } from "../../../lib/jsonld";
import { getEnseigneByRef } from "../../../lib/strapi";
import { mediaUrl } from "../../../lib/media";
import config from "../../../lib/config";

// T301 — pas de generateStaticParams, voir app/selections/[selection]/page.js
export async function generateMetadata({ params }) {
  const { enseigne } = await params;
  const details = await getEnseigneByRef(enseigne);
  if (!details) return {};

  return buildMetadata({
    title: details.name,
    description: details.introduction,
    pathname: `/escapegame/${enseigne}`,
    image: details.logo ? mediaUrl(details.logo.url) : undefined,
  });
}

export default async function EnseignePage({ params }) {
  const { enseigne } = await params;
  const details = await getEnseigneByRef(enseigne);
  if (!details) notFound();

  const pathname = `/escapegame/${enseigne}`;
  const jsonld = [enseigneReviewJsonLd(details, config.origin + pathname)];
  if (details.escapes?.length > 0) jsonld.push(escapeListJsonLd(details.escapes));

  return (
    <div className="enseigne-main-container">
      <JsonLd data={jsonld} />
      <EnseigneArticle enseigneRef={enseigne} />
    </div>
  );
}

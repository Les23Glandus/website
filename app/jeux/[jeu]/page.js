import { notFound } from "next/navigation";
import JeuxArticle from "../../../components/JeuxArticle";
import JsonLd from "../../../components/meta/JsonLd";
import { buildMetadata } from "../../../lib/metadata";
import { jeuxReviewJsonLd } from "../../../lib/jsonld";
import { getJeux, getJeuxByRef } from "../../../lib/strapi";
import { mediaUrl } from "../../../lib/media";
import config from "../../../lib/config";

// T303
export async function generateStaticParams() {
  try {
    const list = await getJeux(1000);
    return (list || []).map((n) => ({ jeu: n.uniquepath }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { jeu } = await params;
  const details = await getJeuxByRef(jeu);
  if (!details) return {};

  const ogimage = details.mini?.formats?.medium?.url || details.mini?.url;
  return buildMetadata({
    title: details.name,
    description: details.description,
    pathname: `/jeux/${jeu}`,
    image: ogimage ? mediaUrl(ogimage) : undefined,
  });
}

export default async function JeuPage({ params }) {
  const { jeu } = await params;
  const details = await getJeuxByRef(jeu);
  if (!details) notFound();

  const jsonld = jeuxReviewJsonLd(details, config.origin + `/jeux/${jeu}`);

  return (
    <div>
      <JsonLd data={jsonld} />
      <JeuxArticle jeuRef={jeu} />
    </div>
  );
}

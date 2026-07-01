import { notFound } from "next/navigation";
import EscapeArticle from "../../../../components/EscapeArticle";
import JsonLd from "../../../../components/meta/JsonLd";
import { buildMetadata } from "../../../../lib/metadata";
import { escapeReviewJsonLd } from "../../../../lib/jsonld";
import { browseEscapes, getEscapeByRef } from "../../../../lib/strapi";
import { mediaUrl } from "../../../../lib/media";
import config from "../../../../lib/config";

// T302 — fiche escape game, la page à plus fort enjeu SEO du site.
export async function generateStaticParams() {
  try {
    const list = await browseEscapes({ preventPush: false }, 2000);
    return (list || [])
      .filter((n) => n.enseigne)
      .map((n) => ({ enseigne: n.enseigne.uniquepath, escape: n.uniquepath }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { enseigne, escape } = await params;
  const details = await getEscapeByRef(escape);
  if (!details) return {};

  const ogimage = details.mini?.formats?.medium?.url || details.mini?.url;

  return buildMetadata({
    title: details.name + (details.enseigne ? ` - ${details.enseigne.name}` : ""),
    description: details.description || details.scenario,
    pathname: `/escapegame/${enseigne}/${escape}`,
    image: ogimage ? mediaUrl(ogimage) : undefined,
  });
}

export default async function EscapePage({ params }) {
  const { enseigne, escape } = await params;
  const details = await getEscapeByRef(escape);
  if (!details) notFound();

  const pathname = `/escapegame/${enseigne}/${escape}`;
  const jsonld = escapeReviewJsonLd(details, config.origin + pathname);

  return (
    <div>
      <JsonLd data={jsonld} />
      <EscapeArticle escapeRef={escape} />
    </div>
  );
}

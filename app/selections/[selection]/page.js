import { notFound } from "next/navigation";
import SelectionArticle from "../../../components/SelectionArticle";
import JsonLd from "../../../components/meta/JsonLd";
import { buildMetadata } from "../../../lib/metadata";
import { escapeListJsonLd } from "../../../lib/jsonld";
import { getSelectionByRef } from "../../../lib/strapi";
import { mediaUrl } from "../../../lib/media";

// T305 — pas de generateStaticParams : le contenu Strapi change souvent et ne
// doit pas être figé/appelé au build. Les pages sont générées à la demande
// (dynamicParams=true par défaut) puis mises en cache via revalidate/tags
// (lib/strapi.js) + webhook de revalidation (app/api/revalidate/route.js).
export async function generateMetadata({ params }) {
  const { selection } = await params;
  const details = await getSelectionByRef(selection);
  if (!details) return {};

  return buildMetadata({
    title: `Nos sélections - ${details.title}`,
    description: details.description,
    pathname: `/selections/${selection}`,
    image: details.image ? mediaUrl(details.image.url) : undefined,
  });
}

export default async function SelectionPage({ params }) {
  const { selection } = await params;
  const details = await getSelectionByRef(selection);
  if (!details) notFound();

  const jsonld = escapeListJsonLd(details.escapes || []);

  return (
    <div>
      <JsonLd data={jsonld} />
      <SelectionArticle selectionRef={selection} />
    </div>
  );
}

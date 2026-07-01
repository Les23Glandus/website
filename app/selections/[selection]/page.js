import { notFound } from "next/navigation";
import SelectionArticle from "../../../components/SelectionArticle";
import JsonLd from "../../../components/meta/JsonLd";
import { buildMetadata } from "../../../lib/metadata";
import { escapeListJsonLd } from "../../../lib/jsonld";
import { getSelectionByRef, getSelections } from "../../../lib/strapi";
import { mediaUrl } from "../../../lib/media";

// T305
export async function generateStaticParams() {
  try {
    const list = await getSelections();
    return (list || []).map((n) => ({ selection: n.uniquepath }));
  } catch {
    return [];
  }
}

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

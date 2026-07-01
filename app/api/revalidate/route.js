import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * T107 — endpoint appelé par un webhook Strapi "on publish/update/delete" pour
 * invalidation à la demande, en complément du cache par durée (revalidate)
 * défini dans lib/strapi.js.
 *
 * À configurer dans Strapi (Settings > Webhooks) :
 *   POST https://<domaine>/api/revalidate?secret=<REVALIDATE_SECRET>
 *   body JSON : { "tags": ["escapes", "escape:mon-escape-game"] }
 *
 * REVALIDATE_SECRET est une variable d'env à définir (non listée dans
 * .env.example volontairement — à générer côté ops, cf. T003).
 */
export async function POST(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "invalid secret" }, { status: 401 });
  }

  let tags = [];
  try {
    const body = await request.json();
    tags = Array.isArray(body?.tags) ? body.tags : [];
  } catch {
    return NextResponse.json({ error: "invalid body, expected { tags: string[] }" }, { status: 400 });
  }

  if (tags.length === 0) {
    return NextResponse.json({ error: "no tags provided" }, { status: 400 });
  }

  tags.forEach((tag) => revalidateTag(tag));
  return NextResponse.json({ revalidated: tags, now: Date.now() });
}

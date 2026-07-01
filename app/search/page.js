import SearchResults from "../../components/SearchResults";
import TopIllustration from "../../components/meta/TopIllustration";
import Slice from "../../components/meta/Slice";
import { buildMetadata } from "../../lib/metadata";
import { searchAll } from "../../lib/actions";
import "../../styles/search.scss";

// T501
export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return buildMetadata({ title: `Résultat de recherche pour ${q || ""}`, pathname: "/search" });
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const initialResults = q ? await searchAll(q) : null;

  return (
    <div>
      <TopIllustration seed="search" />
      <Slice className="search-main">
        <SearchResults initialQuery={q || ""} initialResults={initialResults} />
      </Slice>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "antd";
import Search from "antd/es/input/Search";
import EscapeCard from "./EscapeCard";
import JeuxCard from "./JeuxCard";
import SelectionCard from "./SelectionCard";
import ActusCard from "./ActusCard";
import { searchAll } from "../lib/actions";

/**
 * T501 — page de recherche : peu d'enjeu SEO, reste majoritairement une
 * interaction client, mais s'appuie sur une Server Action (le fetch Strapi
 * ne peut se faire que côté serveur).
 */
export default function SearchResults({ initialQuery, initialResults }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || "");
  const [results, setResults] = useState(initialResults);
  const [isPending, startTransition] = useTransition();

  function doSearch(value) {
    setQuery(value);
    router.replace(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
    startTransition(async () => {
      const r = await searchAll(value);
      setResults(r);
    });
  }

  const r = results || {};

  return (
    <div className="search-main">
      <div className="search-field">
        <p>Recherchez sur le site :</p>
        <Search defaultValue={query} onSearch={doSearch} />
        {r.tooShort && <p className="error">Le texte recherché est trop court.</p>}
      </div>

      <div className="search-result">
        {query && <h3>Résultats de recherche pour &quot;{query}&quot;</h3>}
        <div className="results">
          {isPending && <Skeleton avatar active />}

          {!isPending && r.escapeList?.length > 0 && (
            <div className="escapes">
              <h3>Les expériences immersives</h3>
              <div className="sublist">
                {r.escapeList.map((n) => <EscapeCard key={"e" + n.id} escape={n} enseigne={n.enseigne} reduce compact />)}
              </div>
            </div>
          )}

          {!isPending && r.selectionList?.length > 0 && (
            <div>
              <h3>Nos sélections</h3>
              <div className="sublist">
                {r.selectionList.map((n) => <SelectionCard key={"s" + n.id} details={n} reduce compact />)}
              </div>
            </div>
          )}

          {!isPending && r.jeuxList?.length > 0 && (
            <div>
              <h3>Les jeux</h3>
              <div className="sublist">
                {r.jeuxList.map((n) => <JeuxCard key={"j" + n.id} jeux={n} reduce compact />)}
              </div>
            </div>
          )}

          {!isPending && r.actuList?.length > 0 && (
            <div>
              <h3>Les actus</h3>
              <div className="sublist">
                {r.actuList.map((n) => <ActusCard key={"a" + n.id} details={n} reduce compact />)}
              </div>
            </div>
          )}

          {!isPending &&
            query &&
            !r.tooShort &&
            !r.escapeList?.length &&
            !r.selectionList?.length &&
            !r.jeuxList?.length &&
            !r.actuList?.length && <div className="no-result">Aucun résultat trouvé.</div>}
        </div>
      </div>
    </div>
  );
}

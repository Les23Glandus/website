import { Suspense } from "react";
import BrowseFilters from "../../components/BrowseFilters";
import OtherEnseigne from "../../components/OtherEnseigne";
import SelectionsGrid from "../../components/SelectionsGrid";
import Slice from "../../components/meta/Slice";
import TopIllustration from "../../components/meta/TopIllustration";
import { buildMetadata } from "../../lib/metadata";
import { getFilterPresets, getPays, getRegroupements, getTags, searchEscapesFiltered } from "../../lib/strapi";
import "../../styles/browse.scss";

// T407 — page la plus complexe du site (filtres, presets, pagination).
export const metadata = buildMetadata({ title: "Toutes les escapes testées", pathname: "/escapegame" });

export default async function BrowsePage() {
  const [tagslist, payslist, regroupements, presets, initialList] = await Promise.all([
    getTags().catch(() => []),
    getPays().catch(() => []),
    getRegroupements().catch(() => []),
    getFilterPresets().catch(() => ({ presets: [] })),
    searchEscapesFiltered({}, 1000, "date:DESC").catch(() => []),
  ]);

  return (
    <div className="browse-main">
      <TopIllustration seed="escapegame" />
      <Slice breath nopadding className="browse-slice">
        <Suspense fallback={null}>
          <BrowseFilters
            tagslist={tagslist || []}
            payslist={payslist || []}
            regroupements={regroupements || []}
            presetList={presets?.presets || []}
            initialList={initialList || []}
          />
        </Suspense>
      </Slice>

      <Slice colored breath>
        <SelectionsGrid />
      </Slice>

      <Slice breath>
        <OtherEnseigne />
      </Slice>
    </div>
  );
}

import NewsTimeline from "../../components/NewsTimeline";
import Slice from "../../components/meta/Slice";
import TopIllustration from "../../components/meta/TopIllustration";
import { buildMetadata } from "../../lib/metadata";
import { getRecentActus } from "../../lib/strapi";
import { addDateInList } from "../../lib/newsTimeline";

// T406
export const metadata = buildMetadata({ title: "Actualité", pathname: "/news" });

export default async function NewsPage() {
  let actusList = [];
  try {
    actusList = (await getRecentActus(30)) || [];
  } catch {
    actusList = [];
  }
  const timeline = addDateInList([...actusList]);

  return (
    <div>
      <TopIllustration seed="news" />
      <Slice breath>
        <NewsTimeline initialList={timeline} />
      </Slice>
    </div>
  );
}

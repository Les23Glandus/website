import Link from "next/link";
import { Image } from "antd";
import Slice from "./meta/Slice";
import { getHomeAPropos } from "../lib/strapi";
import { mediaUrl } from "../lib/media";

export default async function Group() {
  let details;
  try {
    details = await getHomeAPropos();
  } catch {
    return null;
  }
  if (!details) return null;

  return (
    <Slice className="main-group" colored>
      <div>
        {details.illustrations && details.illustrations.length > 0 && (
          <Image src={mediaUrl(details.illustrations[0].formats.small.url)} alt="" />
        )}
      </div>
      <div>
        <h3>{details.title}</h3>
        <div>
          {details.article}
          <p><Link href="/about">En savoir plus</Link></p>
        </div>
      </div>
    </Slice>
  );
}

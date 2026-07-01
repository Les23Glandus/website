import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mediaUrl } from "../../lib/media";

/**
 * T207 — react-markdown mis à jour vers l'API courante (`components` au lieu
 * de `renderers`/`allowedTypes`, dépréciés depuis longtemps). Reste un Server
 * Component (pas de "use client") : c'est important, le texte des avis
 * (scénario, description...) doit être présent dans le HTML servi aux
 * crawlers, pas généré après coup côté client.
 */
const IMAGE_CLASSES = ["r1", "r1", "r2", "r0", "rm1", "rm1", "rm2"];

function pickImageClass(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return IMAGE_CLASSES[hash % IMAGE_CLASSES.length];
}

export default function RichText({ children }) {
  return (
    <div className="full-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => {
            const resolvedSrc = mediaUrl(src);
            if (/\.mp4$/.test(src || "")) {
              return (
                <video controls>
                  <source src={resolvedSrc} type="video/mp4" />
                  Votre navigateur ne supporte pas les vidéos
                </video>
              );
            }
            return (
              <span className="rt-img-handler" data-alt={alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolvedSrc} alt={alt} className={pickImageClass(src || alt || "")} />
              </span>
            );
          },
          a: ({ href, children: linkChildren }) => {
            let cleanHref = href || "";
            cleanHref = cleanHref.replace(
              /^https?:\/\/(lesglandus\.fr|www\.lesglandus\.fr|dev\.lesglandus\.fr|15\.188\.205\.192)/i,
              ""
            );
            if (/^\//.test(cleanHref)) {
              return <Link href={cleanHref}>{linkChildren}</Link>;
            }
            return (
              <a href={cleanHref} className="outlink" target="_blank" rel="noreferrer">
                {linkChildren}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

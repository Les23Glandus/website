/**
 * Rend un ou plusieurs blocs JSON-LD côté serveur (Server Component).
 * Remplace les <script type="application/ld+json"> auparavant injectés via
 * react-helmet dans HtmlHead.js / EscapeArticle.js / EnseigneArticle.js / etc.
 *
 * @param {Object} props
 * @param {Object|Object[]} props.data - un objet JSON-LD, ou un tableau
 */
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

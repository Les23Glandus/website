const MIN_LENGTH = 3;
const STOP_WORDS = ["the", "le", "la", "les", "ces", "du", "de", "l", "des", "c", ",", "-", "_", ".", ";", "?", "escape"];

/** Porté depuis pages/Search.js (preprocessQuery). */
export function preprocessQuery(rawInput) {
  const reg = /^\s*$/;
  const rawquery = rawInput
    .trim()
    .replace(/\s+/, " ")
    .split(/([cl]'|[,-_.;]|\s)/)
    .filter((n) => !reg.test(n));
  const query = rawquery.filter((n) => n.length >= MIN_LENGTH && !STOP_WORDS.includes(n));
  return { query, rawquery };
}

/** Porté depuis pages/Search.js (reduceList) : ne garde que les meilleurs matches. */
export function reduceList(list, query, field) {
  let maxAppear = 0;
  const scored = list.map((n) => {
    let count = 0;
    query.forEach((element) => {
      if (n[field] && n[field].toLowerCase().includes(element.toLowerCase())) count++;
    });
    maxAppear = Math.max(maxAppear, count);
    return { ...n, __found: count };
  });
  return scored.filter((n) => n.__found === maxAppear);
}

export { MIN_LENGTH };

"use server";

import {
  getEscapeBetweenDate,
  searchEscapesFiltered,
  searchActus,
  searchEnseigne,
  searchJeux,
  searchSelection,
  searchEscapes,
} from "./strapi";
import { addDateInList } from "./newsTimeline";
import { buildBrowseQuery, reduceListPerTags } from "./browseQuery";
import { preprocessQuery, reduceList } from "./search";

const SEARCH_LIMIT = 30;

/**
 * T501 — Server Action pour la page de recherche globale (porte la logique
 * de pages/Search.js). Le fetch Strapi devant rester côté serveur, la
 * recherche déclenchée par la saisie utilisateur passe par cette action.
 */
export async function searchAll(rawInput) {
  const { query, rawquery } = preprocessQuery(rawInput || "");
  if (query.length === 0) return { tooShort: true };

  const [escapeList, jeuxList, enseigneList, selectionList, actuList] = await Promise.all([
    searchEscapes(query, SEARCH_LIMIT).then((d) => reduceList(d || [], rawquery, "name")).catch(() => []),
    searchJeux(query, SEARCH_LIMIT).then((d) => reduceList(d || [], rawquery, "name")).catch(() => []),
    searchEnseigne(query, SEARCH_LIMIT).then((d) => reduceList(d || [], rawquery, "name")).catch(() => []),
    searchSelection(query, SEARCH_LIMIT).then((d) => reduceList(d || [], rawquery, "title")).catch(() => []),
    searchActus(query, SEARCH_LIMIT).then((d) => reduceList(d || [], rawquery, "title")).catch(() => []),
  ]);

  return { tooShort: false, escapeList, jeuxList, enseigneList, selectionList, actuList };
}

/**
 * Server Action pour la page Browse (T407) : reconstruit la requête Strapi à
 * partir des valeurs de filtre soumises par le formulaire client, applique le
 * ET/OU sur les tags, et renvoie la liste triée.
 */
export async function searchBrowseEscapes(filterValues, sort = "date:DESC") {
  const { query, tagsAND, tagsOR } = buildBrowseQuery(filterValues);
  let list = [];
  try {
    list = (await searchEscapesFiltered(query, 1000, sort)) || [];
  } catch {
    list = [];
  }
  return reduceListPerTags(list, tagsAND, tagsOR);
}

/**
 * Server Action utilisée par components/NewsTimeline.js (toggle "Inclure nos
 * tests") — porte la logique de News.js/loadEscape(). Le fetch Strapi ne peut
 * de toute façon se faire que côté serveur, d'où l'usage d'une Server Action
 * plutôt qu'un appel client direct.
 */
export async function mergeEscapesIntoTimeline(actusList) {
  if (!actusList || actusList.length === 0) return actusList || [];

  const lastDate = actusList.filter((n) => !n.isDate).slice(-1)[0]?.date;
  if (!lastDate) return addDateInList([...actusList]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let escapes = [];
  try {
    escapes = (await getEscapeBetweenDate(lastDate, tomorrow.toISOString().slice(0, 10))) || [];
  } catch {
    escapes = [];
  }

  const merged = actusList
    .filter((n) => !n.isDate)
    .concat(escapes)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return addDateInList(merged);
}

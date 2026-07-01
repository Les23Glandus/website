/**
 * Insère des marqueurs d'année ({id, label, isDate:true}) dans une liste
 * triée par date décroissante — porté depuis pages/News.js (addDateInList).
 */
export function addDateInList(list) {
  let prev = null;
  for (let i = list.length - 1; i >= 0; i--) {
    const y = new Date(list[i].date).getFullYear();
    if (y !== prev) list.splice(i + 1, 0, { id: y, label: y, isDate: true });
    prev = y;
  }
  return list;
}

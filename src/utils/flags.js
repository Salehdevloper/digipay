/**
 * Where something is shown. Pages:
 *
 *   "store"  the store's own page          (/stores/bani-mod)
 *   "home"   the home page
 *   "stores" the «فروشگاه‌ها» page, online tab
 *
 * How to write the flag (on a product's bestSeller, or a code's inBestSellers):
 *
 *   bestSeller: true                      every page
 *   bestSeller: ["store", "home"]         only these pages
 *   bestSeller: ["store"]                 only the store's own page
 *   (missing / false / [])                nowhere
 *
 * (An object like { store: true, home: false } also works.)
 */
export function isShownOn(flag, page) {
  if (flag === true) return true;
  if (Array.isArray(flag)) return flag.includes(page);
  if (flag && typeof flag === "object") return flag[page] === true;
  return false;
}
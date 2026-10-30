/**
 * THE ORDER OF THE SECTIONS OF EACH PAGE.
 *
 * Each line is one section. They are shown from top to bottom, exactly in
 * this order. Move a line to move the section, delete (or comment out) a
 * line to hide it, copy a line to add another section.
 *
 *   "flashDeals"              «قسطی شگفت»
 *   "discountCodes"           «کد تخفیف» (the slider with all codes)
 *   "bestSellers"             «پرفروش‌ترین‌های ...» of ALL stores, one row each
 *                             (the stores you did not place by name below)
 *   "bestSellers:bani-mod"    only the row of that store
 *   "promo:tapsi-shop"        a partner promo      (data/partnerPromos.js)
 *   "posters:ali-baba"        a poster slider      (data/posterSections.js)
 *   "banners:installments"    a banner strip       (data/bannerStrips.js)
 *
 * Pages: "home" = home page, "stores" = «فروشگاه‌ها» page, online tab
 * (after «فروشگاه‌های منتخب»), "store" = the page of ONE store (/stores/bani-mod),
 * below its top card.
 *
 * Extra entries only for the "store" page:
 *   "storeBranches"         «آدرس شعب حضوری» of THIS store + «مشاهده همه N شعبه»
 *                           (hidden if the store has no branches: data/branches/)
 *   "storeCodes"            the «کد تخفیف» row of THIS store (hidden if none)
 *   "storeSections"         all the product rows of this store, in order
 *                           (data/storeSections.js)
 *   "storeSection:best-sellers"   just one of them, by its id
 *
 * Example: to put the Tapsi row right after the بانی مد best sellers,
 *   "bestSellers:bani-mod",
 *   "promo:tapsi-shop",
 * and to show the rest of the stores after it:
 *   "bestSellers",
 */

export const PAGE_LAYOUT = {
  home: [
    "flashDeals",
    "discountCodes",
    "bestSellers:bani-mod",
    "promo:tapsi-shop",
    "bestSellers",
    "posters:ali-baba",
    "posters:filmnet",
    "banners:installments",
  ],

  stores: [
    "banners:installments",
    "flashDeals",
    "discountCodes",
    "bestSellers",
    "posters:ali-baba",
    "posters:filmnet",
  ],

  // The page of every store (/stores/<id>), below the store's top card
  store: [
    "storeBranches",
    "storeCodes",
    "storeSections",
  ],
};

/**
 * A different order for ONE store (optional). Same entries as "store" above.
 * Example:
 *   "bani-mod": ["storeBranches", "storeCodes", "storeSection:best-sellers", "banners:installments", "storeSections"],
 */
export const STORE_LAYOUTS = {};

/** The layout of a page; a store can have its own (STORE_LAYOUTS). */
export const getPageLayout = (page, storeId) =>
  (page === "store" && STORE_LAYOUTS[storeId]) || PAGE_LAYOUT[page] || [];
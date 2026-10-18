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
 * (after «فروشگاه‌های منتخب»).
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
    "flashDeals",
    "discountCodes",
    "bestSellers",
    "posters:ali-baba",
    "posters:filmnet",
    "banners:installments",
  ],
};
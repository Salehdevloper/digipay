/**
 * Which extra sections each page shows. Change a value to true / false.
 *
 *   flashDeals    «قسطی شگفت»          products with flashDeal: true
 *   discountCodes «کد تخفیف»           the slider with ALL codes
 *   bestSellers   «پرفروش‌ترین‌های <فروشگاه>»  one row per store
 *                 (products with bestSeller + codes with inBestSellers
 *                  that are switched on for this page, see utils/flags.js)
 *
 * Order on the page: flashDeals -> discountCodes -> bestSellers.
 * A section without content hides itself.
 *
 * A page uses it with:   <PageSections page="home" />
 *
 * (The best sellers of ONE store also live on that store's own page:
 *  data/storeSections.js.)
 */

export const PAGE_SECTIONS = {
  // home page
  home: {
    flashDeals: true,
    discountCodes: true,
    bestSellers: true,
  },

  // «فروشگاه‌ها» page, online tab, after «فروشگاه‌های منتخب»
  stores: {
    flashDeals: true,
    discountCodes: true,
    bestSellers: true,
  },
};
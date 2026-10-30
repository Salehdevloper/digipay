import { getStoreById } from "./stores";

/**
 * Brand rows: «فروشگاه‌های منتخب» with round logos, in several rows.
 * Put one on a page with  "brands:<id>"  in config/pageLayout.js.
 *
 *   id         the name used in pageLayout.js
 *   title      text above the logos
 *   subtitle   optional blue line under the title
 *   storeIds   the stores to show, IN THIS ORDER (ids of data/stores.js);
 *              logos come from assets/images/brands/<id>.*
 *   columns    logos per row on desktop (9 -> 2 rows for 17 stores)
 *   size       logo diameter in px (default 100)
 *   allHref    the «همه» link (optional)
 *   moreHref   adds a last «بیشتر» circle that opens this link (optional)
 *
 * A red % badge shows on the logo of a store that has a discount
 * (cashback or a discount code).
 */

export const BRAND_ROWS = [
  {
    id: "in-store",
    title: "فروشگاه‌های منتخب",
    subtitle: "۵٪ بازگشت پول در خرید با دیجی‌کارت",
    storeIds: [
      "pierre-cardin",
      "jean-west",
      "lc-waikiki",
      "david-jones",
      "roja",
      "positron",
      "kia-gallery",
      "wadin-kook",
      "doris",
      "body-spinner",
      "maral-charm",
      "behboud",
      "jambo",
      "charm-mashhad",
      "serge",
      "superdry",
      "komar",
    ],
    columns: 9,
    size: 80,
    allHref: "/stores/category/fashion?type=offline",
    moreHref: "/stores/category/fashion?type=offline",
  },
];

/** The row with its stores resolved (unknown store ids are skipped). */
export const getBrandRowById = (id) => {
  const row = BRAND_ROWS.find((item) => item.id === id);

  return row
    ? { ...row, brands: row.storeIds.map(getStoreById).filter(Boolean) }
    : undefined;
};
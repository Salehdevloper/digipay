import { isShownOn } from "../utils/flags";

/**
 * Partner promo rows: a white card with a brand, a title, an arrow and a
 * belt of small discounted products that turns by itself.
 * Clicking the arrow or any product opens `url` in a new tab.
 *
 *   id          images folder:  assets/images/promos/<id>/<item id>.webp|png|jpg
 *   brandId     logo file:      assets/images/brands/<brandId>.svg|webp|png
 *   brandName   shown only while the logo file is missing (first letter)
 *   title       big text            «تخفیف‌های تکرار نشدنی»
 *   subtitle    gray text under it  «در تپسی‌شاپ»
 *   url         where the arrow and the products go
 *   pages       where the row appears (see utils/flags.js):  ["home"]
 *   afterStore  optional: the row comes right after the best-sellers row of
 *               this store ("bani-mod"). Without it (or if that store has no
 *               row on the page) it goes after all the best-sellers rows.
 *   items       the products on the belt:
 *                 id        picture file name
 *                 discount  number for the red badge (0 shows «۰٪»); leave it
 *                           out to hide the badge
 *                 url       optional: a different link for this product
 *
 * A new row = a new object in the list below.
 */

export const PARTNER_PROMOS = [
  {
    id: "tapsi-shop",
    brandId: "tapsi-shop",
    brandName: "تپسی‌شاپ",
    title: "تخفیف‌های تکرار نشدنی",
    subtitle: "در تپسی‌شاپ",
    url: "https://tapsi.shop/search?collectionId=1363916929025880064&dp-source=DP",
    pages: true,
    afterStore: "bani-mod",
    items: [
      { id: "p1", discount: 22 },
      { id: "p2", discount: 29 },
      { id: "p3", discount: 0 },
      { id: "p4", discount: 0 },
      { id: "p5", discount: 0 },
      { id: "p6", discount: 8 },
      { id: "p7", discount: 15 },
      { id: "p8", discount: 0 },
      { id: "p9", discount: 12 },
      { id: "p10", discount: 5 },
    ],
  },
];

/** The promo rows that should appear on a page ("home", "stores", ...). */
export const getPartnerPromos = (page) =>
  PARTNER_PROMOS.filter((promo) => isShownOn(promo.pages, page));
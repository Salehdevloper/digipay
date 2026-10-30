/**
 * In-store shops that are not in data/stores.js yet (they are in the logo
 * row of the «حضوری» tab). Minimal data: only name and category.
 *
 * HOW TO USE (2 lines in data/stores.js):
 *   1) at the top:      import { IN_STORE_SHOPS } from "./inStoreShops";
 *   2) in STORES, last: ...IN_STORE_SHOPS,
 *
 * Add the rest of the fields (description, tags, ...) later, or move a shop
 * into stores.js when you write its full text.
 * Also: in stores.js give david-jones  cashback: 5  if you want the red %
 * badge on its logo (it is in the design).
 */

const shop = (id, name, category, tagline) => ({
  id,
  name,
  category,
  types: ["offline"], // only in person: no «خرید آنلاین» button
  tagline,
  paymentLabels: ["خرید اعتباری", "خرید با وام"],
  description: "",
  tags: [],
});

export const IN_STORE_SHOPS = [
  shop("jean-west", "جین وست", "fashion", "مد و پوشاک"),
  shop("kia-gallery", "کیا گالری", "fashion", "طلا و جواهر"),
  shop("wadin-kook", "وادین کوک", "fashion", "مد و پوشاک"),
  shop("body-spinner", "بادی اسپینر", "fashion", "مد و پوشاک"),
  shop("maral-charm", "مارال چرم", "fashion", "مد و پوشاک"),
  shop("behboud", "بهبود", "fashion", "مد و پوشاک"),
  shop("jambo", "جانبو", "grocery", "هایپرمارکت"),
  shop("superdry", "سوپردرای", "fashion", "مد و پوشاک"),
];
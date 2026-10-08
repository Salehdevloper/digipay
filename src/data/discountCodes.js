/**
 * Discount codes: ONE list used everywhere.
 *   - home page          -> all codes
 *   - a store's page     -> only the codes with that store's id
 *     (a store without codes simply shows no "کد تخفیف" section)
 *
 * storeId     -> the store id (same id as assets/images/brands/<id>.* and /stores/<id>)
 * amount      -> discount in million toman
 * minPurchase -> minimum cart in million toman (optional)
 */

export const DISCOUNT_CODES = [
  {
    id: 1,
    store: "بانی مد",
    storeId: "bani-mod",
    amount: 2,
    minPurchase: 10,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "DEHOTB",
    url: "#",
  },
  {
    id: 2,
    store: "پوزیترون",
    storeId: "positron",
    amount: 5,
    minPurchase: 20,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "CEPOYD",
    url: "#",
  },
  {
    id: 3,
    store: "مثبت سبز",
    storeId: "mosbat-sabz",
    amount: 2,
    minPurchase: 5,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "DERTMO",
    url: "#",
  },
  {
    id: 4,
    store: "گوشی شاپ",
    storeId: "goshi-shop",
    amount: 3,
    minPurchase: 15,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "DEGSOH",
    url: "#",
  },
  {
    id: 4,
    store: "پلازا",
    storeId: "pelaza",
    amount: 1,
    minPurchase: 20,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "CERKPZ",
    url: "#",
  },
];

/** Codes of one store ([] when it has none). */
export const getCodesByStore = (storeId) =>
  DISCOUNT_CODES.filter((deal) => deal.storeId === storeId);
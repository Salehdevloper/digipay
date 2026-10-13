import { getBestSellerCodes } from "./discountCodes";
import { getBestSellerProducts } from "./products";
import { STORES } from "./stores";

/**
 * The best-sellers rows of a page: ONE ROW PER STORE.
 *
 *   getBestSellerGroups("home")
 *   -> [ { store: بانی مد, products: [...], codes: [...] },
 *        { store: پوزیترون, products: [...], codes: [...] } ]
 *
 * Each group has only that store's products and that store's codes, so a
 * code of پوزیترون never lands in the بانی مد row. Stores with nothing
 * to show on that page are left out. Order = order of data/stores.js.
 */
export const getBestSellerGroups = (page) =>
  STORES.map((store) => ({
    store,
    products: getBestSellerProducts(page, store.id),
    codes: getBestSellerCodes(page, store.id),
  })).filter((group) => group.products.length > 0 || group.codes.length > 0);
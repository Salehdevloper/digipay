import { isShownOn } from "../../utils/flags";

import { ASTIN_PRODUCTS } from "./astin";
import { BANI_MOD_PRODUCTS } from "./bani-mod";
import { GOSHI_SHOP_PRODUCTS } from "./goshi-shop";
import { MOSBAT_SABZ_PRODUCTS } from "./mosbat-sabz";
import { PELAZA_PRODUCTS } from "./pelaza";
import { POSITRON_PRODUCTS } from "./positron";
import { TITI_BOL_PRODUCTS } from "./titi-bol";

/* =========================================================
   Products: ONE FILE PER STORE (this folder).

   - bani-mod.js, positron.js, ... hold the products of that store
     (the storeId is added here, so you never write it).
   - A new store: copy any store file, add it to the list below.

   Product fields:
     id            unique name, also the photo file name:
                   assets/images/products/<store id>/<id>.webp|png|jpg
     title         product name
     price         final price (toman)
     oldPrice      price before the discount (optional)
     rating        shown on the photo (optional)
     installments  4 -> "۴ قسط" badge + one installment amount (optional)
     paymentTypes  ["loan", "credit"] -> "وام" / "اعتبار" chips (when no installments)

   Where a product is shown (each flag is optional):

     flashDeal: true    -> «قسطی شگفت»

     bestSeller: true                    -> «پرفروش‌ترین‌های <store>» on EVERY page
     bestSeller: ["store", "home"]       -> only on these pages
     bestSeller: ["store"]               -> only on the store's own page
       pages: "store" (the store's page), "home" (home page),
              "stores" («فروشگاه‌ها» page, online tab)
     (no bestSeller)                     -> not in any best-sellers row

   Each store gets its OWN row ("پرفروش‌ترین‌های بانی مد", "... پوزیترون"),
   with only its products and its codes.

   Without flags a product only shows in the custom sections of its
   store (data/storeSections.js).

   Example, to put a product in قسطی شگفت:
     { id: "bani-hoodie", title: "هودی زنانه", price: 4130000,
       oldPrice: 5900000, rating: 4.6, installments: 4, flashDeal: true },
========================================================= */

const withStore = (storeId, products) =>
  products.map((product) => ({ ...product, storeId }));

export const PRODUCTS = [
  ...withStore("bani-mod", BANI_MOD_PRODUCTS),
  ...withStore("mosbat-sabz", MOSBAT_SABZ_PRODUCTS),
  ...withStore("goshi-shop", GOSHI_SHOP_PRODUCTS),
  ...withStore("positron", POSITRON_PRODUCTS),
  ...withStore("titi-bol", TITI_BOL_PRODUCTS),
  ...withStore("pelaza", PELAZA_PRODUCTS),
  ...withStore("astin", ASTIN_PRODUCTS),
];

/* =========================================================
   Helpers (the pages use these, you rarely touch them)
========================================================= */

/** flashDeal: true  (all stores) */
export const getFlashDealProducts = () =>
  PRODUCTS.filter((product) => product.flashDeal);

/** Best sellers of one page: "home", "stores" (all stores) or "store" (+ storeId). */
export const getBestSellerProducts = (page, storeId) =>
  PRODUCTS.filter(
    (product) =>
      isShownOn(product.bestSeller, page) &&
      (!storeId || product.storeId === storeId)
  );

/** Best sellers on the page of one store. */
export const getBestSellers = (storeId) =>
  getBestSellerProducts("store", storeId);

/** Products by id, in the order of the ids (unknown ids are skipped). */
export const getProductsByIds = (ids = []) =>
  ids
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter(Boolean);
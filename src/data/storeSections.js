import { getBestSellers, getProductsByIds } from "./products";

/**
 * Product sections on a store page (/stores/<id>), shown after the
 * discount codes. Add as many as you like, with any title:
 *
 *   {
 *     id: "men-accessories",
 *     title: "ویژه اکسسوری مردانه",             // title above the row
 *     productIds: ["bani-belt", "bani-hat"],       // ids from data/products/<store>.js
 *   }
 *
 *   {
 *     id: "best-sellers",
 *     title: "پرفروش‌ترین‌های {store}",     // {store} = the store name
 *     filter: "bestSeller",    // = this store's products whose bestSeller is true
 *   }                          //   or { store: true }. Its codes with inBestSellers
 *                              //   (data/discountCodes.js) are added as first cards.
 *
 * A store without sections (or a section without products) shows nothing.
 */

export const STORE_SECTIONS = {
  "bani-mod": [
    {
      id: "men-accessories",
      title: "ویژه اکسسوری مردانه",
      productIds: [
        "bani-hat",
        "bani-gloves",
        "bani-cheque-holder",
        "bani-luggage-tag",
        "bani-folder-Orez",
        "bani-folder-NooteBook",
        "bani-belt-Wane",
      ],
    },
    {
      id: "travel-gadgets",
      title: "گجت‌های کاربردی سفر",
      productIds: [
        "anker-powerbank",
        "abker-aripod",
        "anker-liberty",
        "anker-wall-charger",
        "redemi-powebank",
        "kable-usb-c",
        "anker-airpod-r60i"
      ],
    },
    {
      id: "best-sellers",
      title: "پرفروش‌ترین‌های {store}",
      filter: "bestSeller",
    },
    {
      id: "flashdeal-bnimod",
      title: "قسطی شگفت",
      productIds: [
        "rainy-women",
        "woven-skirt",
        "long-coat-women",
        "puffer-men",
      ]
    }
  ],
};

export const getStoreSections = (storeId) => STORE_SECTIONS[storeId] ?? [];

/** The products of one section (explicit ids, or the bestSeller flag). */
export const getSectionProducts = (storeId, section) =>
  section.filter === "bestSeller"
    ? getBestSellers(storeId)
    : getProductsByIds(section.productIds);

/** Title with {store} replaced by the store name. */
export const getSectionTitle = (section, store) =>
  section.title.replace("{store}", store.name);
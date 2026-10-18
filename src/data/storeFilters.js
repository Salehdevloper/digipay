import { getCodesByStore } from "./discountCodes";
import { STORES } from "./stores";

/* =========================================================
   Options of the filter panel (pages/StoreListPage)
========================================================= */

export const SORT_OPTIONS = [
  { id: "alpha-asc", label: "الفبا از اول به آخر" },
  { id: "alpha-desc", label: "الفبا از آخر به اول" },
  { id: "popular", label: "محبوب‌ترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "discount", label: "تخفیف‌دار" },
];

/** label = the same text as in paymentLabels of data/stores.js */
export const PAYMENT_METHODS = [
  { id: "credit", label: "خرید اعتباری" },
  { id: "loan", label: "خرید با وام" },
  { id: "barcode", label: "خرید با بارکد" },
];

export const STORE_TYPES = [
  { id: "online", label: "آنلاین" },
  { id: "offline", label: "حضوری" },
];

export const DEFAULT_SORT = "popular";

/* =========================================================
   What a store supports (read from data/stores.js)
========================================================= */

/**
 * Where a store sells:
 *   - `types: ["offline"]` in data/stores.js says it directly
 *   - otherwise: "online" if it has a website, "offline" if it has an inStoreUrl
 */
export const getStoreTypes = (store) =>
  store.types ??
  [store.website && "online", store.inStoreUrl && "offline"].filter(Boolean);

/** paymentLabels -> ["credit", "loan", ...] */
export const getStorePaymentIds = (store) =>
  (store.paymentLabels ?? [])
    .map((label) => PAYMENT_METHODS.find((m) => m.label === label.trim())?.id)
    .filter(Boolean);

/** Has cashback or at least one discount code. */
export const storeHasDiscount = (store) =>
  (store.cashback ?? 0) > 0 || getCodesByStore(store.id).length > 0;

/* =========================================================
   Filtering + sorting
   filters = { sort, payments: [], types: [], categories: [] }
   An empty list = "no filter" (everything passes).
   Inside one list the choices are OR ("loan" or "credit").
========================================================= */

export function filterStores(filters, stores = STORES) {
  const { sort, payments, types, categories } = filters;

  const matches = stores.filter(
    (store) =>
      (categories.length === 0 || categories.includes(store.category)) &&
      (types.length === 0 ||
        getStoreTypes(store).some((type) => types.includes(type))) &&
      (payments.length === 0 ||
        getStorePaymentIds(store).some((id) => payments.includes(id)))
  );

  // "popular" = the order of data/stores.js
  const position = (store) => stores.indexOf(store);

  const sorters = {
    "alpha-asc": (a, b) => a.name.localeCompare(b.name, "fa"),
    "alpha-desc": (a, b) => b.name.localeCompare(a.name, "fa"),
    popular: (a, b) => position(a) - position(b),
    newest: (a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? "") ||
      position(a) - position(b),
    discount: (a, b) =>
      Number(storeHasDiscount(b)) - Number(storeHasDiscount(a)) ||
      position(a) - position(b),
  };

  return [...matches].sort(sorters[sort] ?? sorters.popular);
}

/** Number of ticked filters (the badge on the mobile "فیلترها" button). */
export const countActiveFilters = ({ payments, types, categories }) =>
  payments.length + types.length + categories.length;
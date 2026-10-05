/**
 * Store modes: shared by the header sub-navigation and the Stores page,
 * so both always agree on ids, labels and the URL (?mode=online|offline).
 */

export const STORE_MODE_ITEMS = [
  { id: "online", label: "فروشگاه‌های آنلاین", shortLabel: "آنلاین" },
  { id: "offline", label: "فروشگاه‌های حضوری", shortLabel: "حضوری" },
];

export const DEFAULT_STORE_MODE = "online";

/** Turns any ?mode= value into a valid mode id. */
export const getStoreMode = (value) =>
  STORE_MODE_ITEMS.some((item) => item.id === value)
    ? value
    : DEFAULT_STORE_MODE;
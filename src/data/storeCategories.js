/**
 * Store categories. ONE list used by:
 *   - the category row of the online tab (components/StoreCategories)
 *   - the filter page  /stores/category/<id>
 *
 *   id     = the image file name  assets/images/store-categories/<id>.webp
 *            and the value of `category` in data/stores.js
 *   label  = text under the tile, and in the page title:
 *            «فروشگاه‌های <label> قسطی»
 */

export const STORE_CATEGORIES = [
  { id: "fun", label: "تفریح و سرگرمی" },
  { id: "beauty", label: "زیبایی و بهداشت" },
  { id: "books", label: "کتاب و لوازم تحریر" },
  { id: "courses", label: "دوره‌های آموزشی" },
  { id: "grocery", label: "کالای مصرفی خانوار" },
  { id: "auto", label: "خودرو و موتورسیکلت" },
  { id: "gifts", label: "هدیه و لوازم تولد" },
  { id: "kids", label: "لوازم کودک" },
  { id: "tools", label: "ابزارآلات و تجهیزات" },
  { id: "health", label: "سلامت و درمان" },
  { id: "services", label: "خدمات" },
  { id: "pets", label: "حیوانات خانگی" },
  { id: "plants", label: "گل و گیاه" },
  { id: "digital", label: "کالای دیجیتال" },
  { id: "fashion", label: "مد و پوشاک" },
];

export const getCategoryById = (id) =>
  STORE_CATEGORIES.find((category) => category.id === id);
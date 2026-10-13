import { resolveImage } from "./resolveImage";

/**
 * Product photos are found by the product id, one folder per store:
 *
 *   assets/images/products/bani-mod/bani-hat.webp
 *   assets/images/products/bani-mod/anker-powerbank.webp
 *   assets/images/products/positron/....webp
 *      ^ folder = store id (same as data/products/<store>.js)
 *                         ^ file = product id
 *
 * Also accepted (so nothing breaks):
 *   assets/images/products/<id>.webp      (no store folder)
 *   assets/images/Flashdeals/<id>.webp    (the old folder)
 *
 * Returns null when there is no photo yet (cards show a placeholder).
 */

const PRODUCT_IMAGES = import.meta.glob(
  [
    "../assets/images/products/**/*.{webp,png,jpg,jpeg}",
    "../assets/images/Flashdeals/*.{webp,png,jpg,jpeg}",
  ],
  { eager: true, import: "default" }
);

export function getProductImage(productId, storeId) {
  // 1) the store's own folder: products/<storeId>/<productId>.*
  if (storeId) {
    const inStoreFolder = Object.fromEntries(
      Object.entries(PRODUCT_IMAGES).filter(([path]) =>
        path.includes(`/products/${storeId}/`)
      )
    );

    const image = resolveImage(inStoreFolder, productId);
    if (image) return image;
  }

  // 2) anywhere else (flat products folder, old Flashdeals folder)
  return resolveImage(PRODUCT_IMAGES, productId);
}
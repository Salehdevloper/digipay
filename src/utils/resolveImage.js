/**
 * Finds an image by its file name (without extension) inside the result
 * of `import.meta.glob(..., { eager: true, import: "default" })`.
 *
 *   const IMAGES = import.meta.glob("../../assets/images/brands/*.*", {
 *     eager: true,
 *     import: "default",
 *   });
 *   resolveImage(IMAGES, "serge");   // -> url of brands/serge.svg | .webp | ...
 *
 * Returns null when the file does not exist yet, so a missing image
 * never breaks the build: the component just shows its fallback.
 */
export function resolveImage(images, name) {
  const match = Object.entries(images).find(
    ([path]) => path.split("/").pop().split(".")[0] === name
  );

  return match ? match[1] : null;
}   
/**
 * Banner strips: a row of wide banners with dots under it
 * (the text and the button are part of the picture).
 * Put one on a page with  "banners:<id>"  in config/pageLayout.js.
 *
 * Strip:
 *   id       also the pictures folder:
 *            assets/images/banner-strips/<id>/<banner id>.webp|png|jpg
 *   banners  [{ id, alt, href }]   (the order = the order on the page)
 *            alt = what the banner says (read by screen readers)
 *
 * Samples: replace them with the real banners.
 */

export const BANNER_STRIPS = [
  {
    id: "installments",
    banners: [
      { id: "clothing", alt: "پوشاک فصل با اعتبار دیجی‌پی، خرید قسطی", href: "#" },
      { id: "gold", alt: "سرمایه‌گذاری با طلا با اعتبار دیجی‌پی، خرید قسطی", href: "#" },
      { id: "beauty", alt: "لوازم آرایشی بهداشتی با اعتبار دیجی‌پی، خرید قسطی", href: "#" },
      { id: "digital", alt: "کالای دیجیتال با اعتبار دیجی‌پی، خرید قسطی", href: "#" },
      { id: "home", alt: "خانه بهتر از همیشه", href: "#" },
    ],
  },
];

export const getBannerStripById = (id) =>
  BANNER_STRIPS.find((strip) => strip.id === id);
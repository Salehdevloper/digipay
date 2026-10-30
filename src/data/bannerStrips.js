/**
 * Banner strips: a row of wide banners with dots under it
 * (the text and the button are part of the picture).
 * Put one on a page with  "banners:<id>"  in config/pageLayout.js.
 *
 * Strip:
 *   id       also the pictures folder:
 *            assets/images/banner-strips/<id>/<banner id>.webp|png|jpg
 *   ratio    optional: picture width / height, e.g. "460 / 196" (default 415 / 125)
 *   visible  optional: banners on screen at once on desktop (default 3.15)
 *   banners  [{ id, alt, href }]   (the order = the order on the page)
 *            href "/stores/doris" opens inside the app, "https://..." is a normal link
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

  /* «فروشگاه‌های حضوری» tab: bigger banners, a bit more than two on screen */
  {
    id: "in-store",
    ratio: "460 / 196",
    visible: 2.15,
    banners: [
      { id: "kia-gallery", alt: "گالری کیا، برگریزون قیمت‌ها شروع شد، درخشش طلا، دیدن شعب", href: "#" },
      { id: "doris", alt: "درریس، برگریزون قیمت‌ها شروع شد، زیبایی از جنس طلا، دیدن شعب", href: "/stores/doris" },
      { id: "charm-mashhad", alt: "چرم مشهد، برگریزون قیمت‌ها شروع شد، پوشاک چرم، خرید قسطی", href: "/stores/charm-mashhad" },
      { id: "laiko", alt: "لایکو برگریزون قیمت‌ها شروع شد، دیدن شعب", href: "/stores/laiko" },
      { id: "positron", alt: "پوزیترون برگریزون قیمت‌ها شروع شد، دیدن شعب", href: "/stores/positron" },
      { id: "pierre-cardin", alt: "روژا، برگریزون قیمت‌ها شروع شد، دیدن شعب", href: "/stores/pierre-cardin" },
    ],
  },
];

export const getBannerStripById = (id) =>
  BANNER_STRIPS.find((strip) => strip.id === id);
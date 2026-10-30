/**
 * The two banner strips of the «حضوری» tab of «فروشگاه‌ها»
 * (components/BannerStrip, used by pages/StoresPage).
 *
 *   IN_STORE_TOP_STRIP     the big banners, right under the map banner
 *   IN_STORE_BOTTOM_STRIP  the smaller ones, under «فروشگاه‌های منتخب»
 *
 * Strip fields:
 *   id       also the pictures folder:
 *            assets/images/banner-strips/<id>/<banner id>.webp|png|jpg
 *   ratio    picture width / height  (shape of the banner)
 *   visible  banners on screen at once on desktop (the .15 = the next one peeking)
 *   banners  [{ id, alt, href }]   href "/stores/doris" opens inside the app,
 *                                  "https://..." is a normal link
 * Samples: replace the banners with the real ones.
 */

export const IN_STORE_TOP_STRIP = {
  id: "in-store-top",
  ratio: "368 / 131",
  visible: 3.15,
  banners: [
    { id: "pierre-cardin", alt: "برگریزون قیمت‌ها شروع شد، انواع پوشاک، دیدن شعب", href: "/stores/pierre-cardin" },
    { id: "kia-gallery", alt: "برگریزون قیمت‌ها شروع شد، ترند ترین‌های طلا، دیدن شعب", href: "/stores/kia-gallery" },
    { id: "sportland", alt: "برگریزون قیمت‌ها شروع شد، پوشاک ورزشی، دیدن شعب", href: "#" },
    { id: "positron", alt: "پوزیترون، برگریزون قیمت‌ها شروع شد، انواع ساعت، دیدن شعب", href: "/stores/positron" },
    { id: "doris", alt: "درریس، برگریزون قیمت‌ها شروع شد، زیبایی از جنس طلا، دیدن شعب", href: "/stores/doris" },
    { id: "charm-mashhad", alt: "چرم مشهد، برگریزون قیمت‌ها شروع شد، پوشاک چرم، خرید قسطی", href: "/stores/charm-mashhad" },
  ],
};

export const IN_STORE_BOTTOM_STRIP = {
  id: "in-store-bottom",
  ratio: "368 / 110",
  visible: 3.15,
  banners: [
    { id: "jambo", alt: "جانبو به دیجی‌پی پیوست، خرید حضوری و اعتباری، دیدن شعب", href: "/stores/jambo" },
    { id: "cadenza", alt: "کادنزا به دیجی‌پی پیوست، خرید حضوری و اعتباری، دیدن شعب", href: "#" },
    { id: "bam-khodro", alt: "بم خودرو به دیجی‌پی پیوست، خرید حضوری و اعتباری، دیدن شعب", href: "#" },
    { id: "charm-nafis", alt: "چرم نفیس به دیجی‌پی پیوست، خرید حضوری و اعتباری، دیدن شعب", href: "/stores/behboud" },
  ],
};
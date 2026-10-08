import { useSearchParams } from "react-router-dom";

import BannerSlider from "../../components/BannerSlider/BannerSlider";
import FeaturedStores from "../../components/FeaturedStores/FeaturedStores";
import InStoreHero from "../../components/InStoreHero/InStoreHero";
import StoreCategories from "../../components/StoreCategories/StoreCategories";
import StoresTabs from "../../components/StoresTabs/StoresTabs";

import { getStoreMode } from "../../constants/storeModes";
import { usePageTitle } from "../../hooks/usePageTitle";
import { resolveImage } from "../../utils/resolveImage";

import "./StoresPage.css";

/* =========================================================
   Images
   Slider banners: src/assets/images/stores/banners/online-instagram.webp ...
   Store logos:    src/assets/images/brands/<store id>.svg|webp|png
                   (FeaturedStores finds them by id, nothing to import here)
   A missing file never breaks the page (a logo falls back to the
   first letter of the store name).
========================================================= */

const BANNER_IMAGES = import.meta.glob(
  "../../assets/images/stores/banners/*.{webp,png,jpg,svg}",
  { eager: true, import: "default" }
);

/* =========================================================
   Data
========================================================= */

/** Online tab slider: `image` = file name inside stores/banners/ */
const ONLINE_BANNERS = [
  { id: "instagram", image: "online-instagram", alt: "فروش قسطی در اینستاگرام" },
  { id: "villa", image: "online-villa", alt: "اجاره ویلا و کلبه با اعتبار دیجی‌پی" },
  { id: "gold", image: "online-gold", alt: "هرخرید یک شانس برای بردن طلای دیجیتال" },
  { id: "digicard", image: "online-digicard", alt: "دیجی‌کارت" },
].map((banner) => ({
  ...banner,
  image: resolveImage(BANNER_IMAGES, banner.image),
  href: "#",
}));

/** id = logo file name in assets/images/brands/ */
const IN_STORE_BRANDS = [
  { id: "pierre-cardin", name: "پیر کاردین" },
  { id: "doris", name: "درریس" },
  { id: "charm-mashhad", name: "چرم مشهد" },
  { id: "david-jones", name: "دیوید جونز" },
  { id: "komar", name: "کوماز" },
  { id: "lc-waikiki", name: "ال سی وایکیکی" },
  { id: "rest", name: "رست" },
  { id: "roja", name: "روژا" },
  { id: "serge", name: "سرژه" },
];

const ONLINE_BRANDS = [
  { id: "mosbat-sabz", name: "مثبت سبز" },
  { id: "goshi-shop", name: "گوشی شاپ" },
  { id: "positron", name: "پوزیترون" },
  { id: "bani-mod", name: "بانی مد" },
  { id: "titi-bol", name: "تی تی بول" },
  { id: "pelaza", name: "پلازا دیجیتال" },
  { id: "astin", name: "آستین" },
].map((store) => ({
  ...store,
  to: `/stores/${store.id}`, // opens pages/StoreDetailPage
}));

/* =========================================================
   Tab contents
========================================================= */

function OnlineStores() {
  return (
    <>
      <StoreCategories />

      <BannerSlider banners={ONLINE_BANNERS} label="بنرهای فروشگاه‌های آنلاین" />

      <FeaturedStores
        title="فروشگاه‌های منتخب"
        subtitle="۵٪ بازگشت پول در خرید با دیجی‌کارت"
        stores={ONLINE_BRANDS}
      />
    </>
  );
}

function InStoreStores() {
  return (
    <>
      <InStoreHero />

      <FeaturedStores
        title="فروشگاه‌های منتخب"
        subtitle="۵٪ بازگشت پول در خرید با دیجی‌کارت"
        stores={IN_STORE_BRANDS}
      />
    </>
  );
}

/* =========================================================
   Stores page   (/stores?mode=online | offline)
   The active tab lives in the URL, so a refresh, the back button
   and the header sub-links ("آنلاین" / "حضوری") always match.
========================================================= */

function StoresPage() {
  usePageTitle("فروشگاه‌ها"); // tab title: "فروشگاه‌ها | دیجی‌پی"

  const [searchParams, setSearchParams] = useSearchParams();
  const mode = getStoreMode(searchParams.get("mode"));

  const handleModeChange = (nextMode) =>
    setSearchParams({ mode: nextMode }, { replace: true });

  return (
    <div className="stores-page">
      <div className="stores-page__container">
        <div className="stores-page__tabs">
          <StoresTabs value={mode} onChange={handleModeChange} />
        </div>

        {/* key = mode, so the panel replays its fade-in on every switch */}
        <div
          className="stores-page__panel"
          role="tabpanel"
          id="stores-panel"
          aria-labelledby={`stores-tab-${mode}`}
          key={mode}
        >
          {mode === "offline" ? <InStoreStores /> : <OnlineStores />}
        </div>
      </div>
    </div>
  );
}

export default StoresPage;
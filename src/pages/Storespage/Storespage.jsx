import { useSearchParams } from "react-router-dom";

import BannerSlider from "../../components/Bannerslider/Bannerslider";
import FeaturedStores from "../../components/Featuredstores/Featuredstores";
import InStoreHero from "../../components/Instorehero/Instorehero";
import StoreCategories from "../../components/Storecategories/Storecategories";
import StoresTabs from "../../components/Storestabs/Storestabs";

import { getStoreMode } from "../../constants/storeModes";
import { usePageTitle } from "../../hooks/usepagetitle";
import { resolveImage } from "../../utils/Resolveimage";

import "./Storespage.css";

/* =========================================================
   Images
   Put the files here, named like the ids below (webp / png / svg):
     src/assets/images/stores/banners/  online-instagram.webp ...
     src/assets/images/brands/          serge.svg, roja.svg ...
   A missing file never breaks the page (logos fall back to the
   first letter of the name).
========================================================= */

const BANNER_IMAGES = import.meta.glob(
  "../../assets/images/stores/banners/*.{webp,png,jpg,svg}",
  { eager: true, import: "default" }
);

const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,svg}",
  { eager: true, import: "default" }
);

/* =========================================================
   Data
========================================================= */

/** Online tab slider: `image` = file name inside stores/banners/ */
const ONLINE_BANNERS = [
  { id: "instagram", image: "online-instagram", alt: "فروش قسطی در اینستاگرام" },
  { id: "villa", image: "ejare-villa", alt: "اجاره ویلا و کلبه با اعتبار دیجی‌پی" },
  { id: "saat", image: "saat-paiz", alt: "ساعت پاییزی با اعتبار دیجی پی" },
  { id: "goshishop", image: "goshi-shop", alt: "2 ملیون تخفیف از گوشی شاپ" },
].map((banner) => ({
  ...banner,
  image: resolveImage(BANNER_IMAGES, banner.image),
  href: "#",
}));

/** Featured stores: the logo file name = the store id */
const withLogos = (stores) =>
  stores.map((store) => ({
    ...store,
    logo: resolveImage(BRAND_LOGOS, store.id),
  }));

const IN_STORE_BRANDS = withLogos([
  { id: "pierre-cardin", name: "پیر کاردین" },
  { id: "doris", name: "درریس" },
  { id: "charm-mashhad", name: "چرم مشهد" },
  { id: "david-jones", name: "دیوید جونز" },
  { id: "komar", name: "کومار" },
  { id: "lc-waikiki", name: "ال سی وایکیکی" },
  { id: "rest", name: "رست" },
  { id: "roja", name: "روژا" },
  { id: "positron", name: "پوزیترون" },
]);

const ONLINE_BRANDS = withLogos([
  { id: "mosbat-sabz", name: "مثبت سبز" },
  { id: "goshi-shop", name: "گوشی شاپ" },
  { id: "positron", name: "پوزیترون" },
  { id: "bani-mod", name: "بانی مد" },
  { id: "titi-bol", name: "تی تی بول" },
  { id: "pelaza", name: "پلازا دیجیتال" },
  { id: "astin", name: "آستین" },
]);

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
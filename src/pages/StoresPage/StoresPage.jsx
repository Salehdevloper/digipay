import { useSearchParams } from "react-router-dom";

import BannerSlider from "../../components/BannerSlider/BannerSlider";
import BannerStrip from "../../components/BannerStrip/BannerStrip";
import BrandRow from "../../components/BrandRow/BrandRow";
import FeaturedStores from "../../components/FeaturedStores/FeaturedStores";
import InStoreHero from "../../components/InStoreHero/InStoreHero";
import PageSections from "../../components/PageSections/PageSections";
import StoreCategories from "../../components/StoreCategories/StoreCategories";
import StoresTabs from "../../components/StoresTabs/StoresTabs";

import { getStoreMode } from "../../constants/storeModes";
import { getBrandRowById } from "../../data/brandRows";
import {
  IN_STORE_BOTTOM_STRIP,
  IN_STORE_TOP_STRIP,
} from "../../data/inStoreStrips";
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
  { id: "ejare-villa", image: "ejare-villa", alt: "اجاره ویلا و کلبه با اعتبار دیجی‌پی" },
  { id: "goshi-shop", image: "goshi-shop", alt: "دو ملیون تخفیف از گوشی شاپ"},
  { id: "saat-paiz", image: "saat-paiz", alt: "ساعت پاییزی با اعتبار دیجی" },
].map((banner) => ({
  ...banner,
  image: resolveImage(BANNER_IMAGES, banner.image),
  href: "#",
}));

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
  // only the map banner lives inside the page container
  return <InStoreHero />;
}

/**
 * The rest of the «حضوری» tab, top to bottom:
 *   1. big banners        (right under the map banner)
 *   2. فروشگاه‌های منتخب   (round logos, data/brandRows.js)
 *   3. smaller banners
 * Move a line to change the order. They have their own width, so they are
 * drawn outside the page container.
 */
function InStoreSections() {
  const brandRow = getBrandRowById("in-store");

  return (
    <>
      <BannerStrip strip={IN_STORE_TOP_STRIP} />

      {brandRow && <BrandRow row={brandRow} />}

      <BannerStrip strip={IN_STORE_BOTTOM_STRIP} />
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

      {/* Online tab, after "فروشگاه‌های منتخب": قسطی شگفت / کد تخفیف /
          پرفروش‌ترین‌ها. Switch each one in config/pageSections.js (key "stores").
          They have their own width, so they live outside the container above. */}
      {mode === "online" && <PageSections page="stores" />}

      {mode === "offline" && <InStoreSections />}
    </div>
  );
}

export default StoresPage;
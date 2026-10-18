import { PAGE_LAYOUT } from "../../config/pageLayout";
import { getBannerStripById } from "../../data/bannerStrips";
import { getBestSellerGroups } from "../../data/bestSellers";
import { getPartnerPromoById } from "../../data/partnerPromos";
import { getPosterSectionById } from "../../data/posterSections";

import BannerStrip from "../BannerStrip/BannerStrip";
import DiscountCodes from "../DiscountCodes/DiscountCodes";
import FlashDeals from "../FlashDeals/FlashDeals";
import PartnerPromo from "../PartnerPromo/PartnerPromo";
import PosterSection from "../PosterSection/PosterSection";
import ProductSection from "../ProductSection/ProductSection";

/* One «پرفروش‌ترین‌های <فروشگاه>» row */
function BestSellerRow({ group }) {
  const { store, products, codes } = group;

  return (
    <ProductSection
      title={`پرفروش‌ترین‌های ${store.name}`}
      products={products}
      discountCodes={codes}
      allHref={`/stores/${store.id}`}
    />
  );
}

/**
 * Draws the sections of a page in the order written in
 * config/pageLayout.js:
 *
 *   <PageSections page="home" />      home page
 *   <PageSections page="stores" />    «فروشگاه‌ها», online tab
 *
 * An entry is  "type"  or  "type:id"  (see the list in pageLayout.js).
 * A section with nothing to show (no products, unknown id) draws nothing.
 */
function PageSections({ page }) {
  const layout = PAGE_LAYOUT[page] ?? [];

  const groups = getBestSellerGroups(page);

  // stores that the layout names one by one ("bestSellers:bani-mod")
  const placedStoreIds = layout
    .filter((entry) => entry.startsWith("bestSellers:"))
    .map((entry) => entry.split(":")[1]);

  return (
    <>
      {layout.map((entry, index) => {
        const [type, id] = entry.split(":");
        const key = `${entry}-${index}`;

        switch (type) {
          case "flashDeals":
            return <FlashDeals key={key} />;

          case "discountCodes":
            return <DiscountCodes key={key} />;

          case "bestSellers": {
            // "bestSellers:bani-mod" -> one store, "bestSellers" -> the rest
            const rows = id
              ? groups.filter(({ store }) => store.id === id)
              : groups.filter(({ store }) => !placedStoreIds.includes(store.id));

            return rows.map((group) => (
              <BestSellerRow group={group} key={`${key}-${group.store.id}`} />
            ));
          }

          case "promo": {
            const promo = getPartnerPromoById(id);
            return promo ? <PartnerPromo promo={promo} key={key} /> : null;
          }

          case "posters": {
            const section = getPosterSectionById(id);
            return section ? <PosterSection section={section} key={key} /> : null;
          }

          case "banners": {
            const strip = getBannerStripById(id);
            return strip ? <BannerStrip strip={strip} key={key} /> : null;
          }

          default:
            return null;
        }
      })}
    </>
  );
}

export default PageSections;
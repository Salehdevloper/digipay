import { PAGE_SECTIONS } from "../../config/pageSections";
import { getBestSellerGroups } from "../../data/bestSellers";

import DiscountCodes from "../DiscountCodes/DiscountCodes";
import FlashDeals from "../FlashDeals/FlashDeals";
import ProductSection from "../ProductSection/ProductSection";

/**
 * The extra sections of a page, switched on / off in
 * config/pageSections.js (true / false):
 *
 *   <PageSections page="home" />      home page
 *   <PageSections page="stores" />    «فروشگاه‌ها», online tab
 *
 * Order:
 *   1. قسطی شگفت
 *   2. کد تخفیف            (the slider with all codes)
 *   3. پرفروش‌ترین‌های <فروشگاه>   one row per store, each with its own
 *                            products and its own discount code cards
 */
function PageSections({ page }) {
  const sections = PAGE_SECTIONS[page] ?? {};

  return (
    <>
      {sections.flashDeals && <FlashDeals />}

      {sections.discountCodes && <DiscountCodes />}

      {sections.bestSellers &&
        getBestSellerGroups(page).map(({ store, products, codes }) => (
          <ProductSection
            key={store.id}
            title={`پرفروش‌ترین‌های ${store.name}`}
            products={products}
            discountCodes={codes}
            allHref={`/stores/${store.id}`}
          />
        ))}
    </>
  );
}

export default PageSections;
import { Fragment } from "react";

import { PAGE_SECTIONS } from "../../config/pageSections";
import { getBestSellerGroups } from "../../data/bestSellers";
import { getPartnerPromos } from "../../data/partnerPromos";

import DiscountCodes from "../DiscountCodes/DiscountCodes";
import FlashDeals from "../FlashDeals/FlashDeals";
import PartnerPromo from "../PartnerPromo/PartnerPromo";
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
 *   3. پرفروش‌ترین‌های <فروشگاه>   one row per store
 *      + partner promo rows (data/partnerPromos.js), each one right after
 *        the row of the store named in its `afterStore`
 */
function PageSections({ page }) {
  const sections = PAGE_SECTIONS[page] ?? {};

  const groups = sections.bestSellers ? getBestSellerGroups(page) : [];
  const promos = sections.partnerPromos ? getPartnerPromos(page) : [];

  // a promo whose store has no row on this page goes after all the rows
  const hasRow = (storeId) => groups.some(({ store }) => store.id === storeId);
  const looseRows = promos.filter((promo) => !hasRow(promo.afterStore));

  return (
    <>
      {sections.flashDeals && <FlashDeals />}

      {sections.discountCodes && <DiscountCodes />}

      {groups.map(({ store, products, codes }) => (
        <Fragment key={store.id}>
          <ProductSection
            title={`پرفروش‌ترین‌های ${store.name}`}
            products={products}
            discountCodes={codes}
            allHref={`/stores/${store.id}`}
          />

          {promos
            .filter((promo) => promo.afterStore === store.id)
            .map((promo) => (
              <PartnerPromo promo={promo} key={promo.id} />
            ))}
        </Fragment>
      ))}

      {looseRows.map((promo) => (
        <PartnerPromo promo={promo} key={promo.id} />
      ))}
    </>
  );
}

export default PageSections;
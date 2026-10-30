import { getPageLayout } from "../../config/pageLayout";
import { getBannerStripById } from "../../data/bannerStrips";
import { getBestSellerGroups } from "../../data/bestSellers";
import { getBestSellerCodes, getCodesByStore } from "../../data/discountCodes";
import { getPartnerPromoById } from "../../data/partnerPromos";
import { getPosterSectionById } from "../../data/posterSections";
import { getStoreById } from "../../data/stores";
import {
  getSectionProducts,
  getSectionTitle,
  getStoreSections,
} from "../../data/storeSections";

import BannerStrip from "../BannerStrip/BannerStrip";
import BranchSection from "../BranchSection/BranchSection";
import DiscountCodes from "../DiscountCodes/DiscountCodes";
import FlashDeals from "../FlashDeals/FlashDeals";
import PartnerPromo from "../PartnerPromo/PartnerPromo";
import PosterSection from "../PosterSection/PosterSection";
import ProductSection from "../ProductSection/ProductSection";

/* One «پرفروش‌ترین‌های <فروشگاه>» row (home / stores pages) */
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

/* One product row of a store page (data/storeSections.js).
   The "best sellers" row also gets this store's discount code cards. */
function StoreSectionRow({ store, section }) {
  return (
    <ProductSection
      title={getSectionTitle(section, store)}
      products={getSectionProducts(store.id, section)}
      discountCodes={
        section.filter === "bestSeller"
          ? getBestSellerCodes("store", store.id)
          : []
      }
    />
  );
}

/**
 * Draws the sections of a page in the order written in
 * config/pageLayout.js:
 *
 *   <PageSections page="home" />                       home page
 *   <PageSections page="stores" />                     «فروشگاه‌ها», online tab
 *   <PageSections page="store" storeId="bani-mod" />   the page of one store
 *
 * An entry is  "type"  or  "type:id"  (see the list in pageLayout.js).
 * A section with nothing to show (no products, unknown id) draws nothing.
 */
function PageSections({ page, storeId }) {
  const layout = getPageLayout(page, storeId);

  const store = storeId ? getStoreById(storeId) : undefined;

  // best-sellers rows of all stores: only for the home / stores pages
  const groups = page === "store" ? [] : getBestSellerGroups(page);

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
              ? groups.filter(({ store: row }) => row.id === id)
              : groups.filter(({ store: row }) => !placedStoreIds.includes(row.id));

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

          /* ----- only on a store page ----- */

          case "storeBranches":
            return store ? <BranchSection store={store} key={key} /> : null;

          case "storeCodes":
            return store ? (
              <DiscountCodes
                codes={getCodesByStore(store.id)}
                showAllLink={false}
                key={key}
              />
            ) : null;

          case "storeSections":
            return store
              ? getStoreSections(store.id).map((section) => (
                  <StoreSectionRow
                    store={store}
                    section={section}
                    key={`${key}-${section.id}`}
                  />
                ))
              : null;

          case "storeSection": {
            const section = store
              ? getStoreSections(store.id).find((item) => item.id === id)
              : undefined;

            return section ? (
              <StoreSectionRow store={store} section={section} key={key} />
            ) : null;
          }

          default:
            return null;
        }
      })}
    </>
  );
}

export default PageSections;
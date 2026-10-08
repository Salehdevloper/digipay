import { Link, useParams } from "react-router-dom";

import DiscountCodes from "../../components/DiscountCodes/DiscountCodes";
import StoreProfile from "../../components/StoreProfile/StoreProfile";

import { getCodesByStore } from "../../data/discountCodes";
import { getStoreById } from "../../data/stores";
import { usePageTitle } from "../../hooks/usePageTitle";

import "./StoreDetailPage.css";

/* =========================================================
   Store page   (/stores/:storeId)   e.g. /stores/bani-mod

   - one page for every online store (data/stores.js)
   - tab title: "خرید اقساطی از بانی مد | دیجی‌پی"
   - the "کد تخفیف" section reads the shared list
     (data/discountCodes.js): a store with codes shows them,
     a store without codes shows nothing.
========================================================= */

function StoreDetailPage() {
  const { storeId } = useParams();
  const store = getStoreById(storeId);

  usePageTitle(store ? `خرید اقساطی از ${store.name}` : "فروشگاه پیدا نشد");

  if (!store) {
    return (
      <section className="store-detail">
        <div className="store-detail__container store-detail__empty">
          <h1 className="store-detail__empty-title">این فروشگاه پیدا نشد</h1>

          <Link to="/stores" className="store-detail__empty-link">
            بازگشت به فروشگاه‌ها
          </Link>
        </div>
      </section>
    );
  }

  const codes = getCodesByStore(store.id);

  return (
    <div className="store-detail">
      <div className="store-detail__container">
        <StoreProfile store={store} />
      </div>

      {/* renders nothing when `codes` is empty */}
      <DiscountCodes codes={codes} showAllLink={false} />
    </div>
  );
}

export default StoreDetailPage;
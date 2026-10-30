import { Link, useParams } from "react-router-dom";

import PageSections from "../../components/PageSections/PageSections";
import StoreProfile from "../../components/StoreProfile/StoreProfile";

import { getStoreById } from "../../data/stores";
import { usePageTitle } from "../../hooks/usePageTitle";

import "./StoreDetailPage.css";

/* =========================================================
   Store page   (/stores/:storeId)   e.g. /stores/charm-mashhad

   top to bottom:
     1. the store card              (StoreProfile)
     2. the rest of the sections    (PageSections, order in
                                     config/pageLayout.js, key "store")
                                     including «آدرس شعب حضوری»
                                     ("storeBranches")

   «خرید حضوری» in the store card scrolls down to #branches
   (the id lives in BranchSection).
   Tab title: "خرید اقساطی از چرم مشهد | دیجی‌پی"
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

  return (
    <div className="store-detail">
      <div className="store-detail__container">
        <StoreProfile store={store} />
      </div>

      {/* «آدرس شعب حضوری» is now drawn by PageSections ("storeBranches" in pageLayout.js) */}
      <PageSections page="store" storeId={store.id} />
    </div>
  );
}

export default StoreDetailPage;
import { Link, Navigate, useParams } from "react-router-dom";

import { FiArrowRight } from "react-icons/fi";

import BranchGrid from "../../components/BranchGrid/BranchGrid";

import { getStoreBranches } from "../../data/branches";
import { getStoreById } from "../../data/stores";
import { usePageTitle } from "../../hooks/usePageTitle";

import "./StoreBranchesPage.css";

/**
 * All the branches of a store   (/stores/:storeId/branches)
 * e.g. /stores/charm-mashhad/branches  ->  «شعبه‌های چرم مشهد»
 *
 * It opens from «مشاهده همه N شعبه»; the store's top card is not shown
 * here, only the arrow back to the store and the full list.
 */
function StoreBranchesPage() {
  const { storeId } = useParams();

  const store = getStoreById(storeId);
  const branches = store ? getStoreBranches(store.id) : [];

  // tab title: «شعبه‌های چرم مشهد | دیجی‌پی»
  usePageTitle(store ? `شعبه‌های ${store.name}` : "");

  // unknown store or a store without branches: nothing to show here
  if (!store || branches.length === 0) {
    return <Navigate to={store ? `/stores/${store.id}` : "/stores"} replace />;
  }

  return (
    <section className="store-branches">
      <div className="store-branches__container">
        <header className="store-branches__header">
          <Link
            to={`/stores/${store.id}`}
            className="store-branches__back"
            aria-label="بازگشت به صفحه فروشگاه"
          >
            <FiArrowRight aria-hidden="true" />
          </Link>

          <h1 className="store-branches__title">شعبه‌های {store.name}</h1>
        </header>

        <BranchGrid branches={branches} />
      </div>
    </section>
  );
}

export default StoreBranchesPage;
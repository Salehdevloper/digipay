import { Link } from "react-router-dom";

import { FiChevronLeft } from "react-icons/fi";

import {
  BRANCH_PREVIEW_COUNT,
  getStoreBranches,
} from "../../data/branches";
import { toPersianDigits } from "../../utils/format";

import BranchGrid from "../BranchGrid/BranchGrid";

import "./BranchSection.css";

/**
 * «آدرس شعب حضوری» on a store page: the first branches and a
 * «مشاهده همه ۴۵ شعبه» link to /stores/<id>/branches (all of them,
 * on a page without the store's top card).
 * A store without branches draws nothing.
 *
 * Props: store
 */
function BranchSection({ store }) {
  const branches = getStoreBranches(store.id);

  if (branches.length === 0) return null;

  const hasMore = branches.length > BRANCH_PREVIEW_COUNT;

  return (
    <section
      className="branch-section"
      id="branches" /* «خرید حضوری» scrolls here */
      aria-labelledby="branch-section-title"
    >
      <div className="branch-section__container">
        <header className="branch-section__header">
          <h2 className="branch-section__title" id="branch-section-title">
            آدرس شعب حضوری
          </h2>

          <Link
            to={`/stores/${store.id}/branches`}
            className="branch-section__all"
          >
            مشاهده همه {toPersianDigits(branches.length)} شعبه
            <FiChevronLeft aria-hidden="true" />
          </Link>
        </header>

        <BranchGrid branches={branches.slice(0, BRANCH_PREVIEW_COUNT)} />
      </div>
    </section>
  );
}

export default BranchSection;
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiCornerUpRight,
  FiPercent,
  FiShoppingBag,
} from "react-icons/fi";

import { storeHasDiscount } from "../../data/storeFilters";
import { toPersianDigits } from "../../utils/format";
import { resolveImage } from "../../utils/resolveImage";

import "./StoreListItem.css";

/* Logo: src/assets/images/brands/<store id>.svg|webp|png */
const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

/**
 * One row of the store list: logo, name, one-line description,
 * cashback chip and an arrow. The whole row opens /stores/<id>.
 *
 * The red badge on the logo = the store has a discount
 * (cashback or a discount code).
 */
function StoreListItem({ store }) {
  const { id, name, tagline, cashback = 0 } = store;

  const logo = resolveImage(BRAND_LOGOS, id);

  return (
    <li className="store-item">
      <Link to={`/stores/${id}`} className="store-item__link">
        <span className="store-item__logo-wrap">
          <span className="store-item__logo">
            {logo ? (
              <img src={logo} alt="" loading="lazy" draggable={false} />
            ) : (
              <FiShoppingBag aria-hidden="true" />
            )}
          </span>

          {storeHasDiscount(store) && (
            <span className="store-item__badge" aria-label="دارای تخفیف">
              <FiPercent aria-hidden="true" />
            </span>
          )}
        </span>

        <span className="store-item__info">
          <strong className="store-item__name">{name}</strong>
          {tagline && <span className="store-item__tagline">{tagline}</span>}
        </span>

        {cashback > 0 && (
          <span className="store-item__cashback">
            <FiCornerUpRight aria-hidden="true" />
            {toPersianDigits(cashback)}٪
          </span>
        )}

        <span className="store-item__arrow" aria-hidden="true">
          <FiArrowLeft />
        </span>
      </Link>
    </li>
  );
}

export default StoreListItem;
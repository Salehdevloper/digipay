import { useRef } from "react";
import { Link } from "react-router-dom";

import { FiPercent } from "react-icons/fi";

import { storeHasDiscount } from "../../data/storeFilters";
import { useDragScroll } from "../../hooks/useDragScroll";
import { resolveImage } from "../../utils/resolveImage";

import "./BrandCircles.css";

/* Logo: src/assets/images/brands/<store id>.svg|webp|png
   (a missing file shows the first letter of the name) */
const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

/**
 * Round brand logos with the name under each one. With `moreHref`, the last
 * circle is «بیشتر» (three dots).
 *
 * Desktop: a grid with `columns` logos per row (it wraps into rows).
 * Mobile : one row that scrolls sideways.
 *
 * Props:
 *   brands              store objects [{ id, name, ... }]
 *   limit               how many brands to show (default: all)
 *   columns             logos per row on desktop (default: all in one row)
 *   size                logo diameter in px (default 100)
 *   moreHref            adds the «بیشتر» circle that opens this link
 *   showDiscountBadge   red % badge on the logo of a store with a discount
 *   label               accessible name
 */
function BrandCircles({
  brands,
  limit = brands.length,
  columns,
  size = 100,
  moreHref,
  showDiscountBadge = false,
  label = "برندها",
}) {
  const listRef = useRef(null);
  const { isDragging, handlers } = useDragScroll(listRef);

  const shown = brands.slice(0, limit);
  const hasMore = Boolean(moreHref);

  return (
    <nav className="brand-circles" aria-label={label}>
      <ul
        ref={listRef}
        className={`brand-circles__list ${
          isDragging ? "brand-circles__list--dragging" : ""
        }`}
        style={{
          "--brand-columns": columns ?? shown.length + (hasMore ? 1 : 0),
          "--brand-size": `${size}px`,
        }}
        {...handlers}
      >
        {shown.map((brand) => {
          const logo = resolveImage(BRAND_LOGOS, brand.id);

          return (
            <li key={brand.id}>
              <Link
                to={brand.to ?? `/stores/${brand.id}`}
                className="brand-circles__item"
              >
                <span className="brand-circles__logo-wrap">
                  <span className="brand-circles__logo">
                    {logo ? (
                      <img src={logo} alt="" loading="lazy" draggable={false} />
                    ) : (
                      <span aria-hidden="true">{brand.name.charAt(0)}</span>
                    )}
                  </span>

                  {showDiscountBadge && storeHasDiscount(brand) && (
                    <span className="brand-circles__badge" aria-label="دارای تخفیف">
                      <FiPercent aria-hidden="true" />
                    </span>
                  )}
                </span>

                <span className="brand-circles__name">{brand.name}</span>
              </Link>
            </li>
          );
        })}

        {hasMore && (
          <li>
            <Link
              to={moreHref}
              className="brand-circles__item brand-circles__item--more"
            >
              <span className="brand-circles__logo-wrap">
                <span className="brand-circles__logo" aria-hidden="true">
                  <span className="brand-circles__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </span>
              <span className="brand-circles__name">بیشتر</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default BrandCircles;
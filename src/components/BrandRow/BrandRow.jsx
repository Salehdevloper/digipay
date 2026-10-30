import { useId } from "react";
import { Link } from "react-router-dom";

import { FiChevronLeft, FiCornerUpRight } from "react-icons/fi";

import BrandCircles from "../BrandCircles/BrandCircles";

import "./BrandRow.css";

/**
 * «فروشگاه‌های منتخب»: title, blue subtitle, «همه» link and the round
 * logos (data/brandRows.js). Put it on a page with  "brands:<id>".
 *
 * Props: row  (see data/brandRows.js)
 */
function BrandRow({ row }) {
  const titleId = useId();

  if (row.brands.length === 0) return null;

  return (
    <section className="brand-row" aria-labelledby={titleId}>
      <div className="brand-row__container">
        <header className="brand-row__header">
          <div>
            <h2 className="brand-row__title" id={titleId}>
              {row.title}
            </h2>

            {row.subtitle && (
              <p className="brand-row__subtitle">
                <FiCornerUpRight aria-hidden="true" />
                {row.subtitle}
              </p>
            )}
          </div>

          {row.allHref && (
            <Link to={row.allHref} className="brand-row__all">
              همه
              <FiChevronLeft aria-hidden="true" />
            </Link>
          )}
        </header>

        <BrandCircles
          brands={row.brands}
          columns={row.columns}
          size={row.size}
          moreHref={row.moreHref}
          showDiscountBadge
          label={row.title}
        />
      </div>
    </section>
  );
}

export default BrandRow;
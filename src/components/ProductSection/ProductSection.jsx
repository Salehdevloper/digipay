import { useCallback, useId, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { FiChevronLeft, FiPercent } from "react-icons/fi";

import { useDragScroll } from "../../hooks/useDragScroll";
import { toPersianDigits } from "../../utils/format";

import { CodeModal } from "../DiscountCodes/DiscountCodes";
import ProductCard from "../ProductCard/ProductCard";

import "./ProductSection.css";

/* =========================================================
   Discount code card (optional first cards of a slider)
   Click "مشاهده" -> the same modal as the "کد تخفیف" section.
========================================================= */

function CodeCard({ deal, onOpen }) {
  return (
    <li className="product-section__item product-section__item--code">
      <div className="code-card">
        <span className="code-card__icon">
          <FiPercent aria-hidden="true" />
        </span>

        <p className="code-card__title">
          کد تخفیف {toPersianDigits(deal.amount)} میلیون تومانی
        </p>

        <span className="code-card__divider" aria-hidden="true" />

        <bdi className="code-card__code" dir="ltr">
          {deal.code}
        </bdi>

        <button
          type="button"
          className="code-card__button"
          onClick={() => onOpen(deal)}
        >
          مشاهده
        </button>
      </div>
    </li>
  );
}

/* =========================================================
   ProductSection
   A titled, horizontally scrolling row of products.
   Drag with the mouse, swipe on touch screens.

   Props:
     title         text above the row   ("ویژه اکسسوری مردانه")
     products      list from data/products.js
     discountCodes optional list of codes: shown as the first cards
     allHref       link of "همه": "/stores/bani-mod" (in-app) or a URL; null = hide it
     className     optional extra class
========================================================= */

function ProductSection({
  title,
  products,
  discountCodes = [],
  allHref = "#",
  className = "",
}) {
  const titleId = useId();

  const listRef = useRef(null);
  const { isDragging, handlers } = useDragScroll(listRef);

  const [activeCode, setActiveCode] = useState(null);
  const closeModal = useCallback(() => setActiveCode(null), []);

  if (products.length === 0 && discountCodes.length === 0) return null;

  return (
    <section
      className={`product-section ${className}`}
      aria-labelledby={titleId}
    >
      <div className="product-section__container">
        <header className="product-section__header">
          <h2 className="product-section__title" id={titleId}>
            {title}
          </h2>

          {allHref &&
            (allHref.startsWith("/") ? (
              <Link to={allHref} className="product-section__all">
                همه
                <FiChevronLeft aria-hidden="true" />
              </Link>
            ) : (
              <a href={allHref} className="product-section__all">
                همه
                <FiChevronLeft aria-hidden="true" />
              </a>
            ))}
        </header>

        <ul
          ref={listRef}
          className={`product-section__list ${
            isDragging ? "product-section__list--dragging" : ""
          }`}
          {...handlers}
        >
          {discountCodes.map((deal) => (
            <CodeCard key={deal.id} deal={deal} onOpen={setActiveCode} />
          ))}

          {products.map((product) => (
            <li className="product-section__item" key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>

      {activeCode && <CodeModal deal={activeCode} onClose={closeModal} />}
    </section>
  );
}

export default ProductSection;
import { useId, useRef } from "react";

import { useDragScroll } from "../../hooks/useDragScroll";
import {
  formatPrice,
  getInstallmentPrice,
  toPersianDigits,
} from "../../utils/format";
import { resolveImage } from "../../utils/resolveImage";

import "./PosterSection.css";

/* =========================================================
   Pictures
   Brand logo : assets/images/brands/<brandId>.svg|webp|png
   Card photo : assets/images/posters/<section id>/<card id>.webp|png|jpg
   A missing file never breaks the page.
========================================================= */

const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

const POSTER_IMAGES = import.meta.glob(
  "../../assets/images/posters/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

/* photo of one card: posters/<sectionId>/<cardId>.* */
const getCardImage = (sectionId, cardId) => {
  const inFolder = Object.fromEntries(
    Object.entries(POSTER_IMAGES).filter(([path]) =>
      path.includes(`/posters/${sectionId}/`)
    )
  );

  return resolveImage(inFolder, cardId);
};

/* =========================================================
   One poster card
========================================================= */

function PosterCard({ section, card, logo }) {
  const { title, subtitle, price, installments, discount, url = "#" } = card;

  const image = getCardImage(section.id, card.id);
  const hasInstallments = Boolean(installments);

  return (
    <li className="poster-section__item">
      <a className="poster-card" href={url} draggable={false}>
        {image && (
          <img
            className="poster-card__image"
            src={image}
            alt=""
            loading="lazy"
            draggable={false}
          />
        )}

        {/* ----- top: brand + title ----- */}
        <div className="poster-card__top">
          <span className="poster-card__brand">
            <span className="poster-card__logo">
              {logo ? (
                <img src={logo} alt="" draggable={false} />
              ) : (
                <span aria-hidden="true">{section.brandName?.charAt(0)}</span>
              )}
            </span>
            {section.brandName}
          </span>

          <h3 className="poster-card__title">{title}</h3>
        </div>

        {/* ----- bottom: price line + installment bar ----- */}
        <div className="poster-card__bottom">
          {subtitle ? (
            <div className="poster-card__meta">
              <span>{subtitle}</span>

              {typeof discount === "number" && (
                <span className="poster-card__discount">
                  {toPersianDigits(discount)} ٪
                </span>
              )}
            </div>
          ) : (
            <div className="poster-card__meta">
              <span className="poster-card__full-price">
                {formatPrice(price)} <small>تومان</small>
              </span>
            </div>
          )}

          <div className="poster-card__bar">
            {hasInstallments && (
              <span className="poster-card__installments">
                <strong>{toPersianDigits(installments)}</strong>
                قسط
              </span>
            )}

            <span className="poster-card__amount">
              <strong>
                {formatPrice(
                  hasInstallments
                    ? getInstallmentPrice({ price, installments })
                    : price
                )}
              </strong>
              <small>{hasInstallments ? "تومانی" : "تومان"}</small>
            </span>
          </div>
        </div>
      </a>
    </li>
  );
}

/**
 * A titled row of tall poster cards (see data/posterSections.js).
 * Drag with the mouse, swipe on touch screens.
 *
 * Props: section
 */
function PosterSection({ section }) {
  const titleId = useId();

  const listRef = useRef(null);
  const { isDragging, handlers } = useDragScroll(listRef);

  const logo = resolveImage(BRAND_LOGOS, section.brandId);

  if (section.cards.length === 0) return null;

  return (
    <section className="poster-section" aria-labelledby={titleId}>
      <div className="poster-section__container">
        <h2 className="poster-section__title" id={titleId}>
          {section.title}
        </h2>

        <ul
          ref={listRef}
          className={`poster-section__list ${
            isDragging ? "poster-section__list--dragging" : ""
          }`}
          {...handlers}
        >
          {section.cards.map((card) => (
            <PosterCard
              section={section}
              card={card}
              logo={logo}
              key={card.id}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PosterSection;
import { useId } from "react";

import { FiArrowLeft, FiImage } from "react-icons/fi";

import { toPersianDigits } from "../../utils/format";
import { resolveImage } from "../../utils/resolveImage";

import "./PartnerPromo.css";

/* =========================================================
   Images
   Brand logo : assets/images/brands/<brandId>.svg|webp|png
   Products   : assets/images/promos/<promo id>/<item id>.webp|png|jpg
   A missing file never breaks the page (first letter / empty tile).
========================================================= */

const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

const PROMO_IMAGES = import.meta.glob(
  "../../assets/images/promos/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

/* picture of one product: promos/<promoId>/<itemId>.* */
const getItemImage = (promoId, itemId) => {
  const inFolder = Object.fromEntries(
    Object.entries(PROMO_IMAGES).filter(([path]) =>
      path.includes(`/promos/${promoId}/`)
    )
  );

  return resolveImage(inFolder, itemId);
};

/* The belt must be wider than the screen to loop without a gap:
   with only a few products the list is repeated until it has 10. */
const MIN_ITEMS = 10;
const SECONDS_PER_ITEM = 4; // belt speed: bigger = slower

/**
 * One product tile. `ariaHidden` is for the second copy of the belt.
 */
function PromoItem({ promo, item, ariaHidden }) {
  const image = getItemImage(promo.id, item.id);
  const hasDiscount = typeof item.discount === "number";

  return (
    <li className="partner-promo__item">
      <a
        className="partner-promo__tile"
        href={item.url ?? promo.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={ariaHidden ? -1 : undefined}
        aria-label={`${promo.title} ${promo.subtitle}`}
        draggable={false}
      >
        {hasDiscount && (
          <span className="partner-promo__badge">
            {toPersianDigits(item.discount)}٪
          </span>
        )}

        {image ? (
          <img src={image} alt="" loading="lazy" draggable={false} />
        ) : (
          <FiImage className="partner-promo__placeholder" aria-hidden="true" />
        )}
      </a>
    </li>
  );
}

/**
 * Partner promo row (see data/partnerPromos.js).
 *
 * The belt turns by itself (CSS animation), stops while the mouse is over
 * it, and does not move at all for people who asked for less motion
 * (they scroll it by hand).
 *
 * Props: promo
 */
function PartnerPromo({ promo }) {
  const titleId = useId();

  const logo = resolveImage(BRAND_LOGOS, promo.brandId);

  // enough products to fill the belt, then the same list once more:
  // the belt moves by exactly one list, so the loop has no jump
  const repeat = Math.max(1, Math.ceil(MIN_ITEMS / promo.items.length));
  const list = Array.from({ length: repeat }, () => promo.items).flat();

  return (
    <section className="partner-promo" aria-labelledby={titleId}>
      <div className="partner-promo__card">
        {/* ----- Brand + title + arrow ----- */}
        <header className="partner-promo__header">
          <span className="partner-promo__logo">
            {logo ? (
              <img src={logo} alt="" draggable={false} />
            ) : (
              <span aria-hidden="true">{promo.brandName?.charAt(0)}</span>
            )}
          </span>

          <div className="partner-promo__heading">
            <h2 className="partner-promo__title" id={titleId}>
              {promo.title}
            </h2>
            <p className="partner-promo__subtitle">{promo.subtitle}</p>
          </div>

          <a
            className="partner-promo__arrow"
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${promo.title} ${promo.subtitle}`}
          >
            <FiArrowLeft aria-hidden="true" />
          </a>
        </header>

        {/* ----- The turning belt ----- */}
        <div className="partner-promo__viewport">
          <div
            className="partner-promo__track"
            style={{
              animationDuration: `${list.length * SECONDS_PER_ITEM}s`,
            }}
          >
            <ul className="partner-promo__set">
              {list.map((item, index) => (
                <PromoItem
                  promo={promo}
                  item={item}
                  key={`${item.id}-${index}`}
                />
              ))}
            </ul>

            {/* second copy: only for the loop, hidden from screen readers */}
            <ul className="partner-promo__set partner-promo__set--copy" aria-hidden="true">
              {list.map((item, index) => (
                <PromoItem
                  promo={promo}
                  item={item}
                  ariaHidden
                  key={`copy-${item.id}-${index}`}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerPromo;
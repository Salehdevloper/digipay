import { useId, useRef } from "react";
import { Link } from "react-router-dom";

import { FiChevronLeft, FiCreditCard } from "react-icons/fi";

import { useDragScroll } from "../../hooks/useDragScroll";
import { resolveImage } from "../../utils/resolveImage";

import "./FeaturedStores.css";

/* =========================================================
   Logos
   Every logo lives in  src/assets/images/brands/  and its file name
   is the store id:   id: "serge"  ->  brands/serge.svg
   (webp / png / jpg / svg all work). No imports needed:
   add the file, use the same id in the stores list, done.
========================================================= */

const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,svg}",
  { eager: true, import: "default" }
);

/** Round logo; shows the first letter while a store has no logo yet. */
function StoreLogo({ name, logo }) {
  if (logo) {
    return <img src={logo} alt="" loading="lazy" draggable={false} />;
  }

  return (
    <span className="featured-stores__initial" aria-hidden="true">
      {name.charAt(0)}
    </span>
  );
}

/**
 * Props:
 *   title      section title
 *   subtitle   optional blue line under the title (with a card icon)
 *   stores     [{ id, name, logo?, to?, href? }]
 *              to = route inside the app (e.g. "/stores/bani-mod")
 *              logo is optional: by default it is brands/<id>.*
 *   allHref    link of the "همه" button
 */
function FeaturedStores({ title, subtitle, stores, allHref = "#" }) {
  const titleId = useId();

  const listRef = useRef(null);
  const { isDragging, handlers } = useDragScroll(listRef);

  return (
    <section className="featured-stores" aria-labelledby={titleId}>
      <header className="featured-stores__header">
        <div className="featured-stores__heading">
          <h2 className="featured-stores__title" id={titleId}>
            {title}
          </h2>

          {subtitle && (
            <p className="featured-stores__subtitle">
              <FiCreditCard aria-hidden="true" />
              {subtitle}
            </p>
          )}
        </div>

        <a href={allHref} className="featured-stores__all">
          همه
          <FiChevronLeft aria-hidden="true" />
        </a>
      </header>

      <ul
        ref={listRef}
        className={`featured-stores__list ${
          isDragging ? "featured-stores__list--dragging" : ""
        }`}
        {...handlers}
      >
        {stores.map(({ id, name, logo, to, href = "#" }) => {
          const item = (
            <>
              <span className="featured-stores__logo">
                {/* an explicit `logo` wins; otherwise brands/<id>.* */}
                <StoreLogo
                  name={name}
                  logo={logo ?? resolveImage(BRAND_LOGOS, id)}
                />
              </span>
              <span className="featured-stores__name">{name}</span>
            </>
          );

          return (
            <li key={id}>
              {/* `to` = page inside the app, `href` = plain link */}
              {to ? (
                <Link to={to} className="featured-stores__item">
                  {item}
                </Link>
              ) : (
                <a href={href} className="featured-stores__item">
                  {item}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FeaturedStores;
import { useId, useRef } from "react";

import { FiChevronLeft, FiCreditCard } from "react-icons/fi";

import { useDragScroll } from "../../hooks/usedragscroll";

import "./Featuredstores.css";

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
 *   stores     [{ id, name, logo?, href? }]
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
        {stores.map(({ id, name, logo, href = "#" }) => (
          <li key={id}>
            <a href={href} className="featured-stores__item">
              <span className="featured-stores__logo">
                <StoreLogo name={name} logo={logo} />
              </span>
              <span className="featured-stores__name">{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeaturedStores;
import { FiHelpCircle, FiShoppingBag } from "react-icons/fi";

import { resolveImage } from "../../utils/resolveImage";

import "./StoreProfile.css";

/* =========================================================
   Images
   Logo : src/assets/images/brands/<store id>.svg|webp|png
   Cover: src/assets/images/stores/covers/<store id>.webp|png|jpg
   A missing file never breaks the page (an icon / gray block shows).
========================================================= */

const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

const STORE_COVERS = import.meta.glob(
  "../../assets/images/stores/covers/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

/**
 * Top card of a store page: cover photo, name, "خرید آنلاین" button,
 * "معرفی فروشگاه" text and category chips.
 * Desktop: photo on the right, texts on the left (one white card).
 * Mobile : photo on top, the summary floats over its bottom edge.
 *
 * Props: store  (see data/stores.js)
 */
function StoreProfile({ store }) {
  const {
    id,
    name,
    tagline,
    paymentLabels = [],
    description,
    tags = [],
    website = "#",
    inStoreUrl,
    guideUrl = "#",
  } = store;

  const logo = resolveImage(BRAND_LOGOS, id);
  const cover = resolveImage(STORE_COVERS, id);

  const hasAbout = Boolean(description) || tags.length > 0;

  return (
    <section className="store-profile" aria-labelledby="store-profile-name">
      {/* ----- Cover photo ----- */}
      <div className="store-profile__cover">
        {cover && <img src={cover} alt="" draggable={false} />}
      </div>

      <div className="store-profile__content">
        {/* ----- Name + button ----- */}
        <div className="store-profile__summary">
          <div className="store-profile__identity">
            <span className="store-profile__logo">
              {logo ? (
                <img src={logo} alt="" draggable={false} />
              ) : (
                <FiShoppingBag aria-hidden="true" />
              )}
            </span>

            <div className="store-profile__info">
              <h1 className="store-profile__name" id="store-profile-name">
                {name}
              </h1>

              {tagline && <p className="store-profile__tagline">{tagline}</p>}

              {paymentLabels.length > 0 && (
                <p className="store-profile__payment">
                  {paymentLabels.map((label, index) => (
                    <span key={label}>
                      {index > 0 && (
                        <span
                          className="store-profile__separator"
                          aria-hidden="true"
                        >
                          {" | "}
                        </span>
                      )}
                      {label}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {/* "خرید حضوری" only appears for stores that have shops (inStoreUrl) */}
          <div className="store-profile__actions">
            {inStoreUrl && (
              <a
                className="store-profile__cta store-profile__cta--secondary"
                href={inStoreUrl}
              >
                خرید حضوری
              </a>
            )}

            <a
              className="store-profile__cta"
              href={website}
              target="_blank"
              rel="noopener noreferrer"
            >
              خرید آنلاین
            </a>
          </div>
        </div>

        {/* ----- About + chips (hidden when the store has no text) ----- */}
        {hasAbout && (
          <div className="store-profile__about">
            <header className="store-profile__about-header">
              <h2 className="store-profile__about-title">معرفی فروشگاه</h2>

              <a href={guideUrl} className="store-profile__guide">
                <FiHelpCircle aria-hidden="true" />
                راهنمای خرید
              </a>
            </header>

            {description && (
              <p className="store-profile__description">{description}</p>
            )}

            {tags.length > 0 && (
              <ul className="store-profile__tags">
                {tags.map((tag) => (
                  <li className="store-profile__tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default StoreProfile;
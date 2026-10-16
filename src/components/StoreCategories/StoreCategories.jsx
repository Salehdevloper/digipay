import { useRef } from "react";
import { Link } from "react-router-dom";

import { STORE_CATEGORIES } from "../../data/storeCategories";
import { useDragScroll } from "../../hooks/useDragScroll";
import { resolveImage } from "../../utils/resolveImage";

import "./StoreCategories.css";

/* =========================================================
   Images
   Put the files in  src/assets/images/store-categories/
   named exactly like the category id:  fun.webp, digital.webp, ...
   (webp / png / svg all work). A missing file shows an empty tile.
   The list of categories itself: data/storeCategories.js
========================================================= */

const IMAGES = import.meta.glob(
  "../../assets/images/store-categories/*.{webp,png,svg}",
  { eager: true, import: "default" }
);

/**
 * Row of store categories (online tab). Drag with the mouse or swipe.
 * A tile opens the filtered list:  /stores/category/<id>
 */
function StoreCategories() {
  const listRef = useRef(null);
  const { isDragging, handlers } = useDragScroll(listRef);

  return (
    <nav className="store-categories" aria-label="دسته‌بندی فروشگاه‌ها">
      <ul
        ref={listRef}
        className={`store-categories__list ${
          isDragging ? "store-categories__list--dragging" : ""
        }`}
        {...handlers}
      >
        {STORE_CATEGORIES.map(({ id, label }) => {
          const image = resolveImage(IMAGES, id);

          return (
            <li key={id}>
              <Link
                to={`/stores/category/${id}`}
                className="store-categories__item"
              >
                <span className="store-categories__icon">
                  {image && <img src={image} alt="" draggable={false} />}
                </span>
                <span className="store-categories__label">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default StoreCategories;
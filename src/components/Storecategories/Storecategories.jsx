  import { useRef } from "react";

  import { useDragScroll } from "../../hooks/usedragscroll";
  import { resolveImage } from "../../utils/Resolveimage";

  import "./Storecategories.css";

  /* =========================================================
    Images
    Put the files in  src/assets/images/store-categories/
    named exactly like the category id:  fun.webp, beauty.webp, ...
    (webp / png / svg all work). A missing file shows an empty tile.
  ========================================================= */

  const IMAGES = import.meta.glob(
    "../../assets/images/stores/store-categories/*.{webp,png,svg}",
    { eager: true, import: "default" }
  );

  const CATEGORIES = [
    { id: "fun", label: "تفریح و سرگرمی" },
    { id: "beauty", label: "زیبایی و بهداشت" },
    { id: "books", label: "کتاب و لوازم تحریر" },
    { id: "courses", label: "دوره‌های آموزشی" },
    { id: "grocery", label: "کالای مصرفی خانوار" },
    { id: "auto", label: "خودرو و موتورسیکلت" },
    { id: "gifts", label: "هدیه و لوازم تولد" },
    { id: "kids", label: "لوازم کودک" },
    { id: "tools", label: "ابزارآلات و تجهیزات" },
    { id: "health", label: "سلامت و درمان" },
    { id: "services", label: "خدمات" },
    { id: "pets", label: "حیوانات خانگی" },
    { id: "plants", label: "گل و گیاه" },
  ];

  /** Row of store categories (online tab). Drag with the mouse or swipe. */
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
          {CATEGORIES.map(({ id, label }) => {
            const image = resolveImage(IMAGES, id);

            return (
              <li key={id}>
                <a href="#" className="store-categories__item">
                  <span className="store-categories__icon">
                    {image && <img src={image} alt="" draggable={false} />}
                  </span>
                  <span className="store-categories__label">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  export default StoreCategories;
import { STORE_MODE_ITEMS } from "../../constants/storeModes";

import "./Storestabs.css";

/**
 * Segmented control: "فروشگاه‌های آنلاین | فروشگاه‌های حضوری".
 * A sliding pill shows the active tab (position comes from --tab-index).
 *
 * Props:
 *   value     id of the active tab
 *   onChange  (id) => void
 *   items     [{ id, label }]  (defaults to the store modes)
 */
function StoresTabs({ value, onChange, items = STORE_MODE_ITEMS }) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === value)
  );

  /* Arrow keys move between tabs. The page is RTL: Left = next. */
  const handleKeyDown = (event) => {
    const direction =
      event.key === "ArrowLeft" ? 1 : event.key === "ArrowRight" ? -1 : 0;

    if (!direction) return;

    event.preventDefault();

    const nextIndex = (activeIndex + direction + items.length) % items.length;
    const nextId = items[nextIndex].id;

    onChange(nextId);
    document.getElementById(`stores-tab-${nextId}`)?.focus();
  };

  return (
    <div
      className="stores-tabs"
      role="tablist"
      aria-label="نوع فروشگاه‌ها"
      style={{ "--tab-index": activeIndex, "--tab-count": items.length }}
    >
      <span className="stores-tabs__indicator" aria-hidden="true" />

      {items.map(({ id, label }) => (
        <button
          type="button"
          role="tab"
          key={id}
          id={`stores-tab-${id}`}
          aria-selected={id === value}
          aria-controls="stores-panel"
          tabIndex={id === value ? 0 : -1}
          className={`stores-tabs__tab ${
            id === value ? "stores-tabs__tab--active" : ""
          }`}
          onClick={() => onChange(id)}
          onKeyDown={handleKeyDown}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default StoresTabs;
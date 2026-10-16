import { useState } from "react";

import { FiChevronDown, FiChevronUp, FiSliders } from "react-icons/fi";

import { STORE_CATEGORIES } from "../../data/storeCategories";
import {
  PAYMENT_METHODS,
  SORT_OPTIONS,
  STORE_TYPES,
} from "../../data/storeFilters";

import "./StoreFilters.css";

/** add the id to the list, or remove it when it is already there */
const toggleItem = (list, id) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

/* One collapsible block of the panel */
function FilterSection({ id, title, openId, onToggle, children }) {
  const isOpen = openId === id;

  return (
    <section className="store-filters__section">
      <button
        type="button"
        className="store-filters__section-header"
        aria-expanded={isOpen}
        onClick={() => onToggle(isOpen ? null : id)}
      >
        <span>{title}</span>
        {isOpen ? (
          <FiChevronUp aria-hidden="true" />
        ) : (
          <FiChevronDown aria-hidden="true" />
        )}
      </button>

      {isOpen && <div className="store-filters__options">{children}</div>}
    </section>
  );
}

/**
 * Filter panel: مرتب‌سازی / نحوه خرید / دسته‌بندی‌ها / نوع فروشگاه.
 *
 * Props:
 *   value      { sort, payments, types, categories }
 *   onChange   (nextValue) => void
 *   onApply    optional: shows «تایید» (mobile sheet)
 *   onCancel   optional: shows «انصراف» (mobile sheet)
 */
function StoreFilters({ value, onChange, onApply, onCancel }) {
  const [openId, setOpenId] = useState("sort"); // one block open at a time

  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="store-filters">
      <h2 className="store-filters__title">
        <FiSliders aria-hidden="true" />
        فیلترها
      </h2>

      {/* ----- Sort (one choice) ----- */}
      <FilterSection
        id="sort"
        title="مرتب‌سازی"
        openId={openId}
        onToggle={setOpenId}
      >
        {SORT_OPTIONS.map(({ id, label }) => (
          <label className="store-filters__option" key={id}>
            <input
              type="radio"
              name="store-sort"
              checked={value.sort === id}
              onChange={() => update({ sort: id })}
            />
            <span>{label}</span>
          </label>
        ))}
      </FilterSection>

      {/* ----- How to pay (many choices) ----- */}
      <FilterSection
        id="payments"
        title="نحوه خرید"
        openId={openId}
        onToggle={setOpenId}
      >
        {PAYMENT_METHODS.map(({ id, label }) => (
          <label className="store-filters__option" key={id}>
            <input
              type="checkbox"
              checked={value.payments.includes(id)}
              onChange={() =>
                update({ payments: toggleItem(value.payments, id) })
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </FilterSection>

      {/* ----- Categories ----- */}
      <FilterSection
        id="categories"
        title="دسته‌بندی‌ها"
        openId={openId}
        onToggle={setOpenId}
      >
        {STORE_CATEGORIES.map(({ id, label }) => (
          <label className="store-filters__option" key={id}>
            <input
              type="checkbox"
              checked={value.categories.includes(id)}
              onChange={() =>
                update({ categories: toggleItem(value.categories, id) })
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </FilterSection>

      {/* ----- Online / in-store ----- */}
      <FilterSection
        id="types"
        title="نوع فروشگاه"
        openId={openId}
        onToggle={setOpenId}
      >
        {STORE_TYPES.map(({ id, label }) => (
          <label className="store-filters__option" key={id}>
            <input
              type="checkbox"
              checked={value.types.includes(id)}
              onChange={() => update({ types: toggleItem(value.types, id) })}
            />
            <span>{label}</span>
          </label>
        ))}
      </FilterSection>

      {(onApply || onCancel) && (
        <div className="store-filters__actions">
          {onCancel && (
            <button
              type="button"
              className="store-filters__cancel"
              onClick={onCancel}
            >
              انصراف
            </button>
          )}

          {onApply && (
            <button
              type="button"
              className="store-filters__apply"
              onClick={onApply}
            >
              تایید
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default StoreFilters;
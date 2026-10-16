import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { FiArrowRight, FiSliders } from "react-icons/fi";

import StoreFilters from "../../components/StoreFilters/StoreFilters";
import StoreListItem from "../../components/StoreListItem/StoreListItem";

import {
  getCategoryById,
  STORE_CATEGORIES,
} from "../../data/storeCategories";
import {
  countActiveFilters,
  DEFAULT_SORT,
  filterStores,
} from "../../data/storeFilters";
import { usePageTitle } from "../../hooks/usePageTitle";
import { toPersianDigits } from "../../utils/format";

import "./StoreListPage.css";

/* =========================================================
   Store list with filters   (/stores/category/:categoryId)
   e.g. /stores/category/digital
        tab title: «فروشگاه‌های کالای دیجیتال قسطی | دیجی‌پی»

   - desktop: filter card on the right, list on the left
   - mobile : the «فیلترها» button opens the panel full-screen
              (changes apply only with «تایید»)
   The filter logic lives in data/storeFilters.js
========================================================= */

const toggleItem = (list, id) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

/* Quick filter chips above the list (they mirror the panel) */
function FilterChips({ filters, onChange }) {
  const chips = [
    {
      id: "sort-popular",
      label: "محبوب‌ترین",
      active: filters.sort === "popular",
      onClick: () => onChange({ ...filters, sort: "popular" }),
    },
    {
      id: "type-offline",
      label: "حضوری",
      active: filters.types.includes("offline"),
      onClick: () =>
        onChange({ ...filters, types: toggleItem(filters.types, "offline") }),
    },
    {
      id: "type-online",
      label: "آنلاین",
      active: filters.types.includes("online"),
      onClick: () =>
        onChange({ ...filters, types: toggleItem(filters.types, "online") }),
    },
    {
      id: "pay-credit",
      label: "خرید اعتباری",
      active: filters.payments.includes("credit"),
      onClick: () =>
        onChange({
          ...filters,
          payments: toggleItem(filters.payments, "credit"),
        }),
    },
    {
      id: "pay-loan",
      label: "خرید با وام",
      active: filters.payments.includes("loan"),
      onClick: () =>
        onChange({
          ...filters,
          payments: toggleItem(filters.payments, "loan"),
        }),
    },
    // every ticked category: click to remove it
    ...filters.categories.map((id) => ({
      id: `cat-${id}`,
      label: STORE_CATEGORIES.find((category) => category.id === id)?.label,
      active: true,
      onClick: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((item) => item !== id),
        }),
    })),
  ];

  return (
    <ul className="store-list__chips" aria-label="فیلترهای سریع">
      {chips.map(({ id, label, active, onClick }) => (
        <li key={id}>
          <button
            type="button"
            className={`store-list__chip ${
              active ? "store-list__chip--active" : ""
            }`}
            aria-pressed={active}
            onClick={onClick}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* The page itself (re-created when the category in the URL changes) */
function StoreListContent({ category }) {
  const [filters, setFilters] = useState(() => ({
    sort: DEFAULT_SORT,
    payments: [],
    types: [],
    categories: [category.id],
  }));

  // mobile sheet: edits happen on a copy, «تایید» applies it
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  const stores = useMemo(() => filterStores(filters), [filters]);
  const activeCount = countActiveFilters(filters);

  const openSheet = () => {
    setDraft(filters);
    setIsSheetOpen(true);
  };

  const applySheet = () => {
    setFilters(draft);
    setIsSheetOpen(false);
  };

  // the page behind the sheet must not scroll
  useEffect(() => {
    if (!isSheetOpen) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isSheetOpen]);

  const resetFilters = () =>
    setFilters({
      sort: DEFAULT_SORT,
      payments: [],
      types: [],
      categories: [],
    });

  return (
    <section className="store-list">
      <div className="store-list__container">
        {/* ----- Title row ----- */}
        <header className="store-list__header">
          <Link to="/stores" className="store-list__back" aria-label="بازگشت">
            <FiArrowRight aria-hidden="true" />
          </Link>

          <h1 className="store-list__title">فروشگاه‌ها</h1>

          <button
            type="button"
            className="store-list__filter-button"
            onClick={openSheet}
          >
            <FiSliders aria-hidden="true" />
            فیلترها
            {activeCount > 0 && (
              <span className="store-list__filter-count">
                {toPersianDigits(activeCount)}
              </span>
            )}
          </button>
        </header>

        <div className="store-list__layout">
          {/* ----- Desktop filter card ----- */}
          <aside className="store-list__sidebar">
            <StoreFilters value={filters} onChange={setFilters} />
          </aside>

          {/* ----- Results ----- */}
          <div className="store-list__results">
            <FilterChips filters={filters} onChange={setFilters} />

            <p className="store-list__count" aria-live="polite">
              {toPersianDigits(stores.length)} فروشگاه یافت شد
            </p>

            {stores.length > 0 ? (
              <ul className="store-list__list">
                {stores.map((store) => (
                  <StoreListItem store={store} key={store.id} />
                ))}
              </ul>
            ) : (
              <div className="store-list__empty">
                <p>فروشگاهی با این فیلترها پیدا نشد.</p>

                <button
                  type="button"
                  className="store-list__reset"
                  onClick={resetFilters}
                >
                  حذف فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----- Mobile: full-screen filter sheet ----- */}
      {isSheetOpen && (
        <div
          className="store-list__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="فیلترها"
        >
          <div className="store-list__sheet-card">
            <StoreFilters
              value={draft}
              onChange={setDraft}
              onApply={applySheet}
              onCancel={() => setIsSheetOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function StoreListPage() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);

  // «فروشگاه‌های کالای دیجیتال قسطی | دیجی‌پی»
  usePageTitle(category ? `فروشگاه‌های ${category.label} قسطی` : "");

  if (!category) return <Navigate to="/stores" replace />;

  // key = category: opening another category starts with fresh filters
  return <StoreListContent category={category} key={category.id} />;
}

export default StoreListPage;
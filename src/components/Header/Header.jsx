import { useCallback, useEffect, useRef, useState } from "react";

import {
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCreditCard,
  FiGrid,
  FiHome,
  FiMenu,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiSmartphone,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";

import { RiBankCardLine } from "react-icons/ri";

import digipayLogo from "../../assets/images/logo/digipay-logo.svg";

import "./Header.css";

/* =========================================================
   Data
========================================================= */

/* =========================
   Top / Mobile menu items
   (items with `children` render as dropdowns)
========================== */

const MENU_ITEMS = [
  {
    id: "loan",
    label: "وام و اعتبار",
    children: [
      { label: "وام خرید کالا", icon: FiShoppingCart },
      { label: "الان بخر، بعداً پرداخت کن", icon: FiClock },
      { label: "خرید اقساطی از دیجی‌کالا", icon: FiCreditCard },
    ],
  },
  {
    id: "insurance",
    label: "بیمه",
    children: [
      { label: "بیمه شخص ثالث", icon: FiShield },
      { label: "بیمه تجهیزات الکترونیک", icon: FiSmartphone },
    ],
  },
  { id: "investment", label: "مدیریت سرمایه" },
  {
    id: "business",
    label: "خدمات کسب و کارها",
    children: [
      { label: "درگاه پرداخت اقساطی", icon: FiCreditCard },
      { label: "وام فروشندگان", icon: FiBriefcase },
      { label: "تسویه زودهنگام", icon: FiZap },
    ],
  },
  { id: "organization", label: "راهکارهای سازمانی" },
];

/* =========================
   Quick links (main header + bottom navigation)
========================== */

const QUICK_LINKS = [
  { id: "home", label: "خانه", icon: FiHome, active: true },
  { id: "services", label: "خدمات", icon: FiGrid },
  { id: "stores", label: "فروشگاه‌ها", icon: FiShoppingBag, badge: "%" },
  { id: "payment", label: "پرداخت", icon: RiBankCardLine },
];

/* =========================================================
   Hooks
========================================================= */

const MOBILE_QUERY = "(max-width: 1000px)";

/**
 * Returns true after the page is scrolled past `enter`,
 * and false again only when it goes back under `leave`.
 * The gap (hysteresis) prevents flickering around one threshold.
 */
function useScrollState({ enter = 80, leave = 30 } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled((previous) => (previous ? y > leave : y > enter));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enter, leave]);

  return isScrolled;
}

/** Locks body scroll while `locked` is true. */
function useBodyScrollLock(locked) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}

/** Calls `onClose` on Escape key, or when the viewport becomes desktop-size. */
function useAutoCloseMenu(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const media = window.matchMedia(MOBILE_QUERY);
    const onMediaChange = (event) => {
      if (!event.matches) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onMediaChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onMediaChange);
    };
  }, [isOpen, onClose]);
}

const SEARCH_PLACEHOLDER = "جستجو در خدمات، فروشگاه‌ها، محصولات";

/* =========================================================
   Search box (desktop pill + mobile bar)
========================================================= */

function SearchBox({
  variant,
  value,
  onChange,
  isOpen = true,
  onToggle,
  inputRef,
}) {
  return (
    <div
      className={`header__search header__search--${variant} ${
        isOpen ? "header__search--open" : ""
      }`}
    >
      <button
        type="button"
        className="header__search-button"
        aria-label={isOpen ? "بستن جستجو" : "باز کردن جستجو"}
        onClick={onToggle}
      >
        <FiSearch />
      </button>

      {isOpen && (
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          className="header__search-input"
          aria-label="جستجو"
        />
      )}
    </div>
  );
}

/* =========================================================
   Desktop top navigation
========================================================= */

function TopNavigation() {
  return (
    <nav className="header__top-navigation" aria-label="منوی اصلی">
      {MENU_ITEMS.map(({ id, label, children }) =>
        children ? (
          <div className="header__dropdown" key={id}>
            <a href="#" className="header__top-link" aria-haspopup="true">
              {label}
              <FiChevronDown className="header__dropdown-arrow" />
            </a>

            <div className="header__dropdown-menu">
              {children.map(({ label: itemLabel, icon: Icon }) => (
                <a href="#" className="header__dropdown-item" key={itemLabel}>
                  <span className="header__dropdown-icon">
                    <Icon />
                  </span>
                  <span>{itemLabel}</span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <a href="#" className="header__top-link" key={id}>
            {label}
          </a>
        )
      )}
    </nav>
  );
}

/* =========================================================
   Mobile slide-in menu
========================================================= */

function MobileMenu({ isOpen, openItem, onToggleItem, onClose }) {
  return (
    <div
      className={`header__mobile-menu-wrapper ${
        isOpen ? "header__mobile-menu-wrapper--open" : ""
      }`}
    >
      <div className="header__mobile-overlay" onClick={onClose} />

      <aside className="header__mobile-panel" aria-hidden={!isOpen}>
        <div className="header__mobile-panel-header">
          <img
            src={digipayLogo}
            alt="دیجی‌پی"
            className="header__mobile-panel-logo"
          />

          <button
            type="button"
            className="header__mobile-close"
            onClick={onClose}
            aria-label="بستن منو"
          >
            <FiX />
          </button>
        </div>

        <nav className="header__mobile-navigation" aria-label="منوی موبایل">
          {MENU_ITEMS.map(({ id, label, children }) =>
            children ? (
              <div
                key={id}
                className={`header__mobile-item ${
                  openItem === id ? "header__mobile-item--open" : ""
                }`}
              >
                <button
                  type="button"
                  className="header__mobile-link"
                  aria-expanded={openItem === id}
                  onClick={() => onToggleItem(id)}
                >
                  <span>{label}</span>
                  <FiChevronDown />
                </button>

                <div className="header__mobile-submenu">
                  <div className="header__mobile-submenu-inner">
                    {children.map(({ label: itemLabel, icon: Icon }) => (
                      <a href="#" key={itemLabel} onClick={onClose}>
                        <Icon />
                        <span>{itemLabel}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                href="#"
                key={id}
                className="header__mobile-simple-link"
                onClick={onClose}
              >
                {label}
              </a>
            )
          )}
        </nav>
      </aside>
    </div>
  );
}

/* =========================================================
   Mobile bottom navigation
========================================================= */

function BottomNavigation() {
  return (
    <nav className="header__bottom-navigation" aria-label="دسترسی سریع موبایل">
      {QUICK_LINKS.map(({ id, label, icon: Icon, active, badge }) => (
        <a
          href="#"
          key={id}
          className={`header__bottom-link ${
            active ? "header__bottom-link--active" : ""
          }`}
        >
          <Icon />
          <span>{label}</span>
          {badge && <span className="header__bottom-badge">{badge}</span>}
        </a>
      ))}

      <a href="#" className="header__bottom-link">
        <FiUser />
        <span>ورود</span>
      </a>
    </nav>
  );
}

/* =========================================================
   Header
========================================================= */

function Header() {
  const isScrolled = useScrollState();

  const [searchValue, setSearchValue] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState(null);

  const searchInputRef = useRef(null);

  /* Desktop search: always open at top, collapsed to an icon when scrolled */
  const isSearchOpen = !isScrolled || isSearchExpanded;

  useEffect(() => {
    setIsSearchExpanded(false);
  }, [isScrolled]);

  useEffect(() => {
    if (isScrolled && isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isScrolled, isSearchExpanded]);

  /* Mobile menu */
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileItem(null);
  }, []);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const toggleMobileItem = (id) =>
    setOpenMobileItem((previous) => (previous === id ? null : id));

  useBodyScrollLock(isMobileMenuOpen);
  useAutoCloseMenu(isMobileMenuOpen, closeMobileMenu);

  /* Handlers */
  const handleSearchToggle = () => {
    if (isScrolled) setIsSearchExpanded((previous) => !previous);
  };

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Keeps page content below the fixed header (no layout shift on scroll) */}
      <div className="header-spacer" aria-hidden="true" />

      <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
        <div className="header__container">
          {/* ---------- Top row ---------- */}
          <div className="header__top">
            <a href="#" className="header__logo" aria-label="دیجی‌پی">
              <img src={digipayLogo} alt="دیجی‌پی" />
            </a>

            <TopNavigation />

            <a href="#" className="header__login">
              <span>ورود / ثبت‌نام</span>
              <FiUser />
            </a>

            <button
              type="button"
              className="header__mobile-menu"
              aria-label={isMobileMenuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* ---------- Mobile search ---------- */}
          <div className="header__mobile-search">
            <SearchBox
              variant="mobile"
              value={searchValue}
              onChange={setSearchValue}
            />
          </div>

          {/* ---------- Desktop main bar ---------- */}
          <div className="header__main">
            <button
              type="button"
              className="header__scroll-top"
              aria-label="بازگشت به بالای صفحه"
              onClick={handleScrollToTop}
            >
              <FiChevronUp />
            </button>

            <nav className="header__navigation" aria-label="دسترسی سریع">
              {QUICK_LINKS.map(({ id, label, icon: Icon, active, badge }) => (
                <a
                  href="#"
                  key={id}
                  className={`header__nav-link ${
                    active ? "header__nav-link--active" : ""
                  }`}
                >
                  <Icon />
                  <span>{label}</span>
                  {badge && (
                    <span className="header__notification">{badge}</span>
                  )}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="header__user"
              aria-label="حساب کاربری"
            >
              <FiUser />
            </button>

            <SearchBox
              variant="desktop"
              value={searchValue}
              onChange={setSearchValue}
              isOpen={isSearchOpen}
              onToggle={handleSearchToggle}
              inputRef={searchInputRef}
            />
          </div>
        </div>
      </header>

      {/* These are position: fixed, so they live OUTSIDE <header>
          (a backdrop-filter on the header would otherwise trap them) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        openItem={openMobileItem}
        onToggleItem={toggleMobileItem}
        onClose={closeMobileMenu}
      />

      <BottomNavigation />
    </>
  );
}

export default Header;
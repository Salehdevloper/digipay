import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiClock,
  FiCopy,
  FiShoppingBag,
  FiTag,
  FiX,
} from "react-icons/fi";

import "./Discountcodes.css";

/* =========================================================
   Config
========================================================= */

const DRAG_THRESHOLD = 5; // px before a press counts as a drag
const COPIED_RESET_MS = 2000;

/* =========================================================
   Store logos

   The logo of a code is picked by `storeId`: put an image in
   assets/images/brands/ whose FILE NAME equals the storeId
   (e.g. storeId "positron"  ->  brands/positron.webp).
========================================================= */

const STORE_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

const LOGOS_BY_ID = Object.fromEntries(
  Object.entries(STORE_LOGOS).map(([path, url]) => {
    const fileName = path.split("/").pop();
    return [fileName.slice(0, fileName.lastIndexOf(".")), url];
  })
);

const getStoreLogo = (storeId) => LOGOS_BY_ID[storeId] ?? null;

/* =========================================================
   Helpers
========================================================= */

const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);

const formatAmount = (millions) =>
  `${toPersianDigits(millions)} میلیون`;

/* =========================================================
   Codes (edit here)

   storeId     -> file name of the logo in assets/images/brands
   amount      -> discount in million toman
   minPurchase -> minimum cart in million toman (optional)
========================================================= */

const CODES = [
  {
    id: 1,
    store: "بانی مد",
    storeId: "bani-mod",
    amount: 2,
    minPurchase: 10,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "DEHOTB",
    url: "#",
  },
  {
    id: 2,
    store: "پوزیترون",
    storeId: "positron",
    amount: 5,
    minPurchase: 20,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "CEPOYD",
    url: "#",
  },
  {
    id: 3,
    store: "مثبت سبز",
    storeId: "mosbat-sabz",
    amount: 2,
    minPurchase: 5,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "DERTMO",
    url: "#",
  },
  {
    id: 4,
    store: "گوشی شاپ",
    storeId: "goshi-shop",
    amount: 3,
    minPurchase: 15,
    expiry: "۳۰ مهر ۱۴۰۵",
    code: "DEGSOH",
    url: "#",
  },
];

const getSteps = (store) => [
  "کالای مورد نظر رو انتخاب کن",
  `بعد از نهایی کردن سبد خرید برای پرداخت درگاه ${store} رو انتخاب کن`,
  "گزینه پرداخت اعتباری رو بزن و بعد روی دکمه ادامه کلیک کن",
  `در درگاه ${store} دکمه کد تخفیف رو انتخاب و کد مورد نظر رو وارد کن`,
];

/* =========================================================
   Store logo (falls back to an icon when no image matches)
========================================================= */

function StoreLogo({ storeId, store }) {
  const logo = getStoreLogo(storeId);

  return (
    <span className="discount-codes__logo">
      {logo ? (
        <img src={logo} alt={store} loading="lazy" draggable={false} />
      ) : (
        <FiShoppingBag aria-label={store} />
      )}
    </span>
  );
}

/* =========================================================
   Copy to clipboard
========================================================= */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback for http / old browsers
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }

    document.body.removeChild(field);
    return ok;
  }
}

/* =========================================================
   Modal
========================================================= */

function CodeModal({ deal, onClose }) {
  const { store, storeId, amount, minPurchase, expiry, code, url } = deal;

  const closeButtonRef = useRef(null);
  const resetTimer = useRef(null);
  const [copied, setCopied] = useState(false);

  const title = `${formatAmount(amount)} تخفیف`;

  // Esc closes, page behind does not scroll, focus returns on close
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      clearTimeout(resetTimer.current);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const handleCopy = async () => {
    const ok = await copyText(code);
    if (!ok) return;

    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(
      () => setCopied(false),
      COPIED_RESET_MS
    );
  };

  return createPortal(
    <div
      className="discount-modal__overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="discount-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-modal-title"
        dir="rtl"
      >
        {/* Header */}

        <header className="discount-modal__header">
          <StoreLogo storeId={storeId} store={store} />

          <div className="discount-modal__heading">
            <h3 id="discount-modal-title" className="discount-modal__title">
              {title}
            </h3>

            {minPurchase > 0 && (
              <p className="discount-modal__subtitle">
                {title} برای حداقل خرید {formatAmount(minPurchase)}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="discount-modal__close"
            onClick={onClose}
            aria-label="بستن"
          >
            <FiX aria-hidden="true" />
          </button>
        </header>

        {/* Body */}

        <div className="discount-modal__body">
          <p className="discount-modal__expiry">
            <FiClock aria-hidden="true" />
            قابل استفاده تا {expiry}
          </p>

          <h4 className="discount-modal__steps-title">
            از کد تخفیف چطور استفاده کنم؟
          </h4>

          <ol className="discount-modal__steps">
            {getSteps(store).map((step, index) => (
              <li key={step} className="discount-modal__step">
                <span className="discount-modal__step-number">
                  {toPersianDigits(index + 1)}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}

        <footer className="discount-modal__footer">
          <div className="discount-modal__code-box">
            <span className="discount-modal__code">
              کد تخفیف : <bdi dir="ltr">{code}</bdi>
            </span>

            <button
              type="button"
              className={`discount-modal__copy ${
                copied ? "discount-modal__copy--done" : ""
              }`}
              onClick={handleCopy}
            >
              {copied ? (
                <FiCheck aria-hidden="true" />
              ) : (
                <FiCopy aria-hidden="true" />
              )}
              <span aria-live="polite">{copied ? "کپی شد" : "کپی کد"}</span>
            </button>
          </div>

          <a
            className="discount-modal__site"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            مشاهده وبسایت
            <FiArrowLeft aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>,
    document.body
  );
}

/* =========================================================
   Code card (ticket)
========================================================= */

function CodeCard({ deal, onOpen }) {
  const { store, storeId, amount, code } = deal;

  return (
    <li className="discount-codes__item">
      <button
        type="button"
        className="discount-codes__card"
        onClick={() => onOpen(deal)}
        aria-label={`${store}، ${formatAmount(amount)} تومان تخفیف`}
      >
        <span className="discount-codes__main">
          <StoreLogo storeId={storeId} store={store} />

          <span className="discount-codes__info">
            <span className="discount-codes__store">{store}</span>
            <span className="discount-codes__amount">
              <strong>{toPersianDigits(amount)}</strong> میلیون تومان
            </span>
          </span>
        </span>

        <span className="discount-codes__stub">
          <span className="discount-codes__stub-label">
            <FiTag aria-hidden="true" />
            کد تخفیف
          </span>
          <bdi className="discount-codes__stub-code" dir="ltr">
            {code}
          </bdi>
        </span>
      </button>
    </li>
  );
}

/* =========================================================
   Drag-to-scroll (mouse). Touch uses native scrolling.
========================================================= */

function useDragScroll() {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });

  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: ref.current.scrollLeft,
    };
  };

  const onPointerMove = (event) => {
    const state = drag.current;
    if (!state.active) return;

    const distance = event.clientX - state.startX;

    if (!state.moved && Math.abs(distance) > DRAG_THRESHOLD) {
      state.moved = true;
      setIsDragging(true);
    }

    if (state.moved) {
      ref.current.scrollLeft = state.startScroll - distance;
    }
  };

  const endDrag = () => {
    if (!drag.current.active) return;

    drag.current.active = false;
    setIsDragging(false);
  };

  // a drag must not open the card underneath
  const onClickCapture = (event) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  return {
    ref,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
      onClickCapture,
    },
  };
}

/* =========================================================
   Discount Codes section
========================================================= */

function DiscountCodes() {
  const [activeDeal, setActiveDeal] = useState(null);
  const { ref, isDragging, handlers } = useDragScroll();
  const closeModal = useCallback(() => setActiveDeal(null), []);

  return (
    <section className="discount-codes" dir="rtl">
      <div className="discount-codes__container">
        <header className="discount-codes__header">
          <h2 className="discount-codes__heading">کد تخفیف</h2>

          <a href="#" className="discount-codes__all">
            همه
            <FiChevronLeft aria-hidden="true" />
          </a>
        </header>

        <div
          ref={ref}
          className={`discount-codes__viewport ${
            isDragging ? "discount-codes__viewport--dragging" : ""
          }`}
          {...handlers}
        >
          <ul className="discount-codes__track">
            {CODES.map((deal) => (
              <CodeCard key={deal.id} deal={deal} onOpen={setActiveDeal} />
            ))}
          </ul>
        </div>
      </div>

      {activeDeal && (
        <CodeModal deal={activeDeal} onClose={closeModal} />
      )}
    </section>
  );
}

export default DiscountCodes;
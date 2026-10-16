import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  FiChevronDown,
  FiCreditCard,
  FiMaximize,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";

import {
  GUIDE_INTRO,
  GUIDE_ITEMS,
  GUIDE_STEPS_TITLE,
  GUIDE_TITLE,
} from "../../data/purchaseGuide";
import { resolveImage } from "../../utils/resolveImage";

import "./PurchaseGuideModal.css";

/* =========================================================
   Pictures
   assets/images/guide/<item id>.webp|png|jpg
   (online.webp, card-reader.webp, qr.webp). No file = no picture.
========================================================= */

const GUIDE_IMAGES = import.meta.glob(
  "../../assets/images/guide/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

/* icon of each row, by item id */
const ICONS = {
  online: FiShoppingBag,
  "card-reader": FiCreditCard,
  qr: FiMaximize,
};

/* =========================================================
   One accordion row
========================================================= */

function GuideItem({ item, isOpen, onToggle }) {
  const uid = useId();
  const headerId = `${uid}-header`;
  const panelId = `${uid}-panel`;

  const Icon = ICONS[item.id] ?? FiShoppingBag;
  const image = resolveImage(GUIDE_IMAGES, item.id);

  return (
    <li className={`guide-item ${isOpen ? "guide-item--open" : ""}`}>
      <button
        type="button"
        className="guide-item__header"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <Icon className="guide-item__icon" aria-hidden="true" />
        <span className="guide-item__title">{item.title}</span>
        <FiChevronDown className="guide-item__chevron" aria-hidden="true" />
      </button>

      {/* the panel opens by animating its row height (0fr -> 1fr) */}
      <div
        className="guide-item__panel"
        id={panelId}
        role="region"
        aria-labelledby={headerId}
      >
        <div className="guide-item__panel-inner">
          <p className="guide-item__description">{item.description}</p>

          {image && (
            <img
              className="guide-item__image"
              src={image}
              alt=""
              loading="lazy"
              draggable={false}
            />
          )}

          <div className="guide-steps">
            <h3 className="guide-steps__title">
              <span className="guide-steps__ring" aria-hidden="true" />
              {item.stepsTitle ?? GUIDE_STEPS_TITLE}
            </h3>

            <ol className="guide-steps__list">
              {item.steps.map((step) => (
                <li className="guide-steps__step" key={step}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </li>
  );
}

/* =========================================================
   PurchaseGuideModal  («راهنمای فروشگاه‌ها»)

   Desktop: a centered window.  Mobile: slides up from the bottom.
   Closes with the X, the Esc key, or a click outside.

   Props:
     onClose        () => void
     defaultOpenId  optional: id of the row that starts open
========================================================= */

function PurchaseGuideModal({ onClose, defaultOpenId = null }) {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  const [openId, setOpenId] = useState(defaultOpenId); // one row at a time

  /* Esc closes · page behind does not scroll · focus comes back on close */
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
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="guide-modal__overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <header className="guide-modal__header">
          <button
            ref={closeButtonRef}
            type="button"
            className="guide-modal__close"
            onClick={onClose}
            aria-label="بستن"
          >
            <FiX aria-hidden="true" />
          </button>

          <h2 className="guide-modal__title" id={titleId}>
            {GUIDE_TITLE}
          </h2>
        </header>

        <div className="guide-modal__body">
          <p className="guide-modal__intro">{GUIDE_INTRO}</p>

          <ul className="guide-modal__list">
            {GUIDE_ITEMS.map((item) => (
              <GuideItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              />
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PurchaseGuideModal;
import { useEffect, useRef, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";

import { getFlashDealProducts } from "../../data/products";
import { getStoreById } from "../../data/stores";
import { getProductImage } from "../../utils/productImages";
import { resolveImage } from "../../utils/resolveImage";

import "./FlashDeals.css";

/* =========================================================
   Config
========================================================= */

const DRAG_THRESHOLD = 5; // px before a press counts as a drag

/* =========================================================
   Store Logos
   assets/images/brands/<storeId>.svg|webp|png|jpg
========================================================= */

const STORE_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  {
    eager: true,
    import: "default",
  }
);

/* =========================================================
   Helpers
========================================================= */

const toPersianDigits = (value) =>
  String(value).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );

const formatPrice = (price) =>
  toPersianDigits(
    Number(price).toLocaleString("en-US")
  );

const getStoreLogo = (storeId) => resolveImage(STORE_LOGOS, storeId);

/* =========================================================
   Deals
   No list here: every product with  flashDeal: true
   in data/products.js is shown in this section.
   The photo is found by store folder + product id:
   assets/images/products/<store id>/<product id>.*
========================================================= */

const DEALS = getFlashDealProducts().map((product) => ({
  ...product,
  store: getStoreById(product.storeId)?.name ?? "",
  image: getProductImage(product.id, product.storeId),
  installments: product.installments ?? 4,
  href: product.href ?? "#",
}));

/* =========================================================
   Countdown
========================================================= */

const getInitialTime = () => ({
  hours: 3,
  minutes: 59,
  seconds: 59,
});

function Countdown() {
  const [time, setTime] = useState(getInitialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((current) => {
        let { hours, minutes, seconds } = current;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours -= 1;
            } else {
              return getInitialTime();
            }
          }
        }

        return {
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flash-deals__timer" aria-hidden="true">
      <span className="flash-deals__time-box">
        {toPersianDigits(
          String(time.hours).padStart(2, "0")
        )}
      </span>

      <span className="flash-deals__time-separator">:</span>

      <span className="flash-deals__time-box">
        {toPersianDigits(
          String(time.minutes).padStart(2, "0")
        )}
      </span>

      <span className="flash-deals__time-separator">:</span>

      <span className="flash-deals__time-box">
        {toPersianDigits(
          String(time.seconds).padStart(2, "0")
        )}
      </span>
    </div>
  );
}

/* =========================================================
   Deal Card
========================================================= */

function DealCard({ deal }) {
  const {
    title,
    store,
    storeId,
    rating,
    installments,
    price,
    oldPrice,
    image,
    href,
  } = deal;

  const storeLogo = getStoreLogo(storeId);

  const discount =
    oldPrice > price
      ? Math.round(
          ((oldPrice - price) / oldPrice) * 100
        )
      : 0;

  return (
    <article className="flash-deals__item">
      <a
        href={href}
        className="flash-deals__card"
        aria-label={title}
        draggable={false}
      >
        {/* =========================
            Product Media
        ========================== */}

        <div className="flash-deals__media">
          {image && (
            <img
              className="flash-deals__image"
              src={image}
              alt=""
              loading="lazy"
              draggable={false}
            />
          )}

          {/* Store Logo + Rating */}

          <span className="flash-deals__store-badge">
            {storeLogo ? (
              <img
                src={storeLogo}
                alt={store}
                loading="lazy"
                draggable={false}
              />
            ) : (
              <FiShoppingBag aria-hidden="true" />
            )}

            {rating && (
              <span className="flash-deals__rating">
                {toPersianDigits(
                  rating.toFixed(1)
                )}
              </span>
            )}
          </span>

          {/* Bottom Overlay */}

          <div className="flash-deals__overlay">
            <span className="flash-deals__installments">
              <strong>
                {toPersianDigits(installments)}
              </strong>
              قسط
            </span>

            <span className="flash-deals__installment-price">
              <strong>
                {formatPrice(
                  Math.ceil(
                    price / installments
                  )
                )}
              </strong>

              <small>تومانی</small>
            </span>
          </div>
        </div>

        {/* =========================
            Card Body
        ========================== */}

        <div className="flash-deals__body">
          {/* Store */}

          <div className="flash-deals__store">
            <FiShoppingBag aria-hidden="true" />
            <span>{store}</span>
          </div>

          {/* Title */}

          <h3 className="flash-deals__title">
            {title}
          </h3>

          {/* Pricing */}

          <div className="flash-deals__pricing">
            <div
              className={`flash-deals__discount ${
                discount === 0
                  ? "flash-deals__discount--empty"
                  : ""
              }`}
            >
              {discount > 0 && (
                <span className="flash-deals__percent">
                  {toPersianDigits(discount)}٪
                </span>
              )}

              <span className="flash-deals__old-price">
                {oldPrice ? formatPrice(oldPrice) : ""}
              </span>
            </div>

            <div className="flash-deals__price">
              <strong>
                {formatPrice(price)}
              </strong>

              <small>تومان</small>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

/* =========================================================
   Deals Slider
========================================================= */

function DealsSlider() {
  const viewportRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // drag state lives in a ref: no re-render on every mouse move
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });

  const handlePointerDown = (event) => {
    // touch uses native scrolling; only handle the mouse here
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: viewportRef.current.scrollLeft,
    };
  };

  const handlePointerMove = (event) => {
    const state = drag.current;
    if (!state.active) return;

    const distance = event.clientX - state.startX;

    if (!state.moved && Math.abs(distance) > DRAG_THRESHOLD) {
      state.moved = true;
      setIsDragging(true);
    }

    if (state.moved) {
      viewportRef.current.scrollLeft = state.startScroll - distance;
    }
  };

  const endDrag = () => {
    if (!drag.current.active) return;

    drag.current.active = false;
    setIsDragging(false);
  };

  // a drag must not open the card link underneath
  const handleClickCapture = (event) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="flash-deals__slider">
      <div
        ref={viewportRef}
        className={`flash-deals__viewport ${
          isDragging ? "flash-deals__viewport--dragging" : ""
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={handleClickCapture}
      >
        <div className="flash-deals__track">
          {DEALS.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Flash Deals
========================================================= */

function FlashDeals() {
  // no product has flashDeal: true -> the whole section is hidden
  if (DEALS.length === 0) return null;

  return (
    <section
      className="flash-deals"
      dir="rtl"
    >
      <div className="flash-deals__container">
        {/* Header */}

        <header className="flash-deals__header">
          <h2 className="flash-deals__heading">
            قسطی شگفت
          </h2>

          <Countdown />
        </header>

        {/* Slider */}

        <DealsSlider />
      </div>
    </section>
  );
}

export default FlashDeals;
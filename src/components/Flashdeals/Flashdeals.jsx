import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { FiImage, FiShoppingBag } from "react-icons/fi";

import "./Flashdeals.css";

import vitaminD3 from "../../assets/images/Flashdeals/vitaminD3.webp";
import mosbatSabz from "../../assets/images/storelogo/mosbat-sabz.png";

import hoodi from "../../assets/images/Flashdeals/hoodi.webp";
import baniMod from "../../assets/images/storelogo/bani-mod.webp";

import mashinEslah from "../../assets/images/Flashdeals/mashin-eslah.webp";
import positron from "../../assets/images/storelogo/positron.webp";

import shemshTala from "../../assets/images/Flashdeals/shemsh-tala.webp";
import goshiShop from "../../assets/images/storelogo/goshi-shop.svg";

import saatMochi from "../../assets/images/Flashdeals/saat-mochi.webp";
import titiBol from "../../assets/images/storelogo/titi-bol.webp";

import laptop from "../../assets/images/Flashdeals/laptop.webp";
import pelaza from "../../assets/images/storelogo/pelaza.svg";

import topBlue from "../../assets/images/Flashdeals/top-blue.webp";
import astin from "../../assets/images/storelogo/astin.webp";

/* =========================================================
   Config
========================================================= */

/** End of the offer. Replace with the real value from your API. */
const DEAL_ENDS_AT = (() => {
  const date = new Date();
  date.setHours(23, 59, 59, 999); // today, 23:59:59
  return date.getTime();
})();

const AUTOPLAY_DELAY = 3000; // ms between automatic slides
const RESUME_DELAY = 4000; // autoplay waits this long after a user touch/drag
const NORMALIZE_DELAY = 150; // ms of "no scrolling" before the loop re-centers
const DRAG_START_DISTANCE = 6; // px before a mouse press counts as a drag
const COPIES = 3; // the list is rendered 3x to make an endless loop

/* =========================================================
   Data

   image / storeLogo are the imported files (see imports above).
   Set them to null to show a placeholder.
========================================================= */

const DEALS = [
  {
    id: 1,
    title: "قرص ویتامین D3 ۲۰۰۰ واحد ۹۰ عدد",
    store: "مثبت سبز",
    rating: 4.6,
    installments: 4,
    price: 144300,
    oldPrice: 267300,
    image: vitaminD3,
    storeLogo: mosbatSabz,
    href: "#",
  },
  {
    id: 2,
    title: "هودی زنانه مدل رنگ سرخابی",
    store: "بانی مد",
    rating: 4.6,
    installments: 4,
    price: 4130000,
    oldPrice: 5900000,
    image: hoodi,
    storeLogo: baniMod,
    href: "#",
  },
  {
    id: 3,
    title: "ماشین اصلاح موی سر و صورت شارژی وی جی آر",
    store: "پوزیترون",
    rating: 4.4,
    installments: 4,
    price: 5764000,
    oldPrice: 7205000,
    image: mashinEslah,
    storeLogo: positron,
    href: "#",
  },
  {
    id: 4,
    title: "شمش طلا ۱۸ عیار ۱ گرمی وتوسو مدل ملکه ۱۴۰۳",
    store: "گوشی شاپ",
    rating: 4.5,
    installments: 4,
    price: 29500000,
    oldPrice: 29900000,
    image: shemshTala,
    storeLogo: goshiShop,
    href: "#",
  },
  {
    id: 5,
    title: "ساعت مچی مردانه کاندینو مدل C4744/4",
    store: "تی تی بول",
    rating: 4.3,
    installments: 4,
    price: 75905000,
    oldPrice: 89300000,
    image: saatMochi,
    storeLogo: titiBol,
    href: "#",
  },
  {
    id: 6,
    title: "لپ تاپ ایسوس ۱۵.۶ اینچی مدل VivoBook 15",
    store: "پلازا دیجیتال",
    rating: 4.1,
    installments: 4,
    price: 171999000,
    oldPrice: 179999000,
    image: laptop,
    storeLogo: pelaza,
    href: "#",
  },
  {
    id: 7,
    title: "تاپ ابریشم طرح دار آبی",
    store: "آستین",
    rating: 4.2,
    installments: 4,
    price: 1250000,
    oldPrice: 1790000,
    image: topBlue,
    storeLogo: astin,
    href: "#",
  },
];

/* =========================================================
   Helpers
========================================================= */

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[digit]);

/** 1234567 -> ۱,۲۳۴,۵۶۷ */
const formatPrice = (value) => toPersianDigits(value.toLocaleString("en-US"));

const padTime = (value) => toPersianDigits(String(value).padStart(2, "0"));

/** Discount percentage, or 0 when there is no old price. */
const getDiscount = ({ price, oldPrice }) =>
  oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

/** Amount of one installment, rounded down to tens. */
const getInstallmentPrice = ({ price, installments }) =>
  Math.floor(price / installments / 10) * 10;

/* =========================================================
   Hooks
========================================================= */

/** Remaining time until `endsAt`, updated every second. */
function useCountdown(endsAt) {
  const getRemaining = () => {
    const total = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));

    return {
      hours: Math.floor(total / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt]);

  return remaining;
}

/**
 * Endless slider on top of a native scroll container.
 *
 * - The list is rendered COPIES times; we always stay in the middle copy.
 *   When the scroll gets too far, we jump by exactly one list width.
 *   Both copies look identical, so the jump is invisible.
 * - Autoplay moves one card every AUTOPLAY_DELAY and never stops at the end.
 * - Mouse drag works like touch scrolling (no arrow buttons).
 *
 * "position" = distance scrolled from the start (always >= 0).
 * The page is RTL, so scrollLeft is negative: scrollLeft = -position.
 */
function useInfiniteSlider(ref, itemCount) {
  const [isDragging, setIsDragging] = useState(false);

  const listWidthRef = useRef(0); // width of ONE copy of the list
  const stepRef = useRef(0); // distance between two neighbour cards

  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const pausedUntilRef = useRef(0);

  const dragStartXRef = useRef(null);
  const dragStartPositionRef = useRef(0);
  const movedRef = useRef(false);

  const getPosition = () => Math.abs(ref.current.scrollLeft);
  const setPosition = (value) => {
    ref.current.scrollLeft = -value;
  };

  const pauseAutoplay = () => {
    pausedUntilRef.current = Date.now() + RESUME_DELAY;
  };

  /* Measure one list width and one card step */
  const measure = () => {
    const cards = ref.current.firstElementChild.children;
    const first = cards[0].offsetLeft;

    listWidthRef.current = Math.abs(cards[itemCount].offsetLeft - first);
    stepRef.current = Math.abs(cards[1].offsetLeft - first);
  };

  /* Keep the position inside the middle copy. Returns how far we jumped. */
  const normalize = () => {
    const width = listWidthRef.current;
    if (!width) return 0;

    const position = getPosition();

    if (position < width * 0.5) {
      setPosition(position + width);
      return width;
    }

    if (position >= width * 1.5) {
      setPosition(position - width);
      return -width;
    }

    return 0;
  };

  /* Start in the middle copy; re-measure when the size changes */
  useLayoutEffect(() => {
    const element = ref.current;

    measure();
    setPosition(listWidthRef.current);

    const observer = new ResizeObserver(() => {
      const previousWidth = listWidthRef.current;
      const position = getPosition();

      measure();

      const width = listWidthRef.current;
      if (!previousWidth || !width) return;

      // keep the same card in view after the cards change size
      const offset = (((position % previousWidth) + previousWidth) % previousWidth) / previousWidth;
      setPosition(width * (1 + offset));
    });

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  /* Re-center once scrolling has stopped */
  useEffect(() => {
    const element = ref.current;
    let timer;

    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!draggingRef.current) normalize();
      }, NORMALIZE_DELAY);
    };

    element.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      element.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Autoplay: one card at a time, forever */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || itemCount < 2) return undefined;

    const timer = setInterval(() => {
      const isBusy =
        document.hidden ||
        hoveringRef.current ||
        draggingRef.current ||
        Date.now() < pausedUntilRef.current;

      if (isBusy) return;

      // next card is to the LEFT in RTL => negative direction
      ref.current.scrollBy({ left: -stepRef.current, behavior: "smooth" });
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  /* ----- Pointer handlers (mouse drag; touch scrolls natively) ----- */

  const onPointerDown = (event) => {
    pauseAutoplay();

    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragStartXRef.current = event.clientX;
    dragStartPositionRef.current = getPosition();
    movedRef.current = false;
  };

  const onPointerMove = (event) => {
    if (dragStartXRef.current === null) return;

    const delta = event.clientX - dragStartXRef.current;

    if (!movedRef.current && Math.abs(delta) > DRAG_START_DISTANCE) {
      movedRef.current = true;
      draggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (!movedRef.current) return;

    setPosition(dragStartPositionRef.current + delta);

    // if the loop jumped, move the drag origin by the same amount
    dragStartPositionRef.current += normalize();
  };

  const finishDrag = () => {
    pauseAutoplay();
    dragStartXRef.current = null;
    draggingRef.current = false;
    setIsDragging(false);
  };

  const onPointerEnter = (event) => {
    if (event.pointerType === "mouse") hoveringRef.current = true;
  };

  const onPointerLeave = () => {
    hoveringRef.current = false;
  };

  /* A drag must not open the product link */
  const onClickCapture = (event) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      movedRef.current = false;
    }
  };

  return {
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onPointerEnter,
      onPointerLeave,
      onClickCapture,
    },
  };
}

/* =========================================================
   Countdown timer
========================================================= */

function CountdownTimer({ endsAt }) {
  const { hours, minutes, seconds } = useCountdown(endsAt);

  return (
    <div
      className="flash-deals__timer"
      role="timer"
      aria-label={`${toPersianDigits(hours)} ساعت و ${toPersianDigits(
        minutes
      )} دقیقه تا پایان پیشنهاد`}
    >
      <span className="flash-deals__time-box">{padTime(hours)}</span>
      <span className="flash-deals__time-separator">:</span>
      <span className="flash-deals__time-box">{padTime(minutes)}</span>
      <span className="flash-deals__time-separator">:</span>
      <span className="flash-deals__time-box">{padTime(seconds)}</span>
    </div>
  );
}

/* =========================================================
   Deal card
========================================================= */

function DealCard({ deal, isClone }) {
  const { title, store, rating, installments, price, oldPrice, href } = deal;

  const discount = getDiscount(deal);
  const installmentPrice = getInstallmentPrice(deal);

  return (
    <li className="flash-deals__item" aria-hidden={isClone || undefined}>
      <a
        href={href}
        className="flash-deals__card"
        tabIndex={isClone ? -1 : undefined}
      >
        {/* ----- Image ----- */}
        <div className="flash-deals__media">
          {deal.image ? (
            <img
              className="flash-deals__image"
              src={deal.image}
              alt=""
              loading="lazy"
              draggable={false}
            />
          ) : (
            <span className="flash-deals__placeholder" aria-hidden="true">
              <FiImage />
            </span>
          )}

          <span className="flash-deals__store-badge">
            {deal.storeLogo ? (
              <img
                src={deal.storeLogo}
                alt=""
                loading="lazy"
                draggable={false}
              />
            ) : (
              <FiShoppingBag aria-hidden="true" />
            )}
            <span className="flash-deals__rating">
              {toPersianDigits(rating.toFixed(1))}
            </span>
          </span>

          <div className="flash-deals__overlay">
            <span className="flash-deals__installments">
              <strong>{toPersianDigits(installments)}</strong>
              قسط
            </span>

            <span className="flash-deals__installment-price">
              <strong>{formatPrice(installmentPrice)}</strong>
              <small>تومانی</small>
            </span>
          </div>
        </div>

        {/* ----- Details ----- */}
        <div className="flash-deals__body">
          <span className="flash-deals__store">
            <FiShoppingBag aria-hidden="true" />
            {store}
          </span>

          <h3 className="flash-deals__title">{title}</h3>

          <div className="flash-deals__pricing">
            <div
              className={`flash-deals__discount ${
                discount ? "" : "flash-deals__discount--empty"
              }`}
            >
              <span className="flash-deals__percent">
                {toPersianDigits(discount)} %
              </span>
              <del className="flash-deals__old-price">
                {formatPrice(oldPrice)}
              </del>
            </div>

            <div className="flash-deals__price">
              <strong>{formatPrice(price)}</strong>
              <small>تومان</small>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}

/* =========================================================
   Slider (endless loop + autoplay + drag, no buttons)
========================================================= */

function DealsSlider() {
  const viewportRef = useRef(null);

  const { isDragging, handlers } = useInfiniteSlider(
    viewportRef,
    DEALS.length
  );

  /* [list, list, list] -> only the middle copy is "real" for screen readers */
  const cards = Array.from({ length: COPIES }, (_, copy) =>
    DEALS.map((deal) => ({ deal, copy }))
  ).flat();

  return (
    <div className="flash-deals__slider">
      <div
        ref={viewportRef}
        className={`flash-deals__viewport ${
          isDragging ? "flash-deals__viewport--dragging" : ""
        }`}
        role="region"
        aria-roledescription="carousel"
        aria-label="پیشنهادهای قسطی شگفت"
        {...handlers}
      >
        <ul className="flash-deals__track">
          {cards.map(({ deal, copy }) => (
            <DealCard
              deal={deal}
              isClone={copy !== 1}
              key={`${copy}-${deal.id}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* =========================================================
   FlashDeals
========================================================= */

function FlashDeals() {
  return (
    <section className="flash-deals" aria-labelledby="flash-deals-title">
      <div className="flash-deals__container">
        <header className="flash-deals__header">
          <h2 className="flash-deals__heading" id="flash-deals-title">
            قسطی شگفت
          </h2>

          <CountdownTimer endsAt={DEAL_ENDS_AT} />
        </header>

        <DealsSlider />
      </div>
    </section>
  );
}

export default FlashDeals;
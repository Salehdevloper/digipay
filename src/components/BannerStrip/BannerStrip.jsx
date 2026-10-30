import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useDragScroll } from "../../hooks/useDragScroll";
import { resolveImage } from "../../utils/resolveImage";

import "./BannerStrip.css";

/* =========================================================
   Config
========================================================= */

const AUTOPLAY_DELAY = 4000; // ms between two moves
const RESUME_DELAY = 4000; // autoplay waits this long after a touch / drag

/* =========================================================
   Pictures
   assets/images/banner-strips/<strip id>/<banner id>.webp|png|jpg
   A missing file shows an empty gray banner, never an error.
========================================================= */

const STRIP_IMAGES = import.meta.glob(
  "../../assets/images/banner-strips/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

const getBannerImage = (stripId, bannerId) => {
  const inFolder = Object.fromEntries(
    Object.entries(STRIP_IMAGES).filter(([path]) =>
      path.includes(`/banner-strips/${stripId}/`)
    )
  );

  return resolveImage(inFolder, bannerId);
};

/**
 * A row of wide banners with dots (see data/bannerStrips.js).
 * It moves by itself, stops while the mouse is over it or a finger
 * touches it, and can be dragged / swiped. The dots show where you are
 * and jump to a position when clicked.
 *
 * Props: strip
 */
function BannerStrip({ strip }) {
  const viewportRef = useRef(null);
  const { isDragging, handlers } = useDragScroll(viewportRef);

  const [position, setPosition] = useState({ active: 0, total: 1 });

  const positionRef = useRef(position);
  const hoveringRef = useRef(false);
  const pausedUntilRef = useRef(0);

  /* distance between two neighbour banners (the page is RTL, so
     scrollLeft is 0 at the start and negative while scrolling) */
  const getStep = () => {
    const banners = viewportRef.current.children;

    return banners.length > 1
      ? Math.abs(banners[1].offsetLeft - banners[0].offsetLeft)
      : banners[0]?.offsetWidth ?? 1;
  };

  const scrollToIndex = (index) => {
    const element = viewportRef.current;
    const max = element.scrollWidth - element.clientWidth;

    element.scrollTo({
      left: -Math.min(index * getStep(), max),
      behavior: "smooth",
    });
  };

  /* Which position are we at, and how many positions exist?
     (with 3 banners on screen, 5 banners give 3 positions) */
  const update = useCallback(() => {
    const element = viewportRef.current;
    if (!element) return;

    const step = getStep();
    const max = element.scrollWidth - element.clientWidth;
    const last = Math.max(0, Math.round(max / step));
    const active = Math.min(last, Math.round(Math.abs(element.scrollLeft) / step));

    const next = { active, total: last + 1 };
    positionRef.current = next;

    setPosition((previous) =>
      previous.active === next.active && previous.total === next.total
        ? previous
        : next
    );
  }, []);

  useEffect(() => {
    const element = viewportRef.current;

    update();
    element.addEventListener("scroll", update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  /* Autoplay: one step forward, back to the first at the end */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return undefined;

    const timer = setInterval(() => {
      const { active, total } = positionRef.current;

      const isBusy =
        total < 2 ||
        document.hidden ||
        hoveringRef.current ||
        Date.now() < pausedUntilRef.current;

      if (!isBusy) scrollToIndex(active + 1 >= total ? 0 : active + 1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, []);

  const pause = () => {
    pausedUntilRef.current = Date.now() + RESUME_DELAY;
  };

  return (
    <section
      className="banner-strip"
      aria-label="بنرها"
      style={{
        // optional, per strip (data/bannerStrips.js): picture shape and
        // how many banners are visible at once on desktop
        "--strip-ratio-custom": strip.ratio,
        "--strip-visible-desktop": strip.visible,
      }}
    >
      <div className="banner-strip__container">
        <div
          ref={viewportRef}
          className={`banner-strip__viewport ${
            isDragging ? "banner-strip__viewport--dragging" : ""
          }`}
          {...handlers}
          onPointerDown={(event) => {
            pause();
            handlers.onPointerDown(event);
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") hoveringRef.current = true;
          }}
          onPointerLeave={() => {
            hoveringRef.current = false;
          }}
        >
          {strip.banners.map(({ id, alt, href = "#" }) => {
            const image = getBannerImage(strip.id, id);

            const picture = image && (
              <img src={image} alt={alt} loading="lazy" draggable={false} />
            );

            // "/stores/doris" opens inside the app, anything else is a normal link
            return href.startsWith("/") ? (
              <Link className="banner-strip__banner" to={href} key={id} draggable={false}>
                {picture}
              </Link>
            ) : (
              <a className="banner-strip__banner" href={href} key={id} draggable={false}>
                {picture}
              </a>
            );
          })}
        </div>

        {position.total > 1 && (
          <div className="banner-strip__dots" role="tablist" aria-label="انتخاب بنر">
            {Array.from({ length: position.total }, (_, index) => (
              <button
                type="button"
                key={index}
                role="tab"
                aria-label={`بنر ${index + 1}`}
                aria-selected={index === position.active}
                className={`banner-strip__dot ${
                  index === position.active ? "banner-strip__dot--active" : ""
                }`}
                onClick={() => {
                  pause();
                  scrollToIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BannerStrip;
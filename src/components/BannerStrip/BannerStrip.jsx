import { useCallback, useEffect, useRef, useState } from "react";

import { useDragScroll } from "../../hooks/useDragScroll";
import { resolveImage } from "../../utils/resolveImage";

import "./BannerStrip.css";

/* =========================================================
   Config
========================================================= */

const AUTOPLAY_DELAY = 4000;
const RESUME_DELAY = 4000;

/* =========================================================
   Pictures
   All images are stored directly inside banner-strips.
   Supported formats: webp, png, jpg, jpeg
========================================================= */

const STRIP_IMAGES = import.meta.glob(
  "../../assets/images/banner-strips/*.{webp,png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  }
);

const getBannerImage = (bannerId) => {
  const images = Object.fromEntries(
    Object.entries(STRIP_IMAGES).map(([path, image]) => {
      const fileName = path.split("/").pop();
      const fileId = fileName.replace(/\.(webp|png|jpe?g)$/i, "");

      return [fileId, image];
    })
  );

  return resolveImage(images, bannerId);
};

/* =========================================================
   Component
========================================================= */

function BannerStrip({ strip }) {
  const viewportRef = useRef(null);

  const { isDragging, handlers } = useDragScroll(viewportRef);

  const [position, setPosition] = useState({
    active: 0,
    total: 1,
  });

  const positionRef = useRef(position);
  const hoveringRef = useRef(false);
  const pausedUntilRef = useRef(0);

  /* =========================================================
     Scroll Helpers
  ========================================================= */

  const getStep = () => {
    const element = viewportRef.current;

    if (!element) return 1;

    const banners = element.children;

    if (banners.length > 1) {
      return Math.abs(
        banners[1].offsetLeft - banners[0].offsetLeft
      ) || banners[0].offsetWidth || 1;
    }

    return banners[0]?.offsetWidth || 1;
  };

  const scrollToIndex = (index) => {
    const element = viewportRef.current;

    if (!element) return;

    const max = element.scrollWidth - element.clientWidth;
    const step = getStep();

    element.scrollTo({
      left: -Math.min(index * step, max),
      behavior: "smooth",
    });
  };

  /* =========================================================
     Update Active Position
  ========================================================= */

  const update = useCallback(() => {
    const element = viewportRef.current;

    if (!element) return;

    const step = getStep();
    const max = Math.max(0, element.scrollWidth - element.clientWidth);

    const last = Math.max(0, Math.round(max / step));

    const active = Math.min(
      last,
      Math.round(Math.abs(element.scrollLeft) / step)
    );

    const next = {
      active,
      total: last + 1,
    };

    positionRef.current = next;

    setPosition((previous) =>
      previous.active === next.active &&
      previous.total === next.total
        ? previous
        : next
    );
  }, []);

  /* =========================================================
     Scroll Listener & Resize Observer
  ========================================================= */

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) return;

    update();

    element.addEventListener("scroll", update, {
      passive: true,
    });

    const observer = new ResizeObserver(update);

    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  /* =========================================================
     Autoplay
  ========================================================= */

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

      if (!isBusy) {
        scrollToIndex(active + 1 >= total ? 0 : active + 1);
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, []);

  /* =========================================================
     Pause Autoplay
  ========================================================= */

  const pause = () => {
    pausedUntilRef.current = Date.now() + RESUME_DELAY;
  };

  /* =========================================================
     Render
  ========================================================= */

  return (
    <section className="banner-strip" aria-label="بنرها">
      <div className="banner-strip__container">
        <div
          ref={viewportRef}
          className={`banner-strip__viewport ${
            isDragging ? "banner-strip__viewport--dragging" : ""
          }`}
          {...handlers}
          onPointerDown={(event) => {
            pause();
            handlers.onPointerDown?.(event);
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              hoveringRef.current = true;
            }
          }}
          onPointerLeave={() => {
            hoveringRef.current = false;
          }}
        >
          {strip.banners.map(({ id, alt, href = "#" }) => {
            const image = getBannerImage(id);

            return (
              <a
                className="banner-strip__banner"
                href={href}
                key={id}
                draggable={false}
              >
                {image ? (
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <span className="banner-strip__image-fallback">
                    تصویر بنر پیدا نشد
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {position.total > 1 && (
          <div
            className="banner-strip__dots"
            role="tablist"
            aria-label="انتخاب بنر"
          >
            {Array.from({ length: position.total }, (_, index) => (
              <button
                type="button"
                key={index}
                role="tab"
                aria-label={`بنر ${index + 1}`}
                aria-selected={index === position.active}
                className={`banner-strip__dot ${
                  index === position.active
                    ? "banner-strip__dot--active"
                    : ""
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
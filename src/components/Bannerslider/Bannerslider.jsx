import { useEffect, useRef, useState } from "react";

import "./BannerSlider.css";

/* =========================================================
   Config
========================================================= */

const AUTOPLAY_DELAY = 4000; // ms between slides
const SWIPE_THRESHOLD = 50; // px needed to change slide
const DRAG_START_DISTANCE = 6; // px before a press counts as a drag

/* =========================================================
   Helpers
========================================================= */

/**
 * Signed distance between a slide and the active one, going the
 * shortest way around the loop:  ... -2 -1 [0] 1 2 ...
 * In RTL, positive = on the LEFT of the active slide.
 */
const getOffset = (index, activeIndex, count) => {
  const offset = (((index - activeIndex) % count) + count) % count;
  return offset > Math.floor(count / 2) ? offset - count : offset;
};

/* =========================================================
   BannerSlider
   Center-mode slider: the active banner is in the middle and
   its neighbours peek from both sides. Endless loop, autoplay,
   drag / swipe and dots. Works with 3 or more banners.

   Props:
     banners   [{ id, image, alt, href }]
     label     accessible name of the carousel
========================================================= */

function BannerSlider({ banners, label = "بنرها" }) {
  const count = banners.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const previousIndexRef = useRef(0);
  const startXRef = useRef(null);
  const movedRef = useRef(false);

  const goTo = (index) => setActiveIndex(((index % count) + count) % count);

  /* Remember where we were, to tell which slides jump around the loop */
  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  /* Autoplay */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isPaused || isDragging || reduceMotion || count < 3) return undefined;

    const timer = setTimeout(
      () => setActiveIndex((index) => (index + 1) % count),
      AUTOPLAY_DELAY
    );

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, isDragging, count]);

  /* ----- Drag / swipe (mouse and touch) -----
     The page is RTL: dragging to the RIGHT brings the NEXT slide. */

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    startXRef.current = event.clientX;
    movedRef.current = false;
  };

  const onPointerMove = (event) => {
    if (startXRef.current === null) return;

    const delta = event.clientX - startXRef.current;

    if (!movedRef.current && Math.abs(delta) > DRAG_START_DISTANCE) {
      movedRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (movedRef.current) setDragX(delta);
  };

  const finishDrag = () => {
    if (startXRef.current === null) return;

    if (movedRef.current) {
      if (dragX > SWIPE_THRESHOLD) goTo(activeIndex + 1);
      else if (dragX < -SWIPE_THRESHOLD) goTo(activeIndex - 1);
    }

    startXRef.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  /* A drag must not open the banner link */
  const onClickCapture = (event) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      movedRef.current = false;
    }
  };

  return (
    <div
      className="banner-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`banner-slider__viewport ${
          isDragging ? "banner-slider__viewport--dragging" : ""
        }`}
        style={{ "--drag": `${dragX}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
      >
        {banners.map(({ id, image, alt, href = "#" }, index) => {
          const offset = getOffset(index, activeIndex, count);
          const previousOffset = getOffset(index, previousIndexRef.current, count);
          const isActive = offset === 0;

          /* A slide that wraps from one end of the loop to the other must
             not fly across the screen: move it without animation. */
          const jumps =
            Math.abs(offset - previousOffset) > 1 &&
            !(Math.abs(offset) <= 1 && Math.abs(previousOffset) <= 1);

          return (
            <a
              key={id}
              href={href}
              className={`banner-slider__slide ${
                isActive ? "banner-slider__slide--active" : ""
              } ${image ? "" : "banner-slider__slide--empty"}`}
              style={{
                "--offset": offset,
                transitionDuration: jumps ? "0s" : undefined,
              }}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              draggable={false}
            >
              {image && (
                <img
                  className="banner-slider__image"
                  src={image}
                  alt={alt}
                  draggable={false}
                />
              )}
            </a>
          );
        })}
      </div>

      <div className="banner-slider__dots" role="tablist" aria-label="انتخاب بنر">
        {banners.map(({ id }, index) => (
          <button
            type="button"
            key={id}
            role="tab"
            aria-label={`بنر ${index + 1}`}
            aria-selected={index === activeIndex}
            className={`banner-slider__dot ${
              index === activeIndex ? "banner-slider__dot--active" : ""
            }`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
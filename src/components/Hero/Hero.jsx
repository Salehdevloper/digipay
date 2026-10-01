import { useCallback, useEffect, useRef, useState } from "react";

import heroSlide1 from "../../assets/images/hero/slide-1.webp";
import heroSlide2 from "../../assets/images/hero/slide-2.webp";
import heroSlide3 from "../../assets/images/hero/slide-3.webp";
import heroSlide4 from "../../assets/images/hero/slide-4.webp";

import heroBanner1 from "../../assets/images/hero/banner/banner1.webp";
import heroBanner2 from "../../assets/images/hero/banner/banner2.webp";

import "./Hero.css";

/* =========================================================
   Config
========================================================= */

const AUTOPLAY_DELAY = 5000; // ms between slides
const SWIPE_THRESHOLD = 50; // px needed to change slide
const DRAG_START_DISTANCE = 6; // px before a press counts as a drag

/* =========================================================
   Data (images only)

   File naming (src/assets/images/hero/):
     slide-1.webp ... slide-4.webp   -> big slider, desktop artwork
     slide-1-mobile.webp (optional)  -> same slide, <= 1200px artwork
     side-1.webp, side-2.webp        -> fixed banners next to the slider

   `alt` should describe the banner, because the image is the
   only content of the link (empty alt = unreadable for screen readers).
   `mobileImage` is optional: when set, it is used at <= 1200px.
========================================================= */

const SLIDES = [
  { id: "slide-1", image: heroSlide1, alt: "بنر ۱", href: "#" },
  { id: "slide-2", image: heroSlide2, alt: "بنر ۲", href: "#" },
  { id: "slide-3", image: heroSlide3, alt: "بنر ۳", href: "#" },
  { id: "slide-4", image: heroSlide4, alt: "بنر ۴", href: "#" },
];

const SIDE_BANNERS = [
  { id: "side-1", image: heroBanner1, alt: "فردات رو بساز", href: "#" },
  { id: "side-2", image: heroBanner2, alt: "صندوق‌های طلا", href: "#" },
];

/* =========================================================
   Hook: carousel (autoplay + swipe, RTL aware)
========================================================= */

function useCarousel(count) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(null);
  const movedRef = useRef(false);

  const goTo = useCallback(
    (target) => setIndex(((target % count) + count) % count),
    [count]
  );

  /* Autoplay */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isPaused || isDragging || reduceMotion || count < 2) return undefined;

    const timer = setTimeout(() => goTo(index + 1), AUTOPLAY_DELAY);
    return () => clearTimeout(timer);
  }, [index, isPaused, isDragging, count, goTo]);

  /* Swipe: slides are laid out right-to-left, so dragging to the
     right reveals the NEXT slide and dragging left shows the previous. */
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
      if (dragX > SWIPE_THRESHOLD) goTo(index + 1);
      else if (dragX < -SWIPE_THRESHOLD) goTo(index - 1);
    }

    startXRef.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  /* Don't follow a link when the press was actually a swipe */
  const onClickCapture = (event) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      movedRef.current = false;
    }
  };

  return {
    index,
    dragX,
    isDragging,
    goTo,
    setIsPaused,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onClickCapture,
    },
  };
}

/* =========================================================
   Main slider
========================================================= */

function HeroSlider() {
  const { index, dragX, isDragging, goTo, setIsPaused, handlers } =
    useCarousel(SLIDES.length);

  return (
    <div
      className="hero__main"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="hero__slider"
        role="region"
        aria-roledescription="carousel"
        aria-label="بنرهای دیجی‌پی"
        {...handlers}
      >
        <div
          className={`hero__track ${isDragging ? "hero__track--dragging" : ""}`}
          style={{
            transform: `translateX(calc(${index * 100}% + ${dragX}px))`,
          }}
        >
          {SLIDES.map((slide, slideIndex) => (
            <a
              href={slide.href}
              key={slide.id}
              className="hero__slide"
              aria-hidden={slideIndex !== index}
              tabIndex={slideIndex === index ? 0 : -1}
              draggable={false}
            >
              <picture>
                {slide.mobileImage && (
                  <source
                    media="(max-width: 1200px)"
                    srcSet={slide.mobileImage}
                  />
                )}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  draggable={false}
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                />
              </picture>
            </a>
          ))}
        </div>
      </div>

      <div className="hero__dots" role="tablist" aria-label="انتخاب اسلاید">
        {SLIDES.map((slide, slideIndex) => (
          <button
            type="button"
            key={slide.id}
            role="tab"
            aria-label={`اسلاید ${slideIndex + 1}`}
            aria-selected={slideIndex === index}
            className={`hero__dot ${
              slideIndex === index ? "hero__dot--active" : ""
            }`}
            onClick={() => goTo(slideIndex)}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Fixed side banners (shown only above 1200px)
========================================================= */

function HeroSide() {
  return (
    <aside className="hero__side" aria-label="پیشنهادهای ویژه">
      {SIDE_BANNERS.map((banner) => (
        <a href={banner.href} className="hero__banner" key={banner.id}>
          <img src={banner.image} alt={banner.alt} draggable={false} />
        </a>
      ))}
    </aside>
  );
}

/* =========================================================
   Hero
========================================================= */

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <HeroSlider />
        <HeroSide />
      </div>
    </section>
  );
}

export default Hero;
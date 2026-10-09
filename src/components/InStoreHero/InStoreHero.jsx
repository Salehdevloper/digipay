import { FiChevronLeft } from "react-icons/fi";

import "./InStoreHero.css";

/* =========================================================
   Pin: white bubble with a shopping bag.
   Outer <g> = position/scale, inner <g> = floating animation
   (they are separate so the CSS animation does not override
   the position).
========================================================= */

function Pin({ x, y, scale = 1, delay = 0, blurred = false }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      filter={blurred ? "url(#in-store-blur)" : undefined}
    >
      <g
        className="in-store-hero__pin"
        style={{ animationDelay: `${delay}s` }}
      >
        <g filter="url(#in-store-shadow)">
          <circle r="30" fill="#fff" />
          <path d="M-9 28 L0 43 L9 28 Z" fill="#fff" />
        </g>

        {/* bag */}
        <path d="M-11 -5 H11 L9 14 H-9 Z" fill="url(#in-store-bag)" />
        <path
          d="M-5 -5 V-8 a5 5 0 0 1 10 0 V-5"
          fill="none"
          stroke="url(#in-store-bag)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/* =========================================================
   Map: drawn with SVG, no image needed.
   viewBox 1400x340. The left part (pins + map) stays visible
   on phones, the right part sits behind the text.
========================================================= */

function MapBackground() {
  return (
    <svg
      className="in-store-hero__map"
      viewBox="0 0 1400 340"
      preserveAspectRatio="xMinYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="in-store-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef3ff" />
          <stop offset="1" stopColor="#86a9ff" />
        </linearGradient>

        <linearGradient id="in-store-bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bba6ff" />
          <stop offset="1" stopColor="#6b46f2" />
        </linearGradient>

        <filter id="in-store-blur">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>

        <filter
          id="in-store-shadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="7"
            stdDeviation="7"
            floodColor="#17389a"
            floodOpacity="0.28"
          />
        </filter>
      </defs>

      {/* ground */}
      <rect width="1400" height="340" fill="url(#in-store-base)" />

      {/* city blocks */}
      <g fill="#fff" opacity="0.4">
        <rect x="20" y="150" width="120" height="70" rx="14" />
        <rect x="170" y="190" width="90" height="60" rx="12" />
        <rect x="430" y="170" width="130" height="64" rx="14" />
        <rect x="610" y="20" width="110" height="80" rx="14" />
        <rect x="660" y="230" width="140" height="60" rx="14" />
        <rect x="250" y="20" width="100" height="56" rx="12" />
      </g>

      {/* park */}
      <path
        d="M395 0 L610 0 L545 105 L440 150 L372 72 Z"
        fill="#7fae8a"
        opacity="0.6"
      />

      {/* streets */}
      <g
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        opacity="0.78"
      >
        <path d="M-20 135 L335 -20" strokeWidth="14" />
        <path d="M95 360 L560 -20" strokeWidth="12" />
        <path d="M285 360 L760 120" strokeWidth="10" />
        <path d="M-20 270 C200 238 390 250 710 190" strokeWidth="12" />
        <path d="M650 -20 L775 360" strokeWidth="10" />
      </g>

      {/* main road + roundabout */}
      <g fill="none" stroke="#2f66f0" strokeLinecap="round">
        <path d="M-20 330 C260 298 520 342 900 250" strokeWidth="30" />
        <circle cx="560" cy="372" r="86" strokeWidth="26" />
      </g>
      <path
        d="M-20 330 C260 298 520 342 900 250"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeDasharray="14 14"
        opacity="0.6"
      />

      {/* route from the nearest store to "you" */}
      <path
        className="in-store-hero__route"
        d="M312 100 C250 150 385 188 332 236"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />

      {/* "you are here" with radar ripples */}
      <g transform="translate(332 252)">
        <circle className="in-store-hero__ripple" r="16" fill="#3fa76b" />
        <circle
          className="in-store-hero__ripple in-store-hero__ripple--late"
          r="16"
          fill="#3fa76b"
        />
        <circle r="14" fill="#3fa76b" stroke="#fff" strokeWidth="5" />
      </g>

      {/* pins: near, far (blurred), small */}
      <Pin x={312} y={88} />
      <Pin x={150} y={176} scale={1.35} delay={0.8} blurred />
      <Pin x={565} y={72} scale={0.75} delay={1.4} />
    </svg>
  );
}

/* =========================================================
   InStoreHero
   Props:
     ctaHref     link of the button
     onCtaClick  optional click handler (e.g. ask for location)
========================================================= */

function InStoreHero({ ctaHref = "#nearby", onCtaClick }) {
  return (
    <section className="in-store-hero" aria-labelledby="in-store-hero-title">
      <MapBackground />

      {/* blue fade: keeps the text readable, map shows on the left */}
      <div className="in-store-hero__shade" aria-hidden="true" />

      <div className="in-store-hero__content">
        <p className="in-store-hero__lead">از فروشگاه نزدیکت</p>

        <h2 className="in-store-hero__title" id="in-store-hero-title">
          اقساطی بخر
        </h2>

        <a href={ctaHref} className="in-store-hero__cta" onClick={onCtaClick}>
          فروشگاه‌های اطراف
          <FiChevronLeft aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default InStoreHero;
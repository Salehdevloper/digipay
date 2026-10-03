import { FiChevronLeft } from "react-icons/fi";
import {
  RiBankCardFill,
  RiCalendarScheduleFill,
  RiLineChartFill,
  RiUmbrellaFill,
} from "react-icons/ri";

import loanCard from "../../assets/images/services/loan-card.webp";
import digicardCard from "../../assets/images/services/digicard-card.webp";
import investCard from "../../assets/images/services/invest-card.webp";
import insuranceCard from "../../assets/images/services/insurance-card.webp";

import "./Services.css";

/* =========================================================
   Data

   Images (src/assets/images/services/):
     <name>-card.webp  -> background of the desktop card

   The mobile tile uses a react-icons component (`icon` field),
   so no icon files are needed.

   Fields:
     title / description / cta   desktop card texts
     shortTitle                  mobile tile label
     from / to                   gradient colors (card overlay + tile)
========================================================= */

const SERVICES = [
  {
    id: "loan",
    title: "خدمات وام و اعتبار",
    shortTitle: "وام و اعتبار",
    description: "خرید قسطی، بدون ضامن و سپرده‌گذاری",
    cta: "دریافت اعتبار",
    href: "#",
    card: loanCard,
    icon: RiCalendarScheduleFill,
    from: "#c9aaff",
    to: "#8a3ff4",
  },
  {
    id: "digicard",
    title: "خدمات دیجی‌کارت",
    shortTitle: "دیجی‌کارت",
    description: "راهکار هوشمند خرید",
    cta: "دریافت دیجی‌کارت",
    href: "#",
    card: digicardCard,
    icon: RiBankCardFill,
    from: "#6f7288",
    to: "#1d2754",
  },
  {
    id: "invest",
    title: "خدمات مدیریت ثروت",
    shortTitle: "سرمایه‌گذاری",
    description: "حفظ ارزش سرمایه، کم ریسک و بی‌دغدغه",
    cta: "شروع سرمایه‌گذاری",
    href: "#",
    card: investCard,
    icon: RiLineChartFill,
    from: "#7ddba0",
    to: "#1d9a50",
  },
  {
    id: "insurance",
    title: "خدمات بیمه شخص ثالث",
    shortTitle: "بیمه شخص ثالث",
    description: "خرید اقساطی، بدون نیاز به چک و سفته",
    cta: "خرید بیمه",
    href: "#",
    card: insuranceCard,
    icon: RiUmbrellaFill,
    from: "#8ea3e9",
    to: "#16168a",
  },
];

/* =========================================================
   One service
   Same markup for both layouts; CSS decides what is visible:
   - desktop: image + title + description + cta (on hover)
   - mobile : icon tile + short label
========================================================= */

function ServiceItem({ service }) {
  const { title, shortTitle, description, cta, href, card, from, to } = service;
  const Icon = service.icon;

  return (
    <li
      className="services__item"
      style={{ "--service-from": from, "--service-to": to }}
    >
      <a href={href} className="services__link">
        {/* Desktop card */}
        <img
          className="services__image"
          src={card}
          alt=""
          loading="lazy"
          draggable={false}
        />

        <span className="services__body">
          <strong className="services__name">{title}</strong>
          <span className="services__description">{description}</span>
          <span className="services__cta">
            {cta}
            <FiChevronLeft aria-hidden="true" />
          </span>
        </span>

        {/* Mobile tile */}
        <span className="services__icon">
          <Icon aria-hidden="true" />
        </span>
        <span className="services__label">{shortTitle}</span>
      </a>
    </li>
  );
}

/* =========================================================
   Services section
========================================================= */

function Services() {
  return (
    <section className="services" aria-labelledby="services-title">
      <div className="services__container">
        <header className="services__header">
          <h2 className="services__title" id="services-title">
            خدمات دیجی‌پی
          </h2>

          <a href="#" className="services__all">
            همه
            <FiChevronLeft aria-hidden="true" />
          </a>
        </header>

        <ul className="services__list">
          {SERVICES.map((service) => (
            <ServiceItem service={service} key={service.id} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Services;
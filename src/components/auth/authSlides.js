/**
 * Slides of the login page header (the story-style progress bar).
 *   id    -> image file name:  src/assets/images/auth/<id>.webp|png|svg
 *   from/to -> background gradient of that slide
 * Slides are shown right-to-left, the first one is on the right.
 */

export const STORY_DURATION = 5000; // ms each slide stays

export const AUTH_SLIDES = [
  {
    id: "installment",
    title: "خرید قسطی، بدون ضامن",
    description:
      "از هزاران فروشگاه آنلاین و حضوری، همین الان بخر و اقساطی پرداخت کن.",
    from: "#8a73e6",
    to: "#5b43c4",
  },
  {
    id: "finance",
    title: "خدمات مالی، هوشمند",
    description:
      "از کارت به کارت، خرید شارژ و اینترنت، تا پرداخت قبض رو سریع و آسان انجام بده.",
    from: "#7886dd",
    to: "#5568c8",
  },
  {
    id: "insurance",
    title: "خدمات بیمه، اقساطی",
    description:
      "آنلاین مقایسه کن و از بین ده‌ها بیمه‌گذار، نقدی یا اقساطی بیمه بخر.",
    from: "#4a8de8",
    to: "#1b4fad",
  },
  {
    id: "invest",
    title: "سرمایه‌گذاری، بدون ریسک",
    description:
      "بدون ریسک در صندوق های درامد ثابت سرمایه گذاری و سود کن",
    from: "#43b683",
    to: "#1c8a57",
  },
  {
    id: "credit",
    title: "دیجی تین, استقلال مالی فرزند تو",
    description:
      "کارت اختصاصی, پول توجیبی و خرید انلاین برای فرزندت",
    from: "#43b683",
    to: "#1c8a57",
  },
];
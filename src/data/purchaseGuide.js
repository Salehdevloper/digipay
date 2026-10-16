/**
 * Text of the «راهنمای فروشگاه‌ها» window (opened by «راهنمای خرید»).
 *
 * Each item of GUIDE_ITEMS is one accordion row:
 *   id           also the image file name:
 *                assets/images/guide/<id>.webp|png|jpg   (optional picture)
 *   title        the row title
 *   description  short text shown when the row is open
 *   steps        the list in the «نحوه خرید و پرداخت» box
 *   stepsTitle   optional, default «نحوه خرید و پرداخت»
 *
 * Add a row = add an object. The first two rows below are written from the
 * design; the rows for in-store payment are samples: edit them.
 */

export const GUIDE_TITLE = "راهنمای فروشگاه‌ها";

export const GUIDE_INTRO =
  "با وام بانکی و یا اعتبار دیجی‌پی می‌توانید از فروشگاه‌های مختلف، کالا یا خدمات موردنظر خود را به صورت حضوری یا آنلاین خریداری کنید. نحوه خرید و پرداخت در فروشگاه‌ها در این بخش شرح داده شده است.";

export const GUIDE_STEPS_TITLE = "نحوه خرید و پرداخت";

export const GUIDE_ITEMS = [
  {
    id: "online",
    title: "خرید از فروشگاه‌های آنلاین",
    description:
      "در صورت خرید از فروشگاه‌های آنلاین، در مرحله پرداخت باید گزینه‌ی پرداخت اعتباری دیجی‌پی را انتخاب کنید.",
    steps: [
      "انتخاب فروشگاه از صفحه فروشگاه‌ها",
      "سفارش و تکمیل سبد خرید",
      "انتخاب گزینه پرداخت اعتباری دیجی‌پی",
    ],
  },
  {
    id: "card-reader",
    title: "خرید حضوری با کارتخوان دیجی‌پی",
    description:
      "در صورت خرید حضوری، هنگام پرداخت از فروشنده بخواهید پرداخت را با کارتخوان دیجی‌پی انجام دهد.",
    steps: [
      "مراجعه به فروشگاه و انتخاب کالا",
      "اعلام پرداخت با دیجی‌پی به فروشنده",
      "تایید مبلغ روی کارتخوان و وارد کردن رمز",
    ],
  },
  {
    id: "qr",
    title: "خرید حضوری با اسکن کیوآر کد",
    description:
      "اگر فروشگاه کیوآر کد دیجی‌پی دارد، می‌توانید بدون کارتخوان و با اسکن کد از داخل برنامه پرداخت کنید.",
    steps: [
      "ورود به برنامه دیجی‌پی و انتخاب اسکن",
      "اسکن کیوآر کد فروشگاه",
      "تایید مبلغ و پرداخت اعتباری",
    ],
  },
];
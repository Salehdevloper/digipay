/**
 * Poster sliders: tall cards with a big picture (علی بابا, فیلم‌نت, ...).
 * Put one on a page with  "posters:<id>"  in config/pageLayout.js.
 *
 * Section:
 *   id          also the pictures folder:
 *               assets/images/posters/<id>/<card id>.webp|png|jpg
 *   title       text above the row
 *   brandId     logo file:  assets/images/brands/<brandId>.svg|webp|png
 *   brandName   name shown on every card (and the letter while no logo)
 *   cards       the cards (below)
 *
 * Card:
 *   id            picture file name
 *   title         big text on the card
 *   subtitle      optional small line («اشتراک ۱ ماهه»). With a subtitle the
 *                 price line above the bar is replaced by it (+ the badge)
 *   price         full price (toman)
 *   installments  optional: «۴ قسط» + the amount of one installment
 *   discount      optional: red badge number (shown next to the subtitle)
 *   url           optional link (default "#")
 *
 * Samples: replace them with the real cards.
 */

export const POSTER_SECTIONS = [
  {
    id: "ali-baba",
    title: "محبوب‌ترین‌های علی بابا",
    brandId: "ali-baba",
    brandName: "علی بابا",
    cards: [
      { id: "flight-mashhad", title: "بلیط هواپیما تهران به مشهد", price: 7500000, installments: 4 },
      { id: "tour-mashhad", title: "تور مشهد", price: 4300000, installments: 4 },
      { id: "tour-kish", title: "تور کیش", price: 19980000, installments: 4 },
      { id: "cip-mehrabad", title: "تشریفات (CIP) فرودگاه مهرآباد", price: 7800000, installments: 4 },
      { id: "tour-istanbul", title: "تور استانبول", price: 61000000, installments: 4 },
      { id: "bus-isfahan", title: "بلیط اتوبوس تهران به اصفهان", price: 580000, installments: 4 },
    ],
  },
  {
    id: "filmnet",
    title: "فیلم و سریال",
    brandId: "filmnet",
    brandName: "فیلم‌نت",
    cards: [
      { id: "shah-gol", title: "شاه گل", subtitle: "اشتراک ۱ ماهه", price: 192000, installments: 4, discount: 20, },
      { id: "kori", title: "کوری", subtitle: "اشتراک ۳ ماهه", price: 498000, installments: 4, discount: 33 },
      { id: "confess", title: "اعتراف می‌کنم", subtitle: "اشتراک ۶ ماهه", price: 819000, installments: 4, discount: 33 },
      { id: "manshoor", title: "منشور", subtitle: "اشتراک ۱ ساله", price: 2280000, installments: 4, discount: 40 },
      { id: "bi-atefe", title: "سریال بی‌عاطفه", subtitle: "اشتراک ۶ ماهه", price: 1140000, installments: 4, discount: 35 },
    ],
  },
];

export const getPosterSectionById = (id) =>
  POSTER_SECTIONS.find((section) => section.id === id);
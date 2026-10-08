const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** ۰۹۱۲ / ٠٩١٢  ->  0912  (users type with any keyboard) */
export const normalizeDigits = (value = "") =>
  String(value)
    .replace(/[۰-۹]/g, (digit) => PERSIAN_DIGITS.indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => ARABIC_DIGITS.indexOf(digit));

/** 0912  ->  ۰۹۱۲  (for display only) */
export const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[digit]);

/** Keeps only English digits, max 11 characters. */
export const cleanPhoneInput = (value) =>
  normalizeDigits(value).replace(/\D/g, "").slice(0, 11);

/** Iranian mobile number: 09xxxxxxxxx */
export const isValidIranMobile = (phone) => /^09\d{9}$/.test(phone);

/** 125 seconds -> "2:05" */
export const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return toPersianDigits(`${minutes}:${rest}`);
};
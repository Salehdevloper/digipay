const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** 1234 -> ۱۲۳۴ */
export const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[digit]);

/** 1234567 -> ۱,۲۳۴,۵۶۷ */
export const formatPrice = (value) =>
  toPersianDigits(Number(value).toLocaleString("en-US"));

/** Discount percentage (0 when there is no old price). */
export const getDiscount = ({ price, oldPrice }) =>
  oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

/** Amount of one installment, rounded down to tens. */
export const getInstallmentPrice = ({ price, installments }) =>
  Math.floor(price / installments / 10) * 10;
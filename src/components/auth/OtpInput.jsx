import { useRef } from "react";

import { OTP_LENGTH } from "../../constants/auth";
import { normalizeDigits } from "../../utils/phone";

import "./AuthForm.css";

const onlyDigits = (value) => normalizeDigits(value).replace(/\D/g, "");

/**
 * One box per digit.
 * - typing moves to the next box
 * - Backspace clears and moves back
 * - paste / SMS autofill fills all the boxes
 * - arrow keys move between boxes
 * The value is always a string of consecutive digits ("123").
 *
 * Props: value, onChange(value), length, hasError, disabled, autoFocus
 */
function OtpInput({
  value,
  onChange,
  length = OTP_LENGTH,
  hasError = false,
  disabled = false,
  autoFocus = false,
}) {
  const inputsRef = useRef([]);

  const focusBox = (index) => {
    const box = inputsRef.current[Math.max(0, Math.min(length - 1, index))];
    box?.focus();
  };

  /* typed digit, pasted code or SMS autofill */
  const insertDigits = (index, raw) => {
    const digits = onlyDigits(raw);
    if (!digits) return;

    // no gaps: a digit typed in a far box lands in the first empty one
    const start = Math.min(index, value.length);
    const next = (value.slice(0, start) + digits + value.slice(start + digits.length)).slice(
      0,
      length
    );

    onChange(next);
    focusBox(start + digits.length);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusBox(index - 1);
      }
    }

    // the row is left-to-right, so Left = previous box
    if (event.key === "ArrowLeft") focusBox(index - 1);
    if (event.key === "ArrowRight") focusBox(index + 1);
  };

  return (
    <div
      className={`otp ${hasError ? "otp--error" : ""}`}
      role="group"
      aria-label="کد فعال‌سازی"
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          className="otp__box"
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          value={value[index] ?? ""}
          aria-label={`رقم ${index + 1} از ${length}`}
          aria-invalid={hasError}
          onChange={(event) => insertDigits(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => {
            event.preventDefault();
            insertDigits(index, event.clipboardData.getData("text"));
          }}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
}

export default OtpInput;
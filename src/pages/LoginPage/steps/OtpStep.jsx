import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

import OtpInput from "../../../components/auth/OtpInput";

import { OTP_LENGTH } from "../../../constants/auth";
import { formatCountdown, toPersianDigits } from "../../../utils/phone";

/**
 * Step 3: SMS code.
 * Props: phone, code, onCodeChange, onEditPhone, onSubmit,
 *        onResend, secondsLeft, isLoading, error
 */
function OtpStep({
  phone,
  code,
  onCodeChange,
  onEditPhone,
  onSubmit,
  onResend,
  secondsLeft,
  isLoading,
  error,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const canResend = secondsLeft <= 0 && !isLoading;

  return (
    <form className="login-step" onSubmit={handleSubmit} noValidate>
      <div className="login-step__phone">
        <span className="login-step__phone-number">
          {toPersianDigits(phone)}
        </span>

        <button
          type="button"
          className="login-step__edit"
          onClick={onEditPhone}
          aria-label="ویرایش شماره موبایل"
        >
          <FiEdit aria-hidden="true" />
        </button>
      </div>

      <p className="login-step__description">
        کد فعال‌سازی به شماره شما ارسال شد.
      </p>

      <OtpInput
        value={code}
        onChange={onCodeChange}
        hasError={Boolean(error)}
        disabled={isLoading}
        autoFocus
      />

      {/* always reserves its space, so the layout never jumps */}
      <p className="login-step__error" role="alert">
        {error}
      </p>

      <div className="auth-actions">
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={onResend}
          disabled={!canResend}
        >
          {secondsLeft > 0 ? formatCountdown(secondsLeft) : "ارسال مجدد کد"}
        </button>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={code.length !== OTP_LENGTH || isLoading}
        >
          {isLoading ? (
            <span className="auth-button__spinner" aria-label="در حال بررسی" />
          ) : (
            "تایید و ادامه"
          )}
        </button>
      </div>

      <div className="login-step__links login-step__links--center">
        <Link to="/terms" className="auth-link">
          شرایط استفاده از دیجی‌پی
        </Link>
      </div>
    </form>
  );
}

export default OtpStep;
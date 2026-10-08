import { Link } from "react-router-dom";

import AuthField from "../../../components/auth/AuthField";

import { isValidIranMobile, cleanPhoneInput } from "../../../utils/phone";

/**
 * Step 1: mobile number.
 * Props: phone, onPhoneChange, referralCode, onOpenReferral,
 *        onSubmit, isLoading, error
 */
function PhoneStep({
  phone,
  onPhoneChange,
  referralCode,
  onOpenReferral,
  onSubmit,
  isLoading,
  error,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="login-step" onSubmit={handleSubmit} noValidate>
      <h1 className="login-step__title">خوش آمدید!</h1>
      <p className="login-step__description">
        جهت ورود، لطفا شماره موبایل خود را وارد کنید.
      </p>

      <AuthField
        id="login-phone"
        label="شماره موبایل"
        value={phone}
        onChange={(value) => onPhoneChange(cleanPhoneInput(value))}
        error={error}
        inputProps={{
          type: "tel",
          inputMode: "numeric",
          autoComplete: "tel-national",
          dir: "ltr",
          autoFocus: true,
        }}
      />

      {referralCode && (
        <p className="login-step__note">
          کد معرف <span dir="ltr">{referralCode}</span> ثبت شد.
        </p>
      )}

      <button
        type="submit"
        className="auth-button auth-button--primary"
        disabled={!isValidIranMobile(phone) || isLoading}
      >
        {isLoading ? (
          <span className="auth-button__spinner" aria-label="در حال ارسال" />
        ) : (
          "قبول شرایط و ادامه"
        )}
      </button>

      <div className="login-step__links">
        <button type="button" className="auth-link" onClick={onOpenReferral}>
          {referralCode ? "ویرایش کد معرف" : "کد معرف دارید؟"}
        </button>

        <Link to="/terms" className="auth-link">
          شرایط استفاده از دیجی‌پی
        </Link>
      </div>
    </form>
  );
}

export default PhoneStep;
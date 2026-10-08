import { Link } from "react-router-dom";

import AuthField from "../../../components/auth/AuthField";

/**
 * Step 2 (optional): referral code.
 * Props: code, onCodeChange, onBack, onSubmit, isLoading, error
 */
function ReferralStep({ code, onCodeChange, onBack, onSubmit, isLoading, error }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="login-step" onSubmit={handleSubmit} noValidate>
      <h1 className="login-step__title">کد معرف</h1>
      <p className="login-step__description">کد معرف خود را وارد کنید</p>

      <AuthField
        id="login-referral"
        label="کد"
        value={code}
        onChange={(value) => onCodeChange(value.trim())}
        error={error}
        inputProps={{
          type: "text",
          autoComplete: "off",
          autoCapitalize: "characters",
          dir: "ltr",
          autoFocus: true,
        }}
      />

      <div className="auth-actions">
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={onBack}
        >
          بازگشت
        </button>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={!code || isLoading}
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

export default ReferralStep;
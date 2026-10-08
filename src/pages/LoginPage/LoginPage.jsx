import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthShell from "../../components/auth/AuthShell";

import {
  DEFAULT_RESEND_SECONDS,
  LOGIN_STEPS,
  OTP_LENGTH,
} from "../../constants/auth";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { getErrorMessage } from "../../services/apiClient";
import {
  requestOtp,
  validateReferralCode,
  verifyOtp,
} from "../../services/authApi";
import { isValidIranMobile } from "../../utils/phone";

import OtpStep from "./steps/OtpStep";
import PhoneStep from "./steps/PhoneStep";
import ReferralStep from "./steps/ReferralStep";

import "./LoginPage.css";

/* =========================================================
   Login page   (/login)

   phone  ->  [referral code]  ->  SMS code  ->  back to the page
   the user wanted (or "/").

   All server work is in services/authApi.js. This file only
   decides which step is shown and what happens on each action.
========================================================= */

function LoginPage() {
  usePageTitle("خدمات مالی و پرداخت"); // "خدمات مالی و پرداخت | دیجی‌پی"

  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /* Where to go after login: the protected page that sent us here */
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ""}` : "/";

  const [step, setStep] = useState(LOGIN_STEPS.PHONE);
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralDraft, setReferralDraft] = useState("");
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* Resend countdown (only while the SMS step is open) */
  useEffect(() => {
    if (step !== LOGIN_STEPS.OTP || secondsLeft <= 0) return undefined;

    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  /* Already logged in: nothing to do here */
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const goToStep = (nextStep) => {
    setError("");
    setStep(nextStep);
  };

  /* ----- Step 1: send the SMS ----- */
  const sendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { resendAfter } = await requestOtp({ phone, referralCode });

      setOtp("");
      setSecondsLeft(resendAfter ?? DEFAULT_RESEND_SECONDS);
      setStep(LOGIN_STEPS.OTP);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = () => {
    if (!isValidIranMobile(phone)) {
      setError("شماره موبایل معتبر نیست. مثال: 09121234567");
      return;
    }

    sendCode();
  };

  /* ----- Step 2: referral code ----- */
  const openReferral = () => {
    setReferralDraft(referralCode);
    goToStep(LOGIN_STEPS.REFERRAL);
  };

  const handleReferralSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      await validateReferralCode(referralDraft);

      setReferralCode(referralDraft);
      setStep(LOGIN_STEPS.PHONE);
    } catch (referralError) {
      setError(getErrorMessage(referralError));
    } finally {
      setIsLoading(false);
    }
  };

  /* ----- Step 3: check the SMS code ----- */
  const handleOtpSubmit = async () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setError("");

    try {
      const { token, user } = await verifyOtp({ phone, code: otp });

      login({ token, user });
      navigate(redirectTo, { replace: true });
    } catch (verifyError) {
      setError(getErrorMessage(verifyError));
      setOtp("");
      setIsLoading(false);
    }
  };

  /* ----- Render the active step ----- */
  return (
    <AuthShell>
      {/* key = step: each step fades in */}
      <div className="login-page__step" key={step}>
        {step === LOGIN_STEPS.PHONE && (
          <PhoneStep
            phone={phone}
            onPhoneChange={(value) => {
              setPhone(value);
              setError("");
            }}
            referralCode={referralCode}
            onOpenReferral={openReferral}
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}

        {step === LOGIN_STEPS.REFERRAL && (
          <ReferralStep
            code={referralDraft}
            onCodeChange={(value) => {
              setReferralDraft(value);
              setError("");
            }}
            onBack={() => goToStep(LOGIN_STEPS.PHONE)}
            onSubmit={handleReferralSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}

        {step === LOGIN_STEPS.OTP && (
          <OtpStep
            phone={phone}
            code={otp}
            onCodeChange={(value) => {
              setOtp(value);
              setError("");
            }}
            onEditPhone={() => goToStep(LOGIN_STEPS.PHONE)}
            onSubmit={handleOtpSubmit}
            onResend={sendCode}
            secondsLeft={secondsLeft}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </AuthShell>
  );
}

export default LoginPage;
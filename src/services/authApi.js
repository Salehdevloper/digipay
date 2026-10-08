import { ApiError, apiRequest } from "./apiClient";

/* =========================================================
   Auth API  (the only file you change to connect the backend)

   VITE_USE_MOCK_AUTH=true  -> fake answers (works without a server)
   VITE_USE_MOCK_AUTH=false -> real requests, contract below.

   ---------------------------------------------------------
   POST /auth/otp/request
     body:     { phone: "09121234567", referralCode?: "ABCD" }
     200:      { resendAfter: 120 }          // seconds until "resend"
     errors:   400 INVALID_PHONE | 429 TOO_MANY_REQUESTS

   POST /auth/otp/verify
     body:     { phone: "09121234567", code: "123456" }
     200:      { token: "<jwt>", user: { id, phone } }
     errors:   400 INVALID_OTP | 410 OTP_EXPIRED | 429 TOO_MANY_ATTEMPTS

   POST /auth/referral/validate
     body:     { code: "ABCD" }
     200:      { valid: true }
     errors:   400 INVALID_REFERRAL

   Every error body:  { code: "INVALID_OTP", message: "کد وارد شده صحیح نیست." }
   The `message` is shown to the user as it is (write it in Persian).
========================================================= */

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH !== "false";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function requestOtp({ phone, referralCode }) {
  if (USE_MOCK) {
    await wait(700);
    return { resendAfter: 120 };
  }

  return apiRequest("/auth/otp/request", {
    method: "POST",
    body: { phone, referralCode: referralCode || undefined },
  });
}

export async function verifyOtp({ phone, code }) {
  if (USE_MOCK) {
    await wait(700);

    if (code === "000000") {
      throw new ApiError("کد وارد شده صحیح نیست.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    return {
      token: `mock-token-${Date.now()}`,
      user: { id: "mock-user", phone },
    };
  }

  return apiRequest("/auth/otp/verify", {
    method: "POST",
    body: { phone, code },
  });
}

export async function validateReferralCode(code) {
  if (USE_MOCK) {
    await wait(500);

    if (code === "0000") {
      throw new ApiError("کد معرف معتبر نیست.", {
        status: 400,
        code: "INVALID_REFERRAL",
      });
    }

    return { valid: true };
  }

  return apiRequest("/auth/referral/validate", {
    method: "POST",
    body: { code },
  });
}
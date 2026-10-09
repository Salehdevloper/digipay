import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { toPersianDigits } from "../../utils/phone";

import "./PaymentPage.css";

/**
 * Payment (/payment): only reachable after login (see ProtectedRoute).
 * This is a starting point: the real payment steps come next.
 */
function PaymentPage() {
  usePageTitle("پرداخت");

  const { user } = useAuth();

  return (
    <section className="payment-page">
      <div className="payment-page__container">
        <h1 className="payment-page__title">پرداخت</h1>

        <p className="payment-page__text">
          شما با شماره{" "}
          <span dir="ltr">{toPersianDigits(user?.phone ?? "")}</span> وارد شده‌اید.
          مراحل پرداخت اینجا اضافه می‌شود.
        </p>
      </div>
    </section>
  );
}

export default PaymentPage;
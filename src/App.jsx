import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import PageLoader from "./components/PageLoader/PageLoader";
import AuthProvider from "./context/AuthProvider";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import "./styles/responsive.css";

/* Every page is loaded only when it is opened.
   While it loads, <PageLoader /> (the blue spinner) is shown. */
const HomePage = lazy(() => import("./pages/Homepage/Homepage"));
const StoresPage = lazy(() => import("./pages/Storespage/Storespage"));
const StoreDetailPage = lazy(() => import("./pages/StoreDetailPage/StoreDetailPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage/Paymentpage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const TermsPage = lazy(() => import("./pages/TermsPage/Termspage"));

/** Every page change starts from the top of the page. */
function ScrollToTop() {
  const { pathname } = useLocation(); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Pages with the site header */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/stores/:storeId" element={<StoreDetailPage />} />

              {/* Needs a login: guests are sent to /login first */}
              <Route element={<ProtectedRoute />}>
                <Route path="/payment" element={<PaymentPage />} />
              </Route>
            </Route>

            {/* Stand-alone pages (no header) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/terms" element={<TermsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
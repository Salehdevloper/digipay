import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**
 * Wrap pages that need a login:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/payment" element={<PaymentPage />} />
 *   </Route>
 *
 * A guest is sent to /login and, after logging in, comes back to the
 * page he wanted (the login page reads `location.state.from`).
 */
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
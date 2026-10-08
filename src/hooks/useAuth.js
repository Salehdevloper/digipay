import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

/** const { user, token, isAuthenticated, login, logout } = useAuth(); */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
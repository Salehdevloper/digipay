import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "digipay.session";

const readSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Keeps the login session { token, user } for the whole app.
 *
 * Stored in localStorage so a refresh keeps you logged in.
 * (Safer option for production: let the backend set an httpOnly cookie
 *  and keep only `user` here.)
 */
function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((nextSession) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } catch {
      /* private mode: the session still works until the tab closes */
    }
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
  }, []);

  /* Logging in / out in one tab updates the other tabs too */
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setSession(readSession());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
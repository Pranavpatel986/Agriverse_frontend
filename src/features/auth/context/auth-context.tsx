"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_LOGOUT_EVENT } from "@/shared/lib/api/client";
import { clearAccessToken, setAccessToken } from "@/shared/lib/auth/token-storage";
import { authService } from "../api/auth.service";
import type { AuthUser } from "../api/auth.types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  /** Called by useLogin/useRegister-adjacent mutations once the API call
   *  itself has succeeded — this only updates local session state. */
  setSession: (user: AuthUser, accessToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Module-level, not component state: React Strict Mode double-invokes
// effects in development, so AuthProvider's mount effect fires
// bootstrapSession() twice. Without this guard, two concurrent
// refresh+getCurrentUser sequences race on the shared in-memory access
// token and double the load on every page load for no benefit — this
// was not the cause of the LazyInitializationException bug (see
// CustomUserDetailsService), but it's still worth not doing twice.
let bootstrapPromise: Promise<void> | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const bootstrapSession = useCallback(async () => {
    if (!bootstrapPromise) {
      bootstrapPromise = (async () => {
        try {
          // Relies solely on the httpOnly refresh cookie — if it's missing or
          // expired this rejects and we fall through to "unauthenticated",
          // which is the correct state for a first-time/never-logged-in visitor.
          const { accessToken } = await authService.refreshToken();
          setAccessToken(accessToken);
          const me = await authService.getCurrentUser();
          setUser(me);
          setStatus("authenticated");
        } catch {
          clearAccessToken();
          setUser(null);
          setStatus("unauthenticated");
        } finally {
          bootstrapPromise = null;
        }
      })();
    }
    return bootstrapPromise;
  }, []);

  useEffect(() => {
    // Intentional one-time async bootstrap on mount (attempt silent
    // refresh via the httpOnly cookie), not state derived from
    // props/other state — the pattern this lint rule targets.
    bootstrapSession();
  }, [bootstrapSession]);

  // The Axios client dispatches this when a 401's refresh attempt fails,
  // so a session that dies mid-use (revoked/expired refresh token) is
  // reflected in the UI immediately, wherever the user currently is.
  useEffect(() => {
    function handleForcedLogout() {
      setUser(null);
      setStatus("unauthenticated");
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, []);

  const setSession = useCallback((nextUser: AuthUser, accessToken: string) => {
    setAccessToken(accessToken);
    setUser(nextUser);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    try {
      // Resolved: goes through our /api/auth/logout BFF route, which
      // reads the refresh token from its own httpOnly cookie server-side
      // — the client never needs to supply it. Best-effort: local
      // session clears in `finally` regardless of the backend result.
      await authService.logout();
    } catch {
      // Best-effort revoke; local state still clears below.
    } finally {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, setSession, logout }),
    [user, status, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be called within an <AuthProvider>.");
  }
  return ctx;
}

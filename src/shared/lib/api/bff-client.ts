import axios from "axios";

/**
 * Separate from `apiClient` (shared/lib/api/client.ts), which points at
 * the external Spring backend. This instance's baseURL is relative —
 * always same-origin as the page — used only for the four auth flows
 * that need to touch the httpOnly refresh-token cookie our own Route
 * Handlers manage: login, refresh, logout, social-login. Everything
 * else (register, forgot/reset-password, verify-email, getCurrentUser)
 * has no refresh-token involvement and still calls the backend directly
 * via `apiClient`.
 */
export const bffClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

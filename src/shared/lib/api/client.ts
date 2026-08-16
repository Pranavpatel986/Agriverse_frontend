import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { endpoints } from "./endpoints";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/shared/lib/auth/token-storage";

/**
 * The single Axios instance every feature service uses. Auth attachment,
 * refresh-on-401, and logout-on-refresh-failure are handled once, here —
 * feature code never touches tokens or retry logic directly.
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh goes through our OWN BFF route (/api/auth/refresh — see
// shared/lib/auth/refresh-cookie.ts for why), not the backend directly:
// the real backend has no httpOnly cookie of its own for the refresh
// token, so our Next.js server holds it instead. Relative baseURL keeps
// this same-origin regardless of what NEXT_PUBLIC_API_BASE_URL points
// to. A separate instance avoids recursing into apiClient's own
// response interceptor below.
const refreshClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

/** Dispatched when a refresh attempt fails — AuthProvider listens for
 *  this to clear user state and redirect to login, keeping this module
 *  free of any React/router dependency. */
export const AUTH_LOGOUT_EVENT = "agriverse:auth-logout";

function broadcastForcedLogout() {
  clearAccessToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  }
}

// Request interceptor — attach the current access token, if any.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// --- Refresh queueing -------------------------------------------------
// If several requests 401 concurrently, we refresh exactly once and let
// every queued request wait on that single in-flight promise, rather
// than firing N parallel refresh calls.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>("/refresh")
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// register is the one apiClient-routed auth endpoint that could
// plausibly 401 (defensive, unlikely in practice) — login/refresh/
// logout/social-login don't go through apiClient at all anymore (see
// auth.service.ts), so they don't need to appear here.
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH: string[] = [endpoints.auth.register];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isExemptEndpoint = AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.some((path) =>
      requestUrl.includes(path),
    );

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isExemptEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        broadcastForcedLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

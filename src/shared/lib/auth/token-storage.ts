import { decodeJwtPayload } from "./jwt";
import type { Role } from "@/shared/types/api";

/**
 * Access-token storage strategy
 * ─────────────────────────────
 * - The access token itself lives ONLY in memory (a module-level
 *   variable), never in localStorage/sessionStorage — this is the
 *   standard mitigation against token theft via XSS, since an in-memory
 *   value can't be read by an injected script the way storage APIs can.
 * - The refresh token is a backend-issued httpOnly cookie (per the REST
 *   API Specification) that client JS never sees or handles directly;
 *   Axios sends it automatically via `withCredentials: true`.
 * - Losing the in-memory token on a hard reload is expected and handled:
 *   AuthProvider calls POST /auth/refresh-token on boot, which succeeds
 *   as long as the httpOnly refresh cookie is still valid, and
 *   repopulates memory.
 * - We additionally mirror ONLY the role + expiry (never the raw token)
 *   into a small, non-httpOnly cookie so Next.js Middleware can perform a
 *   fast, best-effort redirect for obviously-logged-out users without a
 *   network round trip. This is a UX convenience, not a security
 *   boundary — see jwt.ts's doc comment. If this cookie is stale/missing
 *   but the httpOnly refresh cookie is still valid, the client-side
 *   AuthProvider recovers the session; the middleware gate never
 *   overrides what the backend actually authorizes.
 */

const SESSION_HINT_COOKIE = "av_session_hint";

let accessTokenMemory: string | null = null;

export function setAccessToken(token: string | null): void {
  accessTokenMemory = token;
  mirrorSessionHintCookie(token);
}

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

function mirrorSessionHintCookie(token: string | null): void {
  if (typeof document === "undefined") return; // SSR/server context — no-op

  if (!token) {
    document.cookie = `${SESSION_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  const claims = decodeJwtPayload<{ role?: Role; exp?: number }>(token);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const maxAge = claims?.exp ? Math.max(claims.exp - nowSeconds, 0) : 0;
  const hint = encodeURIComponent(
    JSON.stringify({ role: claims?.role ?? null, exp: claims?.exp ?? null }),
  );

  document.cookie = `${SESSION_HINT_COOKIE}=${hint}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export interface SessionHint {
  role: Role | null;
  exp: number | null;
}

/** Read the mirror cookie server-side (Middleware) or client-side. */
export function parseSessionHint(rawCookieValue: string | undefined): SessionHint | null {
  if (!rawCookieValue) return null;
  try {
    return JSON.parse(decodeURIComponent(rawCookieValue)) as SessionHint;
  } catch {
    return null;
  }
}

export const SESSION_HINT_COOKIE_NAME = SESSION_HINT_COOKIE;

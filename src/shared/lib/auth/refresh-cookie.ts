import type { NextRequest } from "next/server";

/** Minimal shape both `cookies().set(...)` (Server Actions/Route
 *  Handlers) and `NextResponse.cookies.set(...)` accept — deliberately
 *  not importing Next's internal cookie type path, which isn't a
 *  stable public export. */
interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

/**
 * The refresh token cookie is set and read ONLY by our own Next.js
 * Route Handlers (app/api/auth/*) — never sent directly to the browser,
 * never read by browser JS. This is a different mechanism from
 * `av_session_hint` in shared/lib/auth/token-storage.ts, which IS
 * readable by client JS and exists purely so proxy.ts can do a fast
 * edge redirect; that hint carries no secret and is not used for
 * authorization by the real backend.
 *
 * Why this file exists at all: the actual backend (confirmed against
 * its OpenAPI schema) returns `refreshToken` as plain JSON and requires
 * it back in the request body for /auth/refresh-token and /auth/logout
 * — it does not set its own httpOnly cookie. These Route Handlers are
 * the BFF layer that fills that gap so the browser never has to hold
 * the raw refresh token in any JS-readable form.
 */
export const REFRESH_COOKIE_NAME = "av_refresh_token";

// The OpenAPI schema doesn't expose the actual refresh-token TTL, so
// this is a placeholder — confirm the real lifetime with the backend
// team and adjust. Worst case with too-long a value: the cookie outlives
// a token the backend has already invalidated, and refresh simply 401s
// (handled gracefully — see refresh/route.ts).
const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days, placeholder

export function refreshCookieOptions(request: NextRequest): CookieOptions {
  return {
    httpOnly: true,
    // Derived from the actual connection, not NODE_ENV: a `next build &&
    // next start` run over plain http://localhost (a common way to
    // smoke-test a "production" build locally) previously got secure:true
    // here, and browsers silently refuse to store a Secure cookie over a
    // non-HTTPS connection — the refresh cookie never persisted, so a page
    // refresh (or an access-token expiry mid-session) always logged the
    // user out. x-forwarded-proto is checked first because in real
    // production this app usually sits behind a TLS-terminating proxy/load
    // balancer, where Next itself sees a plain http:// request even though
    // the browser is on https://.
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
  };
}

function isSecureRequest(request: NextRequest): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }
  return request.nextUrl.protocol === "https:";
}

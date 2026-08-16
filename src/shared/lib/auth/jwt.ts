/**
 * Reads the claims out of a JWT without verifying its signature. This is
 * intentional and safe for our two use cases:
 *  1. Client-side UX (e.g. "your session is about to expire") — never a
 *     security decision.
 *  2. Populating a lightweight, non-httpOnly mirror cookie so Next.js
 *     Middleware can perform a fast, best-effort route gate at the edge.
 *
 * The actual trust boundary is always the backend: every protected API
 * call is re-validated (and re-authorized via @PreAuthorize) server-side
 * regardless of what this function returns. Never gate a security
 * decision purely on the client based on these claims.
 */
export interface JwtClaims {
  sub?: string;
  role?: string;
  exp?: number; // seconds since epoch
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwtPayload<T extends JwtClaims = JwtClaims>(
  token: string,
): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof window === "undefined"
        ? Buffer.from(padded, "base64").toString("utf-8")
        : decodeURIComponent(
            atob(padded)
              .split("")
              .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
              .join(""),
          );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, skewSeconds = 5): boolean {
  const claims = decodeJwtPayload(token);
  if (!claims?.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return claims.exp - skewSeconds <= nowSeconds;
}

import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES, ROUTES } from "@/config/routes";
import {
  parseSessionHint,
  SESSION_HINT_COOKIE_NAME,
} from "@/shared/lib/auth/token-storage";

const ROLE_RANK: Record<string, number> = {
  READER: 0,
  AUTHOR: 1,
  EDITOR: 2,
  ADMIN: 3,
};

/**
 * Edge-level gate for protected routes (Dashboard, Bookmarks, Admin per
 * PROTECTED_ROUTES), using Next.js 16's `proxy.ts` convention (the
 * renamed replacement for `middleware.ts` — a leftover `middleware.ts`
 * is silently ignored in Next 16, so this file is load-bearing for
 * route protection). This is intentionally a FAST, BEST-EFFORT check
 * only:
 *  - It reads a small, non-httpOnly "session hint" cookie (role + exp)
 *    that the client mirrors on login/refresh — see token-storage.ts for
 *    why this exists instead of reading the real access token.
 *  - It can produce false negatives: a user whose hint cookie is stale
 *    but whose httpOnly refresh cookie is still valid will be redirected
 *    to /login here, then silently recovered client-side by AuthProvider
 *    if they retry — an acceptable UX cost for avoiding an edge network
 *    call on every navigation.
 *  - It must never be treated as the authorization boundary. Every
 *    protected API call is independently authorized server-side
 *    (@PreAuthorize per the Software Architecture Document, Section 10),
 *    which is the actual security guarantee.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRoute = PROTECTED_ROUTES.find((route) =>
    pathname.startsWith(route.prefix),
  );
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const hint = parseSessionHint(request.cookies.get(SESSION_HINT_COOKIE_NAME)?.value);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const isSessionHintValid = !!hint?.exp && hint.exp > nowSeconds;

  if (!isSessionHintValid) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matchedRoute.minimumRole) {
    const userRank = hint?.role ? ROLE_RANK[hint.role] : -1;
    const requiredRank = ROLE_RANK[matchedRoute.minimumRole];
    if (userRank < requiredRank) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/bookmarks/:path*", "/admin/:path*"],
};

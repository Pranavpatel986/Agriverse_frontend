import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";
import { endpoints } from "@/shared/lib/api/endpoints";
import { REFRESH_COOKIE_NAME } from "@/shared/lib/auth/refresh-cookie";

/**
 * The browser calls this with no body — the refresh token never travels
 * over the wire to/from the browser at all, only between this route and
 * the real backend. Per the actual RefreshTokenResponse schema, the
 * backend does NOT rotate/return a new refresh token here, so the
 * existing cookie is left untouched; only a new accessToken comes back.
 */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh session" }, { status: 401 });
  }

  const backendResponse = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}${endpoints.auth.refreshToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    },
  );

  const data = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    // Dead/expired refresh token — clear it so we don't keep retrying
    // with a value the backend has already rejected.
    const response = NextResponse.json(data ?? { error: "Refresh failed" }, {
      status: backendResponse.status,
    });
    response.cookies.delete(REFRESH_COOKIE_NAME);
    return response;
  }

  return NextResponse.json(data); // { accessToken, expiresIn }
}

import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";
import { endpoints } from "@/shared/lib/api/endpoints";
import {
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} from "@/shared/lib/auth/refresh-cookie";

/**
 * Proxies POST /auth/login on the real backend. The browser calls THIS
 * route, never the backend directly, for login — so we're the only
 * party that ever sees the raw `refreshToken` value; we strip it out of
 * what we send back and store it in an httpOnly cookie instead.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}${endpoints.auth.login}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(data ?? { error: "Login failed" }, {
      status: backendResponse.status,
    });
  }

  const { accessToken, expiresIn, user, refreshToken } = data;
  const response = NextResponse.json({ accessToken, expiresIn, user });
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(request));
  return response;
}

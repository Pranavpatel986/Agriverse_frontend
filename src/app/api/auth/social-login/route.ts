import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";
import { endpoints } from "@/shared/lib/api/endpoints";
import {
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} from "@/shared/lib/auth/refresh-cookie";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}${endpoints.auth.socialLogin}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(data ?? { error: "Social login failed" }, {
      status: backendResponse.status,
    });
  }

  const { accessToken, isNewUser, refreshToken } = data;
  const response = NextResponse.json({ accessToken, isNewUser });
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(request));
  return response;
}

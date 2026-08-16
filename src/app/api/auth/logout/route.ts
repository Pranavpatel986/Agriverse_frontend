import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";
import { endpoints } from "@/shared/lib/api/endpoints";
import { REFRESH_COOKIE_NAME } from "@/shared/lib/auth/refresh-cookie";

/**
 * Also takes no body from the browser — same reasoning as refresh.
 * The local cookie is cleared unconditionally, even if the backend call
 * fails, so a user is never stuck "logged out in the UI but still
 * holding a live refresh cookie."
 */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete(REFRESH_COOKIE_NAME);

  if (refreshToken) {
    try {
      await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${endpoints.auth.logout}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Best-effort backend revoke — local cookie is already cleared above.
    }
  }

  return response;
}

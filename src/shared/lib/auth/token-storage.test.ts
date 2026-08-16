import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAccessToken,
  getAccessToken,
  parseSessionHint,
  setAccessToken,
} from "./token-storage";

function fakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

function clearAllCookies() {
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`;
  });
}

describe("token-storage", () => {
  beforeEach(() => {
    clearAccessToken();
    clearAllCookies();
  });

  it("round-trips the access token through memory", () => {
    setAccessToken("abc123");
    expect(getAccessToken()).toBe("abc123");
  });

  it("clearAccessToken resets it to null", () => {
    setAccessToken("abc123");
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("mirrors role + exp (never the raw token) into the session-hint cookie", () => {
    const token = fakeJwt({ role: "AUTHOR", exp: 9999999999 });
    setAccessToken(token);

    expect(document.cookie).toContain("av_session_hint=");
    expect(document.cookie).not.toContain(token);

    const rawValue = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("av_session_hint="))
      ?.split("=")[1];

    expect(parseSessionHint(rawValue)).toEqual({ role: "AUTHOR", exp: 9999999999 });
  });

  it("clears the session-hint cookie when the token is cleared", () => {
    setAccessToken(fakeJwt({ role: "READER", exp: 9999999999 }));
    clearAccessToken();
    expect(document.cookie).not.toContain("av_session_hint=");
  });
});

describe("parseSessionHint", () => {
  it("returns null for undefined input", () => {
    expect(parseSessionHint(undefined)).toBeNull();
  });

  it("returns null for unparseable input instead of throwing", () => {
    expect(parseSessionHint("%not-json%")).toBeNull();
  });
});

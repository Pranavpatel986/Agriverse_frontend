import { describe, expect, it } from "vitest";
import { decodeJwtPayload, isJwtExpired } from "./jwt";

/** Builds an unsigned-but-structurally-valid JWT for testing the
 *  decoder — the signature is never checked by this module (see its
 *  doc comment for why that's intentional), so a fake signature segment
 *  is fine here. */
function fakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

describe("decodeJwtPayload", () => {
  it("decodes a well-formed payload", () => {
    const token = fakeJwt({ sub: "user-1", role: "AUTHOR", exp: 9999999999 });
    expect(decodeJwtPayload(token)).toEqual({
      sub: "user-1",
      role: "AUTHOR",
      exp: 9999999999,
    });
  });

  it("returns null for a malformed token instead of throwing", () => {
    expect(decodeJwtPayload("not-a-jwt")).toBeNull();
    expect(decodeJwtPayload("")).toBeNull();
    expect(decodeJwtPayload("only.two")).toBeNull();
  });

  it("returns null for a payload segment that isn't valid JSON", () => {
    const token = `${btoa("{}")}.${btoa("not-json")}.sig`;
    expect(decodeJwtPayload(token)).toBeNull();
  });
});

describe("isJwtExpired", () => {
  it("is true for a token with no exp claim at all", () => {
    expect(isJwtExpired(fakeJwt({ sub: "user-1" }))).toBe(true);
  });

  it("is true for a token whose exp is in the past", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(isJwtExpired(fakeJwt({ exp: nowSeconds - 60 }))).toBe(true);
  });

  it("is false for a token comfortably in the future", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(isJwtExpired(fakeJwt({ exp: nowSeconds + 3600 }))).toBe(false);
  });

  it("treats a token expiring within the skew window as expired", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(isJwtExpired(fakeJwt({ exp: nowSeconds + 2 }), 5)).toBe(true);
  });
});

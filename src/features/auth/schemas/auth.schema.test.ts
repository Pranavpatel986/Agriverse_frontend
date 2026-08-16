import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, resetPasswordSchema } from "./auth.schema";

describe("registerSchema", () => {
  const base = {
    fullName: "Priya Sharma",
    email: "priya@example.com",
    password: "password1",
    confirmPassword: "password1",
  };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a password without a number (mirrors the backend's regex)", () => {
    const result = registerSchema.safeParse({
      ...base,
      password: "onlyletters",
      confirmPassword: "onlyletters",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without a letter", () => {
    const result = registerSchema.safeParse({
      ...base,
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    const result = registerSchema.safeParse({
      ...base,
      password: "pw1",
      confirmPassword: "pw1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched confirmPassword, attributed to that field", () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: "different1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a full name under 2 characters", () => {
    const result = registerSchema.safeParse({ ...base, fullName: "A" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password but doesn't validate its strength", () => {
    // Login must accept whatever the user's actual (possibly old-format)
    // password is — only registration/reset enforce the strength rule.
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "newpass1",
      confirmPassword: "different1",
    });
    expect(result.success).toBe(false);
  });
});

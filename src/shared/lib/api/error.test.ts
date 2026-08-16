import { describe, expect, it } from "vitest";
import { AxiosError } from "axios";
import { AppError, toAppError } from "./error";

function makeAxiosError(overrides: Partial<AxiosError> = {}): AxiosError {
  const error = new AxiosError("Request failed");
  return Object.assign(error, overrides);
}

describe("toAppError", () => {
  it("passes an existing AppError through unchanged", () => {
    const original = new AppError({
      message: "already normalized",
      status: 404,
      code: "NOT_FOUND",
    });
    expect(toAppError(original)).toBe(original);
  });

  it("maps a response error to the backend's error message and status", () => {
    const axiosError = makeAxiosError({
      response: {
        status: 403,
        data: {
          timestamp: "2026-01-01T00:00:00Z",
          status: 403,
          error: "Forbidden",
          requestId: "r1",
        },
        statusText: "Forbidden",
        headers: {},
        // @ts-expect-error minimal mock, config isn't read by toAppError
        config: {},
      },
    });

    const result = toAppError(axiosError);
    expect(result.status).toBe(403);
    expect(result.message).toBe("Forbidden");
    expect(result.isForbidden).toBe(true);
    expect(result.isAuthError).toBe(false);
  });

  it("falls back to a generic message when the backend omits `error`", () => {
    const axiosError = makeAxiosError({
      response: {
        status: 500,
        data: {
          timestamp: "2026-01-01T00:00:00Z",
          status: 500,
          error: "",
          requestId: "r1",
        },
        statusText: "Internal Server Error",
        headers: {},
        // @ts-expect-error minimal mock
        config: {},
      },
    });

    expect(toAppError(axiosError).message).toBe(
      "Something went wrong on our end. Please try again.",
    );
  });

  it("carries field-level validation errors through for 400s", () => {
    const axiosError = makeAxiosError({
      response: {
        status: 400,
        data: {
          timestamp: "2026-01-01T00:00:00Z",
          status: 400,
          error: "Validation failed",
          requestId: "r1",
          details: [{ field: "email", message: "Enter a valid email address." }],
        },
        statusText: "Bad Request",
        headers: {},
        // @ts-expect-error minimal mock
        config: {},
      },
    });

    const result = toAppError(axiosError);
    expect(result.isValidationError).toBe(true);
    expect(result.fieldErrors).toEqual([
      { field: "email", message: "Enter a valid email address." },
    ]);
  });

  it("treats a request-made-but-no-response as a network error", () => {
    const axiosError = makeAxiosError({ request: {} });
    const result = toAppError(axiosError);
    expect(result.code).toBe("NETWORK_ERROR");
    expect(result.status).toBe(0);
  });

  it("wraps a plain Error with a fallback status/code", () => {
    const result = toAppError(new Error("boom"));
    expect(result.message).toBe("boom");
    expect(result.code).toBe("UNKNOWN_ERROR");
  });

  it("handles a completely unknown thrown value without crashing", () => {
    const result = toAppError("just a string");
    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toBe("Unexpected error.");
  });
});

describe("AppError status getters", () => {
  it.each([
    ["isAuthError", 401],
    ["isForbidden", 403],
    ["isNotFound", 404],
    ["isRateLimited", 429],
  ] as const)("%s is true only for status %d", (getter, status) => {
    const error = new AppError({ message: "x", status, code: "X" });
    expect(error[getter]).toBe(true);
  });

  it("isValidationError requires both status 400 AND field errors present", () => {
    const withoutFields = new AppError({ message: "x", status: 400, code: "X" });
    const withFields = new AppError({
      message: "x",
      status: 400,
      code: "X",
      fieldErrors: [{ field: "email", message: "bad" }],
    });
    expect(withoutFields.isValidationError).toBe(false);
    expect(withFields.isValidationError).toBe(true);
  });
});

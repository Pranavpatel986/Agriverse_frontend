import { isAxiosError } from "axios";
import type { ApiErrorResponse, ApiFieldError } from "@/shared/types/api";

/**
 * Normalized error type used everywhere in the app instead of raw
 * AxiosError. Every feature's error UI (inline retry, toast, form field
 * errors) reads from this single shape — components never need to know
 * about Axios or the raw envelope.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly fieldErrors: ApiFieldError[];

  constructor(params: {
    message: string;
    status: number;
    code: string;
    requestId?: string;
    fieldErrors?: ApiFieldError[];
  }) {
    super(params.message);
    this.name = "AppError";
    this.status = params.status;
    this.code = params.code;
    this.requestId = params.requestId;
    this.fieldErrors = params.fieldErrors ?? [];
  }

  get isValidationError() {
    return this.status === 400 && this.fieldErrors.length > 0;
  }

  get isAuthError() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isRateLimited() {
    return this.status === 429;
  }
}

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "That request wasn't valid.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That conflicts with the current state of this item.",
  422: "That request couldn't be processed.",
  429: "Too many requests — please try again shortly.",
  500: "Something went wrong on our end. Please try again.",
};

/**
 * Converts any thrown value (ideally an AxiosError carrying the standard
 * ApiErrorResponse envelope) into a single, predictable AppError — the
 * one place this mapping happens, per the REST spec's "one generic error
 * handler" intent.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isAxiosError<ApiErrorResponse>(error)) {
    if (error.response) {
      const body = error.response.data;
      const status = error.response.status;
      return new AppError({
        message: body?.error || FALLBACK_MESSAGES[status] || "Request failed.",
        status,
        code: body?.error?.replace(/\s+/g, "_").toUpperCase() ?? "UNKNOWN_ERROR",
        requestId: body?.requestId,
        fieldErrors: body?.details ?? [],
      });
    }

    if (error.request) {
      return new AppError({
        message: "Couldn't reach the server. Check your connection and try again.",
        status: 0,
        code: "NETWORK_ERROR",
      });
    }
  }

  return new AppError({
    message: error instanceof Error ? error.message : "Unexpected error.",
    status: 0,
    code: "UNKNOWN_ERROR",
  });
}

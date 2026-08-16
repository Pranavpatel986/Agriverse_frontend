import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { RegisterRequest, RegisterResponse } from "../api/auth.types";

/**
 * Wraps POST /auth/register. Note the response's `status` is always
 * "pending_verification" — registration does NOT log the user in or
 * return tokens, so this hook intentionally does not touch AuthContext.
 * The Register page is responsible for routing to a
 * "check your email" state afterward.
 */
export function useRegister() {
  return useMutation<RegisterResponse, AppError, RegisterRequest>({
    mutationFn: async (payload) => {
      try {
        return await authService.register(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}

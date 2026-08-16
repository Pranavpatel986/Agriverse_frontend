import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { useAuth } from "../context/auth-context";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { LoginRequest, LoginResponse } from "../api/auth.types";

/**
 * Wraps POST /auth/login. Every mutation hook in this codebase follows
 * the same pattern: mutationFn normalizes thrown errors to AppError so
 * `mutation.error` is always an AppError in consuming components — never
 * a raw AxiosError — and onSuccess updates the single source of truth
 * (AuthContext) rather than components reaching into the response shape
 * themselves.
 */
export function useLogin() {
  const { setSession } = useAuth();

  return useMutation<LoginResponse, AppError, LoginRequest>({
    mutationFn: async (payload) => {
      try {
        return await authService.login(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
    },
  });
}

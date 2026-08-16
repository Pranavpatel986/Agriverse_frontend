import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { ResetPasswordRequest, ResetPasswordResponse } from "../api/auth.types";

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, AppError, ResetPasswordRequest>({
    mutationFn: async (payload) => {
      try {
        return await authService.resetPassword(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}

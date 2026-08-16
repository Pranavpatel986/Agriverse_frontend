import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "../api/auth.types";

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, AppError, ForgotPasswordRequest>({
    mutationFn: async (payload) => {
      try {
        return await authService.forgotPassword(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}

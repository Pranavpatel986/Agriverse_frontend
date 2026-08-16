import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { VerifyEmailRequest, VerifyEmailResponse } from "../api/auth.types";

export function useVerifyEmail() {
  return useMutation<VerifyEmailResponse, AppError, VerifyEmailRequest>({
    mutationFn: async (payload) => {
      try {
        return await authService.verifyEmail(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}

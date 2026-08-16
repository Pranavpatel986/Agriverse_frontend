import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { useAuth } from "../context/auth-context";
import { setAccessToken } from "@/shared/lib/auth/token-storage";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { SocialLoginRequest, SocialLoginResponse } from "../api/auth.types";

/**
 * SocialLoginResponse has no `user` field (confirmed against the actual
 * OpenAPI schema — unlike LoginResponse) so this fetches the profile via
 * GET /users/me right after, the same two-step pattern the silent-refresh
 * bootstrap already uses.
 */
export function useSocialLogin() {
  const { setSession } = useAuth();

  return useMutation<SocialLoginResponse, AppError, SocialLoginRequest>({
    mutationFn: async (payload) => {
      try {
        return await authService.socialLogin(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const me = await authService.getCurrentUser();
      setSession(me, data.accessToken);
    },
  });
}

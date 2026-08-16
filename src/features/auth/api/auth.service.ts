import { apiClient } from "@/shared/lib/api/client";
import { bffClient } from "@/shared/lib/api/bff-client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type {
  CurrentUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./auth.types";

/**
 * Login, refresh, logout, and social-login go through our own BFF Route
 * Handlers (app/api/auth/*) instead of the backend directly — those are
 * the four flows that touch the refresh token, which our server keeps
 * in an httpOnly cookie the browser never reads. Everything else here
 * has no refresh-token involvement and calls the backend directly via
 * `apiClient`, unchanged.
 */
export const authService = {
  register: (payload: RegisterRequest) =>
    apiClient
      .post<RegisterResponse>(endpoints.auth.register, payload)
      .then((res) => res.data),

  /** Response shape from our /api/auth/login route: {accessToken,
   *  expiresIn, user} — refreshToken never leaves our server. */
  login: (payload: LoginRequest) =>
    bffClient.post<LoginResponse>("/login", payload).then((res) => res.data),

  /** No body — our /api/auth/refresh route reads the refresh token from
   *  its own httpOnly cookie. */
  refreshToken: () =>
    bffClient.post<RefreshTokenResponse>("/refresh").then((res) => res.data),

  /** No body either, for the same reason — see refresh above. */
  logout: () => bffClient.post<{ message: string }>("/logout").then((res) => res.data),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiClient
      .post<ForgotPasswordResponse>(endpoints.auth.forgotPassword, payload)
      .then((res) => res.data),

  resetPassword: (payload: ResetPasswordRequest) =>
    apiClient
      .post<ResetPasswordResponse>(endpoints.auth.resetPassword, payload)
      .then((res) => res.data),

  verifyEmail: (payload: VerifyEmailRequest) =>
    apiClient
      .post<VerifyEmailResponse>(endpoints.auth.verifyEmail, payload)
      .then((res) => res.data),

  resendVerification: (payload: ResendVerificationRequest) =>
    apiClient
      .post<ResendVerificationResponse>(endpoints.auth.resendVerification, payload)
      .then((res) => res.data),

  /** Response shape from our /api/auth/social-login route: {accessToken,
   *  isNewUser} — no `user` (matches the real backend) and no
   *  refreshToken (kept server-side). */
  socialLogin: (payload: SocialLoginRequest) =>
    bffClient.post<SocialLoginResponse>("/social-login", payload).then((res) => res.data),

  /** Hydrates full session state (role, name) after a silent refresh,
   *  since /auth/refresh-token intentionally returns only a token. */
  getCurrentUser: () =>
    apiClient.get<CurrentUserResponse>(endpoints.users.me).then((res) => res.data),
};

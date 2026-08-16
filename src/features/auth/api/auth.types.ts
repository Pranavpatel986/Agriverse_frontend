import type { PublicId, Role } from "@/shared/types/api";

export interface AuthUser {
  id: PublicId;
  fullName: string;
  role: Role;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: PublicId;
  fullName: string;
  email: string;
  status: "pending_verification" | string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** This is what our /api/auth/login BFF route returns — NOT the raw
 *  backend AuthResponse. The backend's response also includes
 *  `refreshToken`; our route handler strips it out and stores it in an
 *  httpOnly cookie server-side instead, so the browser never sees it. */
export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export type SocialProvider = "google" | "github";

export interface SocialLoginRequest {
  provider: SocialProvider;
  /** Field name confirmed against the actual OpenAPI schema —
   *  `providerToken`, not `idToken`. */
  providerToken: string;
}

/** This is what our /api/auth/social-login BFF route returns — NOT the
 *  raw backend SocialLoginResponse. Same refreshToken-stripping as
 *  LoginResponse above, plus the backend's response has no `user`
 *  object at all (confirmed against its OpenAPI schema), so
 *  useSocialLogin fetches the profile separately via GET /users/me. */
export interface SocialLoginResponse {
  accessToken: string;
  isNewUser: boolean;
}

/** GET /users/me — used to hydrate the session after a silent refresh,
 *  since /auth/refresh-token only returns a new access token. */
export interface CurrentUserResponse extends AuthUser {
  email: string;
}

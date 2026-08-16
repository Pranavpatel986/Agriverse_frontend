import type { Role } from "@/shared/types/api";

/**
 * Path prefixes that require an authenticated session, and the minimum
 * role each requires (undefined = any authenticated user). Middleware
 * and any client-side route guards both read from this single table, so
 * a new protected section is one entry here, not a change in two places.
 */
export const PROTECTED_ROUTES: { prefix: string; minimumRole?: Role }[] = [
  // Dashboard is the Author/Editor content-management console (My
  // Articles, analytics) per the Frontend Technical Specification's
  // Dashboard page — not a general reader page, so it requires AUTHOR+.
  { prefix: "/dashboard", minimumRole: "AUTHOR" },
  { prefix: "/bookmarks" },
  { prefix: "/admin", minimumRole: "EDITOR" },
];

export const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  newArticle: "/dashboard/articles/new",
  bookmarks: "/bookmarks",
  search: "/search",
  admin: "/admin",
  diseases: "/diseases",
  schemes: "/schemes",
  machinery: "/machinery",
  marketPricesWeather: "/market-prices-weather",
  roadmaps: "/roadmaps",
  category: (slug: string) => `/category/${slug}`,
  article: (slug: string) => `/article/${slug}`,
  roadmap: (slug: string) => `/roadmaps/${slug}`,
  quiz: (id: string) => `/quiz/${id}`,
} as const;

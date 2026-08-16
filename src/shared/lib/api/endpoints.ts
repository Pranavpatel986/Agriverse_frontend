/**
 * Every endpoint path from the REST API Specification, in one place.
 * Feature service modules import from here instead of writing string
 * literals, so a path change (or the eventual v1 → v2 migration the spec
 * describes) touches one file, not every call site.
 *
 * Paths are relative to `env.NEXT_PUBLIC_API_BASE_URL`, which already
 * includes `/api/v1` — see config/env.ts and shared/lib/api/client.ts.
 */
export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refreshToken: "/auth/refresh-token",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    socialLogin: "/auth/social-login",
  },
  users: {
    me: "/users/me",
    profile: (id: string) => `/users/${id}`,
  },
  articles: {
    list: "/articles",
    create: "/articles",
    bySlug: (slug: string) => `/articles/${slug}`,
    // Distinct from bySlug: full detail by ID regardless of status, for
    // the edit form — bySlug 404s on unpublished content for non-owners
    // and doesn't carry the raw editable body the same way.
    forEdit: (id: string) => `/articles/${id}/edit`,
    update: (id: string) => `/articles/${id}`,
    remove: (id: string) => `/articles/${id}`,
  },
  comments: {
    listForArticle: (articleId: string) => `/articles/${articleId}/comments`,
    createForArticle: (articleId: string) => `/articles/${articleId}/comments`,
    remove: (commentId: string) => `/comments/${commentId}`,
    replies: (commentId: string) => `/comments/${commentId}/replies`,
    like: (commentId: string) => `/comments/${commentId}/like`,
  },
  categories: {
    list: "/categories",
    bySlug: (slug: string) => `/categories/${slug}`,
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    remove: (id: string) => `/categories/${id}`,
  },
  search: {
    query: "/search",
    autocomplete: "/search/autocomplete",
    trending: "/search/trending",
  },
  bookmarks: {
    list: "/bookmarks",
    create: "/bookmarks",
    remove: (bookmarkId: string) => `/bookmarks/${bookmarkId}`,
  },
  recommendations: {
    forCurrentUser: "/recommendations",
    forArticle: (articleId: string) => `/articles/${articleId}/recommendations`,
  },
  dashboard: {
    managedArticles: "/admin/articles",
    updateArticleStatus: (articleId: string) => `/articles/${articleId}/status`,
    analyticsOverview: "/admin/analytics/overview",
  },
  admin: {
    articles: "/admin/articles",
    reviewArticle: (articleId: string) => `/admin/articles/${articleId}/review`,
    commentQueue: "/admin/comments/queue",
    moderateComment: (commentId: string) => `/admin/comments/${commentId}/moderate`,
    users: "/admin/users",
    updateUserRole: (userId: string) => `/admin/users/${userId}/role`,
    updateUserStatus: (userId: string) => `/admin/users/${userId}/status`,
    schemes: "/admin/schemes",
    scheme: (id: string) => `/admin/schemes/${id}`,
    diseases: "/admin/diseases",
    disease: (id: string) => `/admin/diseases/${id}`,
    machinery: "/admin/machinery",
    machineryItem: (id: string) => `/admin/machinery/${id}`,
    crops: "/admin/crops",
    crop: (id: string) => `/admin/crops/${id}`,
    createUser: "/admin/users",
  },
  crops: {
    list: "/crops",
    byId: (id: string) => `/crops/${id}`,
  },
  diseases: {
    list: "/diseases",
    byId: (id: string) => `/diseases/${id}`,
  },
  schemes: {
    list: "/schemes",
    byId: (id: string) => `/schemes/${id}`,
  },
  machinery: {
    list: "/machinery",
    byId: (id: string) => `/machinery/${id}`,
  },
  marketPrices: {
    lookup: "/market-prices",
  },
  weather: {
    lookup: "/weather",
  },
  roadmaps: {
    list: "/roadmaps",
    bySlug: (slug: string) => `/roadmaps/${slug}`,
    progress: (id: string) => `/roadmaps/${id}/progress`,
    create: "/roadmaps",
  },
  quizzes: {
    byId: (id: string) => `/quizzes/${id}`,
    attempts: (id: string) => `/quizzes/${id}/attempts`,
    myAttempts: (id: string) => `/quizzes/${id}/attempts/me`,
    create: "/quizzes",
  },
  notifications: {
    list: "/notifications",
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
    remove: (id: string) => `/notifications/${id}`,
  },
} as const;

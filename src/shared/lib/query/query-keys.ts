/**
 * Centralized query-key factory. Every feature's hooks build their keys
 * from here rather than inlining array literals, so invalidation
 * (`queryClient.invalidateQueries`) can target an exact key or an entire
 * feature's namespace without every call site needing to agree on the
 * literal shape by convention alone.
 */
export const queryKeys = {
  auth: {
    currentUser: () => ["auth", "currentUser"] as const,
  },
  articles: {
    all: () => ["articles"] as const,
    lists: () => [...queryKeys.articles.all(), "list"] as const,
    list: (params: object) => [...queryKeys.articles.lists(), params] as const,
    detail: (slug: string) => [...queryKeys.articles.all(), "detail", slug] as const,
  },
  categories: {
    all: () => ["categories"] as const,
    lists: () => [...queryKeys.categories.all(), "list"] as const,
    detail: (slug: string) => [...queryKeys.categories.all(), "detail", slug] as const,
  },
  search: {
    all: () => ["search"] as const,
    query: (params: object) => [...queryKeys.search.all(), "query", params] as const,
    trending: (limit: number) => [...queryKeys.search.all(), "trending", limit] as const,
  },
  bookmarks: {
    all: () => ["bookmarks"] as const,
    lists: () => [...queryKeys.bookmarks.all(), "list"] as const,
    list: (params: object) => [...queryKeys.bookmarks.lists(), params] as const,
  },
  recommendations: {
    forCurrentUser: (limit: number) =>
      ["recommendations", "current-user", limit] as const,
    forArticle: (articleId: string, limit: number) =>
      ["recommendations", "article", articleId, limit] as const,
  },
  comments: {
    forArticle: (articleId: string, params: object = {}) =>
      ["comments", "article", articleId, params] as const,
  },
  dashboard: {
    myArticles: (params: object = {}) => ["dashboard", "my-articles", params] as const,
    analytics: (params: object = {}) => ["dashboard", "analytics", params] as const,
  },
} as const;

export const searchHistoryQueries = {
  // Get search history for current user (supports pagination via query params)
  getSearchHistory: (params?: { page?: number; limit?: number }) => ({
    Key: ["search-history", ...(params ? [params.page, params.limit] : [])],
    endpoint: "/search-history",
  }),

  // Create new search history entry
  createSearchHistory: {
    Key: ["search-history", "create"],
    endpoint: "/search-history",
  },

  // Delete specific search history item
  deleteSearchHistory: (id: string) => ({
    Key: ["search-history", id, "delete"],
    endpoint: `/search-history/${id}`,
  }),

  // Delete all search history for a user
  deleteUserSearchHistory: (userId: string) => ({
    Key: ["search-history", "user", userId, "delete"],
    endpoint: `/search-history/user/${userId}`,
  }),
};

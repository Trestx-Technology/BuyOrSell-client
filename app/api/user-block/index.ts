export const userBlockQueries = {
  blockUser: {
    Key: ["user-block", "block"],
    endpoint: "/user-block",
  },
  unblockUser: (id: string) => ({
    Key: ["user-block", "unblock", id],
    endpoint: `/user-block/${id}`,
  }),
  getBlockedUsers: {
    Key: ["user-block", "blocked"],
    endpoint: "/user-block/blocked",
  },
  isBlocked: (id: string) => ({
    Key: ["user-block", "is-blocked", id],
    endpoint: `/user-block/is-blocked/${id}`,
  }),
};

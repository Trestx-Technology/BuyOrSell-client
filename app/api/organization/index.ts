export const organizationQueries = {
  findAllOrganizations: (params?: {
    search?: string;
    type?: string;
    emirate?: string;
    verified?: boolean;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => ({
    Key: ["organizations", params],
    endpoint: "/organizations",
  }),
  createOrganization: {
    Key: ["organization", "create"],
    endpoint: "/organizations",
  },
  getOrganizationById: (id: string) => ({
    Key: ["organization", id],
    endpoint: `/organizations/${id}`,
  }),
  updateOrganization: (id: string) => ({
    Key: ["organization", id, "update"],
    endpoint: `/organizations/${id}`,
  }),
  deleteOrganization: (id: string) => ({
    Key: ["organization", id, "delete"],
    endpoint: `/organizations/${id}`,
  }),
  getMyOrganization: {
    Key: ["organization", "me"],
    endpoint: "/organizations/me",
  },
  updateMyOrganization: {
    Key: ["organization", "me", "update"],
    endpoint: "/organizations/me",
  },
  approveOrganization: (id: string) => ({
    Key: ["organization", id, "approve"],
    endpoint: `/organizations/${id}/approve`,
  }),
  rejectOrganization: (id: string) => ({
    Key: ["organization", id, "reject"],
    endpoint: `/organizations/${id}/reject`,
  }),
  submitOrganization: (id: string) => ({
    Key: ["organization", id, "submit"],
    endpoint: `/organizations/${id}/submit`,
  }),
  blockOrganization: (id: string) => ({
    Key: ["organization", id, "block"],
    endpoint: `/organizations/${id}/block`,
  }),
  getBlockHistory: (id: string) => ({
    Key: ["organization", id, "block-history"],
    endpoint: `/organizations/${id}/block-history`,
  }),
  followOrganization: (id: string) => ({
    Key: ["organization", id, "follow"],
    endpoint: `/organizations/${id}/follow`,
  }),
  unfollowOrganization: (id: string) => ({
    Key: ["organization", id, "unfollow"],
    endpoint: `/organizations/${id}/follow`,
  }),
  getFollowers: (id: string, params?: { page?: number; limit?: number }) => ({
    Key: ["organization", id, "followers", params],
    endpoint: `/organizations/${id}/followers`,
  }),
  getFollowersCount: (id: string) => ({
    Key: ["organization", id, "followers", "count"],
    endpoint: `/organizations/${id}/followers/count`,
  }),
  bulkApproveOrganizations: {
    Key: ["organizations", "bulk", "approve"],
    endpoint: "/organizations/bulk/approve",
  },
  bulkRejectOrganizations: {
    Key: ["organizations", "bulk", "reject"],
    endpoint: "/organizations/bulk/reject",
  },
};

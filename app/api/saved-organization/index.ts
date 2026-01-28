export const savedOrganizationQueries = {
  saveOrganization: {
    Key: ["saved-organizations", "create"],
    endpoint: "/saved-organizations",
  },
  findAllSavedOrganizations: (userId?: string) => ({
    Key: ["saved-organizations", userId || "my"],
    endpoint: userId ? `/saved-organizations/user/${userId}` : "/saved-organizations/my",
  }),
  checkSavedOrganization: (organizationId: string) => ({
    Key: ["saved-organizations", "check", organizationId],
    endpoint: "/saved-organizations/check",
  }),
  getSavedOrganizationsCount: {
    Key: ["saved-organizations", "count"],
    endpoint: "/saved-organizations/count",
  },
  getSavedOrganizationDetail: (id: string) => ({
    Key: ["saved-organization", id],
    endpoint: `/saved-organizations/${id}`,
  }),
  updateSavedOrganization: (id: string) => ({
    Key: ["saved-organization", id, "update"],
    endpoint: `/saved-organizations/${id}`,
  }),
  deleteSavedOrganization: (id: string) => ({
    Key: ["saved-organization", id, "delete"],
    endpoint: `/saved-organizations/${id}`,
  }),
  deleteSavedOrganizationByUserAndOrg: (userId: string, organizationId: string) => ({
    Key: ["saved-organization", userId, organizationId, "delete"],
    endpoint: `/saved-organizations/user/${userId}/organization/${organizationId}`,
  }),
};

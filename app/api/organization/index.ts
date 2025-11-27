export const organizationQueries = {
  findAllOrganizations: {
    Key: ['organizations'],
    endpoint: '/organizations',
  },
  createOrganization: {
    Key: ['organization', 'create'],
    endpoint: '/organizations',
  },
  getOrganizationById: (id: string) => ({
    Key: ['organization', id],
    endpoint: `/organizations/${id}`,
  }),
  updateOrganization: (id: string) => ({
    Key: ['organization', id, 'update'],
    endpoint: `/organizations/${id}`,
  }),
  deleteOrganization: (id: string) => ({
    Key: ['organization', id, 'delete'],
    endpoint: `/organizations/${id}`,
  }),
  getMyOrganization: {
    Key: ['organization', 'me'],
    endpoint: '/organizations/me',
  },
  updateMyOrganization: {
    Key: ['organization', 'me', 'update'],
    endpoint: '/organizations/me',
  },
  verifyOrganization: (id: string) => ({
    Key: ['organization', id, 'verify'],
    endpoint: `/organizations/${id}/verify`,
  }),
  blockOrganization: (id: string) => ({
    Key: ['organization', id, 'block'],
    endpoint: `/organizations/${id}/block`,
  }),
  unblockOrganization: (id: string) => ({
    Key: ['organization', id, 'unblock'],
    endpoint: `/organizations/${id}/unblock`,
  }),
  uploadLogo: {
    Key: ['organization', 'logo', 'upload'],
    endpoint: '/organizations/logo',
  },
  uploadCoverImage: {
    Key: ['organization', 'cover', 'upload'],
    endpoint: '/organizations/cover',
  },
};


export const employerProfilesQueries = {
  createEmployerProfile: {
    Key: ['employer-profile', 'create'],
    endpoint: '/employer-profiles',
  },
  getEmployerProfileById: (id: string) => ({
    Key: ['employer-profile', id],
    endpoint: `/employer-profiles/${id}`,
  }),
  updateEmployerProfile: (id: string) => ({
    Key: ['employer-profile', id, 'update'],
    endpoint: `/employer-profiles/${id}`,
  }),
  deleteEmployerProfile: (id: string) => ({
    Key: ['employer-profile', id, 'delete'],
    endpoint: `/employer-profiles/${id}`,
  }),
  searchEmployerProfiles: {
    Key: ['employer-profiles', 'search'],
    endpoint: '/employer-profiles/search',
  },
};


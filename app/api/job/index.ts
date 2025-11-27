export const jobQueries = {
  getAllJobs: {
    Key: ['jobs'],
    endpoint: '/jobs',
  },
  getJobById: (id: string) => ({
    Key: ['job', id],
    endpoint: `/jobs/${id}`,
  }),
  createJob: {
    Key: ['job', 'create'],
    endpoint: '/jobs',
  },
  updateJob: (id: string) => ({
    Key: ['job', id, 'update'],
    endpoint: `/jobs/${id}`,
  }),
  deleteJob: (id: string) => ({
    Key: ['job', id, 'delete'],
    endpoint: `/jobs/${id}`,
  }),
  getJobsByOrganization: (organizationId: string) => ({
    Key: ['jobs', 'organization', organizationId],
    endpoint: `/jobs/organization/${organizationId}`,
  }),
  getJobsByCategory: (categoryId: string) => ({
    Key: ['jobs', 'category', categoryId],
    endpoint: `/jobs/category/${categoryId}`,
  }),
  searchJobs: {
    Key: ['jobs', 'search'],
    endpoint: '/jobs/search',
  },
  getFeaturedJobs: {
    Key: ['jobs', 'featured'],
    endpoint: '/jobs/featured',
  },
  getRecentJobs: {
    Key: ['jobs', 'recent'],
    endpoint: '/jobs/recent',
  },
  getMyJobs: {
    Key: ['jobs', 'my'],
    endpoint: '/jobs/my',
  },
  updateJobStatus: (id: string) => ({
    Key: ['job', id, 'status'],
    endpoint: `/jobs/${id}/status`,
  }),
  getJobApplicants: (id: string) => ({
    Key: ['job', id, 'applicants'],
    endpoint: `/jobs/${id}/applicants`,
  }),
  getJobApplicantById: (jobId: string, applicantId: string) => ({
    Key: ['job', jobId, 'applicants', applicantId],
    endpoint: `/jobs/${jobId}/applicants/${applicantId}`,
  }),
  updateApplicantStatus: (jobId: string, applicantId: string) => ({
    Key: ['job', jobId, 'applicants', applicantId, 'status'],
    endpoint: `/jobs/${jobId}/applicants/${applicantId}/status`,
  }),
  filterJobs: {
    Key: ['jobs', 'filter'],
    endpoint: '/jobs/filter',
  },
};


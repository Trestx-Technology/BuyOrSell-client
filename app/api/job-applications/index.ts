export const jobApplicationQueries = {
  applyToJob: (jobId: string) => ({
    Key: ['job-application', jobId, 'apply'],
    endpoint: `/jobs/${jobId}/applications`,
  }),
  getMyApplications: {
    Key: ['job-applications', 'me'],
    endpoint: '/jobs/applications/me',
  },
  acceptApplication: (applicationId: string) => ({
    Key: ['job-application', applicationId, 'accept'],
    endpoint: `/jobs/applications/${applicationId}/accept`,
  }),
  rejectApplication: (applicationId: string) => ({
    Key: ['job-application', applicationId, 'reject'],
    endpoint: `/jobs/applications/${applicationId}/reject`,
  }),
  updateApplicationStatus: (applicationId: string) => ({
    Key: ['job-application', applicationId, 'status'],
    endpoint: `/jobs/applications/${applicationId}/status`,
  }),
  getSimilarJobs: {
    Key: ['jobs', 'similar'],
    endpoint: '/jobs/similar-jobs',
  },
};


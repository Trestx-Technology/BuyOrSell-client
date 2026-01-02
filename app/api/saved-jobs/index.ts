export const savedJobsQueries = {
  saveJob: {
    Key: ["saved-job", "save"],
    endpoint: "/saved-jobs",
  },
  getSavedJobById: (id: string) => ({
    Key: ["saved-job", id],
    endpoint: `/saved-jobs/${id}`,
  }),
  updateSavedJob: (id: string) => ({
    Key: ["saved-job", id, "update"],
    endpoint: `/saved-jobs/${id}`,
  }),
  deleteSavedJob: (id: string) => ({
    Key: ["saved-job", id, "delete"],
    endpoint: `/saved-jobs/${id}`,
  }),
  checkSavedJob: {
    Key: ["saved-job", "check"],
    endpoint: "/saved-jobs/check",
  },
  getSavedJobsCount: {
    Key: ["saved-jobs", "count"],
    endpoint: "/saved-jobs/count",
  },
  getSavedJobsByJobSeeker: (jobSeekerId: string) => ({
    Key: ["saved-jobs", "job-seeker", jobSeekerId],
    endpoint: `/saved-jobs/job-seeker/${jobSeekerId}`,
  }),
  deleteSavedJobByJobAndSeeker: (jobSeekerId: string, jobId: string) => ({
    Key: ["saved-job", "job-seeker", jobSeekerId, "job", jobId, "delete"],
    endpoint: `/saved-jobs/job-seeker/${jobSeekerId}/job/${jobId}`,
  }),
  getMySavedJobs: {
    Key: ["saved-jobs", "my"],
    endpoint: "/saved-jobs/my",
  },
};

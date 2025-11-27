export const jobseekerQueries = {
  getJobseekerProfile: {
    Key: ['jobseeker', 'profile'],
    endpoint: '/jobseeker/profile',
  },
  updateJobseekerProfile: {
    Key: ['jobseeker', 'profile', 'update'],
    endpoint: '/jobseeker/profile',
  },
  getWorkExperience: {
    Key: ['jobseeker', 'work-experience'],
    endpoint: '/jobseeker/work-experience',
  },
  addWorkExperience: {
    Key: ['jobseeker', 'work-experience', 'add'],
    endpoint: '/jobseeker/work-experience',
  },
  updateWorkExperience: (id: string) => ({
    Key: ['jobseeker', 'work-experience', id, 'update'],
    endpoint: `/jobseeker/work-experience/${id}`,
  }),
  deleteWorkExperience: (id: string) => ({
    Key: ['jobseeker', 'work-experience', id, 'delete'],
    endpoint: `/jobseeker/work-experience/${id}`,
  }),
  getEducation: {
    Key: ['jobseeker', 'education'],
    endpoint: '/jobseeker/education',
  },
  addEducation: {
    Key: ['jobseeker', 'education', 'add'],
    endpoint: '/jobseeker/education',
  },
  updateEducation: (id: string) => ({
    Key: ['jobseeker', 'education', id, 'update'],
    endpoint: `/jobseeker/education/${id}`,
  }),
  deleteEducation: (id: string) => ({
    Key: ['jobseeker', 'education', id, 'delete'],
    endpoint: `/jobseeker/education/${id}`,
  }),
  getSkills: {
    Key: ['jobseeker', 'skills'],
    endpoint: '/jobseeker/skills',
  },
  addSkill: {
    Key: ['jobseeker', 'skills', 'add'],
    endpoint: '/jobseeker/skills',
  },
  updateSkill: (id: string) => ({
    Key: ['jobseeker', 'skills', id, 'update'],
    endpoint: `/jobseeker/skills/${id}`,
  }),
  deleteSkill: (id: string) => ({
    Key: ['jobseeker', 'skills', id, 'delete'],
    endpoint: `/jobseeker/skills/${id}`,
  }),
  getCertifications: {
    Key: ['jobseeker', 'certifications'],
    endpoint: '/jobseeker/certifications',
  },
  addCertification: {
    Key: ['jobseeker', 'certifications', 'add'],
    endpoint: '/jobseeker/certifications',
  },
  updateCertification: (id: string) => ({
    Key: ['jobseeker', 'certifications', id, 'update'],
    endpoint: `/jobseeker/certifications/${id}`,
  }),
  deleteCertification: (id: string) => ({
    Key: ['jobseeker', 'certifications', id, 'delete'],
    endpoint: `/jobseeker/certifications/${id}`,
  }),
  getPortfolio: {
    Key: ['jobseeker', 'portfolio'],
    endpoint: '/jobseeker/portfolio',
  },
  addPortfolioItem: {
    Key: ['jobseeker', 'portfolio', 'add'],
    endpoint: '/jobseeker/portfolio',
  },
  updatePortfolioItem: (id: string) => ({
    Key: ['jobseeker', 'portfolio', id, 'update'],
    endpoint: `/jobseeker/portfolio/${id}`,
  }),
  deletePortfolioItem: (id: string) => ({
    Key: ['jobseeker', 'portfolio', id, 'delete'],
    endpoint: `/jobseeker/portfolio/${id}`,
  }),
  updateJobPreferences: {
    Key: ['jobseeker', 'preferences', 'update'],
    endpoint: '/jobseeker/preferences',
  },
  getJobApplications: {
    Key: ['jobseeker', 'applications'],
    endpoint: '/jobseeker/applications',
  },
  getJobApplicationById: (id: string) => ({
    Key: ['jobseeker', 'applications', id],
    endpoint: `/jobseeker/applications/${id}`,
  }),
  applyToJob: {
    Key: ['jobseeker', 'applications', 'apply'],
    endpoint: '/jobseeker/applications',
  },
  withdrawApplication: (id: string) => ({
    Key: ['jobseeker', 'applications', id, 'withdraw'],
    endpoint: `/jobseeker/applications/${id}/withdraw`,
  }),
  getSavedJobs: {
    Key: ['jobseeker', 'saved-jobs'],
    endpoint: '/jobseeker/saved-jobs',
  },
  saveJob: {
    Key: ['jobseeker', 'saved-jobs', 'save'],
    endpoint: '/jobseeker/saved-jobs',
  },
  unsaveJob: (id: string) => ({
    Key: ['jobseeker', 'saved-jobs', id, 'unsave'],
    endpoint: `/jobseeker/saved-jobs/${id}`,
  }),
  uploadResume: {
    Key: ['jobseeker', 'resume', 'upload'],
    endpoint: '/jobseeker/resume',
  },
  deleteResume: {
    Key: ['jobseeker', 'resume', 'delete'],
    endpoint: '/jobseeker/resume',
  },
};


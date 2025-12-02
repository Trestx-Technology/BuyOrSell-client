export const jobseekerQueries = {
  // ============================================================================
  // GENERAL PROFILE ENDPOINTS
  // ============================================================================
  createJobseekerProfile: {
    Key: ['jobseeker', 'profile', 'create'],
    endpoint: '/jobseeker-profiles',
  },
  getJobseekerProfileById: (id: string) => ({
    Key: ['jobseeker', 'profile', id],
    endpoint: `/jobseeker-profiles/${id}`,
  }),
  updateJobseekerProfile: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'update'],
    endpoint: `/jobseeker-profiles/${id}`,
  }),
  deleteJobseekerProfile: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'delete'],
    endpoint: `/jobseeker-profiles/${id}`,
  }),
  updateJobseekerProfilePartial: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'partial'],
    endpoint: `/jobseeker-profiles/${id}/partial`,
  }),
  banJobseekerProfile: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'ban'],
    endpoint: `/jobseeker-profiles/${id}/ban`,
  }),
  unbanJobseekerProfile: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'unban'],
    endpoint: `/jobseeker-profiles/${id}/unban`,
  }),
  blockJobseekerProfile: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'block'],
    endpoint: `/jobseeker-profiles/${id}/block`,
  }),
  unblockJobseekerProfile: (id: string) => ({
    Key: ['jobseeker', 'profile', id, 'unblock'],
    endpoint: `/jobseeker-profiles/${id}/unblock`,
  }),

  // ============================================================================
  // CURRENT USER PROFILE ENDPOINTS (/me)
  // ============================================================================
  getJobseekerProfile: {
    Key: ['jobseeker', 'profile', 'me'],
    endpoint: '/jobseeker-profiles/me',
  },
  updateJobseekerProfilePartialMe: {
    Key: ['jobseeker', 'profile', 'me', 'partial'],
    endpoint: '/jobseeker-profiles/me/partial',
  },

  // ============================================================================
  // PROFILE BY USER ID ENDPOINTS
  // ============================================================================
  getJobseekerProfileByUserId: (userId: string) => ({
    Key: ['jobseeker', 'profile', 'by-user', userId],
    endpoint: `/jobseeker-profiles/by-user/${userId}`,
  }),
  updateJobseekerProfilePartialByUserId: (userId: string) => ({
    Key: ['jobseeker', 'profile', 'by-user', userId, 'partial'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/partial`,
  }),

  // ============================================================================
  // AWARDS BY USER ID
  // ============================================================================
  appendAwardsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'awards', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/awards`,
  }),
  replaceAwardsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'awards', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/awards`,
  }),

  // ============================================================================
  // CERTIFICATIONS BY USER ID
  // ============================================================================
  appendCertificationsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'certifications', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/certifications`,
  }),
  replaceCertificationsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'certifications', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/certifications`,
  }),

  // ============================================================================
  // EDUCATIONS BY USER ID
  // ============================================================================
  appendEducationsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'educations', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/educations`,
  }),
  replaceEducationsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'educations', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/educations`,
  }),

  // ============================================================================
  // EXPERIENCES BY USER ID
  // ============================================================================
  appendExperiencesByUserId: (userId: string) => ({
    Key: ['jobseeker', 'experiences', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/experiences`,
  }),
  replaceExperiencesByUserId: (userId: string) => ({
    Key: ['jobseeker', 'experiences', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/experiences`,
  }),

  // ============================================================================
  // LANGUAGES BY USER ID
  // ============================================================================
  appendLanguagesByUserId: (userId: string) => ({
    Key: ['jobseeker', 'languages', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/languages`,
  }),
  replaceLanguagesByUserId: (userId: string) => ({
    Key: ['jobseeker', 'languages', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/languages`,
  }),

  // ============================================================================
  // LINKS BY USER ID
  // ============================================================================
  appendLinksByUserId: (userId: string) => ({
    Key: ['jobseeker', 'links', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/links`,
  }),
  replaceLinksByUserId: (userId: string) => ({
    Key: ['jobseeker', 'links', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/links`,
  }),

  // ============================================================================
  // PROJECTS BY USER ID
  // ============================================================================
  appendProjectsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'projects', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/projects`,
  }),
  replaceProjectsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'projects', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/projects`,
  }),

  // ============================================================================
  // PUBLICATIONS BY USER ID
  // ============================================================================
  appendPublicationsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'publications', 'by-user', userId, 'append'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/publications`,
  }),
  replacePublicationsByUserId: (userId: string) => ({
    Key: ['jobseeker', 'publications', 'by-user', userId, 'replace'],
    endpoint: `/jobseeker-profiles/by-user/${userId}/publications`,
  }),

  // ============================================================================
  // RESUME ENDPOINTS
  // ============================================================================
  createProfileFromResume: {
    Key: ['jobseeker', 'profile', 'from-resume'],
    endpoint: '/jobseeker-profiles/from-resume',
  },

  // ============================================================================
  // SEARCH ENDPOINTS
  // ============================================================================
  searchJobseekerProfiles: {
    Key: ['jobseeker', 'profiles', 'search'],
    endpoint: '/jobseeker-profiles/search',
  },
  searchJobseekerProfilesAI: {
    Key: ['jobseeker', 'profiles', 'search', 'ai'],
    endpoint: '/jobseeker-profiles/search/ai',
  },

  // ============================================================================
  // LEGACY ENDPOINTS (for backward compatibility)
  // ============================================================================
  getWorkExperience: {
    Key: ['jobseeker', 'work-experience'],
    endpoint: '/jobseeker-profiles/me/work-experience',
  },
  addWorkExperience: {
    Key: ['jobseeker', 'work-experience', 'add'],
    endpoint: '/jobseeker-profiles/me/work-experience',
  },
  updateWorkExperience: (id: string) => ({
    Key: ['jobseeker', 'work-experience', id, 'update'],
    endpoint: `/jobseeker-profiles/me/work-experience/${id}`,
  }),
  deleteWorkExperience: (id: string) => ({
    Key: ['jobseeker', 'work-experience', id, 'delete'],
    endpoint: `/jobseeker-profiles/me/work-experience/${id}`,
  }),
  getEducation: {
    Key: ['jobseeker', 'education'],
    endpoint: '/jobseeker-profiles/me/education',
  },
  addEducation: {
    Key: ['jobseeker', 'education', 'add'],
    endpoint: '/jobseeker-profiles/me/education',
  },
  updateEducation: (id: string) => ({
    Key: ['jobseeker', 'education', id, 'update'],
    endpoint: `/jobseeker-profiles/me/education/${id}`,
  }),
  deleteEducation: (id: string) => ({
    Key: ['jobseeker', 'education', id, 'delete'],
    endpoint: `/jobseeker-profiles/me/education/${id}`,
  }),
  getSkills: {
    Key: ['jobseeker', 'skills'],
    endpoint: '/jobseeker-profiles/me/skills',
  },
  addSkill: {
    Key: ['jobseeker', 'skills', 'add'],
    endpoint: '/jobseeker-profiles/me/skills',
  },
  updateSkill: (id: string) => ({
    Key: ['jobseeker', 'skills', id, 'update'],
    endpoint: `/jobseeker-profiles/me/skills/${id}`,
  }),
  deleteSkill: (id: string) => ({
    Key: ['jobseeker', 'skills', id, 'delete'],
    endpoint: `/jobseeker-profiles/me/skills/${id}`,
  }),
  getCertifications: {
    Key: ['jobseeker', 'certifications'],
    endpoint: '/jobseeker-profiles/me/certifications',
  },
  addCertification: {
    Key: ['jobseeker', 'certifications', 'add'],
    endpoint: '/jobseeker-profiles/me/certifications',
  },
  updateCertification: (id: string) => ({
    Key: ['jobseeker', 'certifications', id, 'update'],
    endpoint: `/jobseeker-profiles/me/certifications/${id}`,
  }),
  deleteCertification: (id: string) => ({
    Key: ['jobseeker', 'certifications', id, 'delete'],
    endpoint: `/jobseeker-profiles/me/certifications/${id}`,
  }),
  getPortfolio: {
    Key: ['jobseeker', 'portfolio'],
    endpoint: '/jobseeker-profiles/me/portfolio',
  },
  addPortfolioItem: {
    Key: ['jobseeker', 'portfolio', 'add'],
    endpoint: '/jobseeker-profiles/me/portfolio',
  },
  updatePortfolioItem: (id: string) => ({
    Key: ['jobseeker', 'portfolio', id, 'update'],
    endpoint: `/jobseeker-profiles/me/portfolio/${id}`,
  }),
  deletePortfolioItem: (id: string) => ({
    Key: ['jobseeker', 'portfolio', id, 'delete'],
    endpoint: `/jobseeker-profiles/me/portfolio/${id}`,
  }),
  updateJobPreferences: {
    Key: ['jobseeker', 'preferences', 'update'],
    endpoint: '/jobseeker-profiles/me/preferences',
  },
  getJobApplications: {
    Key: ['jobseeker', 'applications'],
    endpoint: '/jobseeker-profiles/me/applications',
  },
  getJobApplicationById: (id: string) => ({
    Key: ['jobseeker', 'applications', id],
    endpoint: `/jobseeker-profiles/me/applications/${id}`,
  }),
  applyToJob: {
    Key: ['jobseeker', 'applications', 'apply'],
    endpoint: '/jobseeker-profiles/me/applications',
  },
  withdrawApplication: (id: string) => ({
    Key: ['jobseeker', 'applications', id, 'withdraw'],
    endpoint: `/jobseeker-profiles/me/applications/${id}/withdraw`,
  }),
  getSavedJobs: {
    Key: ['jobseeker', 'saved-jobs'],
    endpoint: '/jobseeker-profiles/me/saved-jobs',
  },
  saveJob: {
    Key: ['jobseeker', 'saved-jobs', 'save'],
    endpoint: '/jobseeker-profiles/me/saved-jobs',
  },
  unsaveJob: (id: string) => ({
    Key: ['jobseeker', 'saved-jobs', id, 'unsave'],
    endpoint: `/jobseeker-profiles/me/saved-jobs/${id}`,
  }),
  uploadResume: {
    Key: ['jobseeker', 'resume', 'upload'],
    endpoint: '/jobseeker-profiles/me/resume',
  },
  deleteResume: {
    Key: ['jobseeker', 'resume', 'delete'],
    endpoint: '/jobseeker-profiles/me/resume',
  },
};

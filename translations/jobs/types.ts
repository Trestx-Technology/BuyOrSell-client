/**
 * Jobs translations type definitions
 */
export type JobsTranslations = {
  title: string;
  description: string;
  hero: {
    title: string;
    subtitle: string;
  };
  search: {
    typeLabel: string;
    findJob: string;
    findCandidates: string;
    jobPlaceholder: string;
    candidatePlaceholder: string;
    locationPlaceholder: string;
    noResults: string;
    searchButton: string;
  };
  industries: {
    title: string;
    jobsCount: string;
  };
  connect: {
    title: string;
    viewAll: string;
    notSpecified: string;
  };
  actions: {
    viewProfile: string;
    connect: string;
    connected: string;
    cancelRequest: string;
    resendRequest: string;
    pending: string;
    createProfile: string;
  };
  messages: {
    loginToConnect: string;
    alreadyConnected: string;
    requestIdNotFound: string;
    requestSent: string;
    requestCancelled: string;
    failedToSend: string;
    failedToCancel: string;
    createProfileToConnect: string;
    createProfileTitle: string;
    createProfileDescription: string;
  };
  tabs: {
    latestJobs: string;
    featuredJobs: string;
  };
  cta: {
    postJobTitle: string;
    postJobSubtitle: string;
    postJobButton: string;
    findJobButton: string;
  };
  applied: {
    title: string;
    description: string;
  };
  saved: {
    title: string;
    description: string;
  };
  jobseekers: {
    title: string;
    searchPlaceholder: string;
    noResults: string;
    loading: string;
    clearFilters: string;
    tryAgain: string;
    exp: string;
    in: string;
    workingIn: string;
    year: string;
    years: string;
    fresher: string;
    notSpecified: string;
    viewProfile: string;
    minExp: string;
    maxExp: string;
    minYears: string;
    maxYears: string;
    industry: string;
    selectIndustry: string;
    skills: string;
    selectSkills: string;
    desiredRoles: string;
    selectRoles: string;
    professional: string;
    uae: string;
    allCities: string;
  };
  listing: {
    loading: string;
    noResults: string;
    tryAdjusting: string;
    jobNotFound: string;
    loadingDetails: string;
  };
};

export type JobsTranslationNamespace = Record<string, JobsTranslations>;

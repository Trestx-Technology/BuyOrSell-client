import { User } from "./user.types";
import { Organization } from "./organization.types";
import { AD } from "./ad";
import { ConnectionStatus } from "./connection.types";
import { SubCategory } from "./categories.types";

export interface Professional {
  _id: string;
  userId: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  experienceYears: number;
  image?: string;
  isVerified?: boolean;
}

// Job Applicant - represents someone who applied to a job
export interface JobApplicant {
  _id: string;
  userId: string;
  jobId: string;
  user?: User;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "accepted"
    | "applied"
    | "hired";
  appliedAt?: string;
  coverLetter?: string;
  resumeUrl?: string;
  experience?: string;
  skills?: string[];
  expectedSalary?: number;
  availability?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  applicantProfileId?: {
    _id: string;
    userId: string;
    name?: string;
    nameAr?: string;
    headline?: string;
    headlineAr?: string;
    skills?: string[];
    experienceYears?: number;
    linkedinUrl?: string;
    [key: string]: unknown;
  };
  job?: {
    _id: string;
    title: string;
    owner?: {
      _id: string | null;
      name: string | null;
      email: string | null;
      phoneNumber: string | null;
    };
    organization?: unknown;
  };
}

// Job Application - the application data structure
export interface JobApplication {
  _id: string;
  jobId: string;
  userId: string;
  applicantProfileId?: string;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "accepted"
    | "applied"
    | "hired";
  appliedAt?: string;
  coverLetter?: string;
  resumeUrl?: string;
  experience?: string;
  skills?: string[];
  expectedSalary?: number;
  availability?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// MyAppliedJob - represents an application returned with job details
export interface MyAppliedJob {
  _id: string;
  userId: string;
  jobId: string;
  applicantProfileId: string;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "accepted"
    | "applied"
    | "hired";
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
  job?: JobData;
}

export interface MySavedJob {
  _id: string;
  jobSeekerObjectId: string;
  jobId: string;
  jobObjectId: string;
  job?: AD;
  createdAt: string;
  updatedAt: string;
}

// Jobseeker Link
export interface JobseekerLink {
  _id: string;
  label: string;
  labelAr?: string;
  url: string;
}

// Jobseeker Profile - extended user profile for jobseekers
export interface JobseekerProfile {
  _id: string;
  userId: string;
  name: string;
  nameAr?: string;
  headline: string;
  headlineAr?: string;
  skills: string[];
  skillsAr?: string[];
  experienceYears: number;
  education?: string;
  isFresher: boolean;
  workStatus?: string;
  workStatusAr?: string;
  location?: string;
  locationAr?: string;
  contactEmail?: string;
  contactPhone?: string;
  desiredRoles: string[];
  desiredRolesAr?: string[];
  availability?: string;
  availabilityAr?: string;
  noticePeriodDays?: number;
  salaryExpectationMin?: number;
  salaryExpectationMax?: number;
  currentCtc?: number;
  expectedCtc?: number;
  ctcCurrency?: string;
  preferredJobTypes: string[];
  preferredJobTypesAr?: string[];
  preferredShifts: string[];
  preferredShiftsAr?: string[];
  preferredLocations: string[];
  preferredLocationsAr?: string[];
  keywords: string[];
  keywordsAr?: string[];
  visibility: string;
  summary?: string;
  summaryAr?: string;
  blocked: boolean;
  banned: boolean;
  bannedReason?: string;
  blockedReason?: string;
  links: JobseekerLink[];
  experiences: JobseekerExperience[];
  educations: JobseekerEducation[];
  projects: JobseekerProject[];
  certifications: JobseekerCertification[];
  languages: JobseekerLanguage[];
  awards: JobseekerAward[];
  publications: JobseekerPublication[];
  photoUrl?: string;
  resumeFileUrl?: string;
  resumeText?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
  isConnected?: boolean;
  connectionStatus?: ConnectionStatus;
  connectionDirection?: string;
  requestId?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Jobseeker Experience (Work Experience)
export interface JobseekerExperience {
  _id: string;
  title: string;
  titleAr?: string;
  company: string;
  companyAr?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  locationAr?: string;
  description?: string;
  descriptionAr?: string;
  url?: string;
  employmentType?: string;
  employmentTypeAr?: string;
  department?: string;
  departmentAr?: string;
  jobType?: string;
  jobTypeAr?: string;
  noticePeriodDays?: number;
  currentCtc?: number;
  ctcCurrency?: string;
  servingNotice?: boolean;
  lastWorkingDay?: string | null;
  skills: string[];
  skillsAr?: string[];
}

// Legacy alias for backward compatibility
export interface WorkExperience extends JobseekerExperience {
  position?: string;
  current?: boolean;
  achievements?: string[];
}

// Jobseeker Education
export interface JobseekerEducation {
  _id: string;
  degree: string;
  degreeAr?: string;
  fieldOfStudy?: string;
  fieldOfStudyAr?: string;
  institution: string;
  institutionAr?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
  descriptionAr?: string;
  courseType?: string;
  courseTypeAr?: string;
  scoreType?: string;
  score?: number;
  yearOfPassing?: number;
  isCurrent: boolean;
}

// Legacy alias for backward compatibility
export interface Education extends JobseekerEducation {
  current?: boolean;
}

// Jobseeker Project
export interface JobseekerProject {
  _id: string;
  name: string;
  nameAr?: string;
  role?: string;
  roleAr?: string;
  startDate?: string;
  endDate?: string;
  url?: string;
  description?: string;
  descriptionAr?: string;
  techStack: string[];
  techStackAr?: string[];
  projectType?: string;
  teamSize?: number;
}

// Legacy alias for backward compatibility
export interface PortfolioItem extends JobseekerProject {}

// Jobseeker Language
export interface JobseekerLanguage {
  _id: string;
  name: string;
  proficiency: string;
  readLevel: number;
  writeLevel: number;
  speakLevel: number;
}

// Jobseeker Certification
export interface JobseekerCertification {
  _id: string;
  name: string;
  nameAr?: string;
  issuer?: string;
  issuerAr?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  url?: string;
  description?: string;
}

// Legacy alias for backward compatibility
export interface Certification extends JobseekerCertification {}

// Jobseeker Award
export interface JobseekerAward {
  _id: string;
  title: string;
  titleAr?: string;
  organization?: string;
  organizationAr?: string;
  issuer?: string;
  date?: string;
  issueDate?: string;
  description?: string;
  descriptionAr?: string;
  url?: string;
}

// Jobseeker Publication
export interface JobseekerPublication {
  _id: string;
  title: string;
  titleAr?: string;
  publisher?: string;
  publisherAr?: string;
  date?: string;
  publicationDate?: string;
  description?: string;
  descriptionAr?: string;
  url?: string;
}

// Legacy Skill type (skills are now just string arrays in the profile)
export interface Skill {
  _id?: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

// Employer Profile - extended organization profile for employers
export interface EmployerProfile extends Organization {
  // Job-related information
  totalJobsPosted?: number;
  activeJobs?: number;
  totalApplicants?: number;

  // Company culture
  companySize?: string;
  industry?: string;
  foundedYear?: number;
  companyDescription?: string;
  benefits?: string[];
  culture?: string[];

  // Reviews and ratings
  reviews?: EmployerReview[];
  averageRating?: number;
  totalReviews?: number;

  // Statistics
  totalEmployees?: number;
  openPositions?: number;
}

export interface EmployerReview {
  _id: string;
  employerId: string;
  userId: string;
  user?: User;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
  jobTitle?: string;
  employmentStatus?: "current" | "former";
  createdAt: string;
  updatedAt: string;
}

// Job data extracted from AD
export interface JobData {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  company?: string;
  organization?: Organization;
  owner?: User;
  category?: SubCategory;
  location?: string;
  jobType?: string;
  workMode?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  benefits?: string[];
  postedAt: string;
  expiresAt?: string;
  isFeatured?: boolean;
  isSaved?: boolean;
  views?: number;
  applicationsCount?: number;
  status: string;
  extraFields?: Record<string, unknown>;
}

// Helper type to transform AD to JobData
export type JobAd = AD & {
  adType: "JOB";
};

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface JobseekerProfileResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    profile: JobseekerProfile;
    profileCompletionPercentage?: number;
    appliedJobsCount?: number;
    savedJobsCount?: number;
    isConnected?: boolean;
    connectionStatus?: string | null;
    connectionDirection?: string | null;
    requestId?: string | null;
    similarJobs?: {
      page: number;
      limit: number;
      total: number;
      items: JobData[];
      profileMatched?: {
        desiredRoles?: string[];
        skills?: string[];
        preferredLocations?: string[];
        preferredJobTypes?: string[];
      };
    };
    featuredJobs?: {
      page: number;
      limit: number;
      total: number;
      items: JobData[];
    };
  };
}

export interface WorkExperienceResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: WorkExperience[];
}

export interface SingleWorkExperienceResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: WorkExperience;
}

export interface EducationResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Education[];
}

export interface SingleEducationResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Education;
}

export interface SkillsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Skill[];
}

export interface SingleSkillResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Skill;
}

export interface CertificationsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Certification[];
}

export interface SingleCertificationResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Certification;
}

export interface PortfolioResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: PortfolioItem[];
}

export interface SinglePortfolioItemResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: PortfolioItem;
}

export interface JobApplicationsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    page: number;
    limit: number;
    total: number;
    items: MyAppliedJob[];
  };
}

export interface SingleJobApplicationResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: MyAppliedJob;
}

export interface SavedJobsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ResumeUploadResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    resumeUrl: string;
  };
}

export interface DeleteResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

// Jobseeker Profiles Search Response
export interface JobseekerProfilesListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    page: number;
    limit: number;
    total: number;
    items: JobseekerProfile[];
  };
}

// ============================================================================
// API PAYLOAD TYPES
// ============================================================================

export interface UpdateJobseekerProfilePayload {
  professionalTitle?: string;
  currentCompany?: string;
  bio?: string;
}

export interface CreateWorkExperiencePayload {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
  achievements?: string[];
}

export interface UpdateWorkExperiencePayload extends Partial<CreateWorkExperiencePayload> {
  _id?: string;
}

export interface CreateEducationPayload {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
}

export interface UpdateEducationPayload extends Partial<CreateEducationPayload> {
  _id?: string;
}

export interface CreateSkillPayload {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

export interface UpdateSkillPayload extends Partial<CreateSkillPayload> {
  _id?: string;
}

export interface CreateCertificationPayload {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface UpdateCertificationPayload extends Partial<CreateCertificationPayload> {
  _id?: string;
}

export interface CreatePortfolioItemPayload {
  name: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  url?: string;
  description?: string;
  techStack?: string[];
  projectType?: string;
  teamSize?: number;
}

export interface UpdatePortfolioItemPayload extends Partial<CreatePortfolioItemPayload> {
  _id?: string;
}

export interface UpdateJobPreferencesPayload {
  jobType?: string[];
  workMode?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  preferredLocations?: string[];
  industries?: string[];
}

export interface ApplyToJobPayload {
  applicantProfileId: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface AcceptApplicationPayload {
  note?: string;
}

export interface RejectApplicationPayload {
  note?: string;
}

export interface UpdateApplicationStatusPayload {
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  note?: string;
}

export interface SimilarJobsParams {
  page?: number;
  limit?: number;
  status?: "active" | "archived";
  excludeApplied?: boolean;
}

export interface SaveJobPayload {
  jobId: string;
}

// ============================================================================
// JOB API RESPONSE TYPES
// ============================================================================

export interface JobsListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleJobResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobData;
}

export interface JobApplicantsListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    page: number;
    limit: number;
    total: number;
    items: JobApplicant[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleJobApplicantResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobApplicant;
}

// ============================================================================
// JOB API PAYLOAD TYPES
// ============================================================================

export interface CreateJobPayload {
  title: string;
  description: string;
  company?: string;
  organizationId?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  benefits?: string[];
  expiresAt?: string;
  isFeatured?: boolean;
  extraFields?: Record<string, unknown>;
  adType: "AD" | "JOB";
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  _id?: string;
}

export interface UpdateJobStatusPayload {
  status: "live" | "closed" | "draft" | "pending" | "rejected";
  reason?: string;
}

export interface UpdateApplicantStatusPayload {
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  notes?: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  organizationId?: string;
  isFeatured?: boolean;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface JobSearchParams {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobFilterPayload {
  filters: JobFilters;
}

// ============================================================================
// JOB HOME TYPES
// ============================================================================

export interface JobStatistics {
  savedJobs?: number;
  appliedJobs?: number;
  shortlistedJobs?: number;
  rejectedJobs?: number;
  profileCompletion?: number;
  lastUpdated?: string;
  appliedJobsCount?: number;
  savedJobsCount?: number;
  profileCompletionPercentage?: number;
  recommendedJobsCount?: number;
}

export interface JobHomeData {
  userProfile?: JobseekerProfile | null;
  statistics?: {
    appliedJobsCount: number;
    savedJobsCount: number;
    profileCompletionPercentage: number;
    recommendedJobsCount: number;
  };
  featuredJobs?: {
    jobs: JobData[];
    count: number;
  };
  latestJobs?: {
    jobs: JobData[];
    count: number;
  };
  recommendedJobs?: JobData[];
  popularIndustries?: Array<{
    id?: string;
    name?: string;
    jobCount?: number;
    logoUrl?: string;
    [key: string]: unknown;
  }>;
  professionals?: Professional[];
  companiesToFollow?: Organization[];
  topEmployers?: Organization[];
  // Legacy fields for backward compatibility
  jobStatistics?: JobStatistics;
  similarJobs?: JobData[];
}

export interface JobHomeResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobHomeData;
}

export interface JobHomeParams {
  userId?: string;
  device?: "mobile" | "desktop";
}

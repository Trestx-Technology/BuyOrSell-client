// Job-related TypeScript interfaces

import { User } from './user.types';
import { Organization } from './organization.types';
import { AD } from './ad';

// Job Applicant - represents someone who applied to a job
export interface JobApplicant {
  _id: string;
  userId: string;
  jobId: string;
  user?: User;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
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

// Job Application - the application data structure
export interface JobApplication {
  _id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
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

// Jobseeker Profile - extended user profile for jobseekers
export interface JobseekerProfile extends User {
  // Professional information
  professionalTitle?: string;
  currentCompany?: string;
  bio?: string;
  resumeUrl?: string;
  
  // Work experience
  workExperience?: WorkExperience[];
  
  // Education
  education?: Education[];
  
  // Skills and certifications
  skills?: Skill[];
  certifications?: Certification[];
  
  // Portfolio
  portfolio?: PortfolioItem[];
  
  // Job preferences
  jobPreferences?: {
    jobType?: string[];
    workMode?: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
    preferredLocations?: string[];
    industries?: string[];
  };
  
  // Statistics
  profileCompletion?: number;
  lastUpdated?: string;
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
  achievements?: string[];
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
}

export interface Skill {
  _id?: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface Certification {
  _id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface PortfolioItem {
  _id?: string;
  title: string;
  description?: string;
  projectUrl?: string;
  imageUrl?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
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
  employmentStatus?: 'current' | 'former';
  createdAt: string;
  updatedAt: string;
}

// Job data extracted from AD
export interface JobData {
  _id: string;
  title: string;
  description: string;
  company?: string;
  organization?: Organization;
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
  views?: number;
  applicationsCount?: number;
  status: string;
  extraFields?: Record<string, unknown>;
}

// Helper type to transform AD to JobData
export type JobAd = AD & {
  adType: 'JOB';
};

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface JobseekerProfileResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobseekerProfile;
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
  data: JobApplication[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleJobApplicationResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: JobApplication;
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
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
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
  title: string;
  description?: string;
  projectUrl?: string;
  imageUrl?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
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
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
  experience?: string;
  skills?: string[];
  expectedSalary?: number;
  availability?: string;
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
  data: JobApplicant[];
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
  status: 'live' | 'closed' | 'draft' | 'pending' | 'rejected';
  reason?: string;
}

export interface UpdateApplicantStatusPayload {
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
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
  sortOrder?: 'asc' | 'desc';
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
  professionals?: User[];
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
  device?: 'mobile' | 'desktop';
}


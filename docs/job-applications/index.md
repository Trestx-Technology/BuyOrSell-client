# Job Application Logic & Profile Requirements

This document details the workflow for applying to jobs and the mandatory profile requirements for job seekers.

## 1. Job Seeker Profile Requirement

To apply for a job, a user **must** have a registered **Job Seeker Profile**.

- The system checks for the existence of a profile via the `useGetJobseekerProfile` hook.
- **Why?**: Recruiters need structured data (Experience, Education, Skills) to evaluate candidates. A standard user account does not contain these details.
- **Mandatory Fields**: Typically include a resume/CV, work history, and contact information.

## 2. Application Flow

### Step 1: Eligibility Check

When a user clicks "Apply", the system verifies:

1. **Authentication**: User must be logged in.
2. **Profile Check**: Does the user have a `job-seeker` role/profile? If not, they are redirected to create one.

### Step 2: Submission

- **Hook**: `useApplyToJob`.
- **Payload**: Includes the `jobId` and the user's specific application data (often a cover letter or specific answers requested by the employer).
- **Redundancy**: The system prevents multiple applications to the same job by checking existing entries in the specific job's applicant list.

### Step 3: Tracking

- Users can track their status via "My Applications" (`useGetMyApplications`).
- **Statuses**: `pending` -> `reviewed` -> `shortlisted` -> `accepted`/`rejected`.

## 3. Recruiter Perspective

- Recruiters view applicants via `useGetJobApplicants(jobId)`.
- They can move candidates through the pipeline using `useUpdateApplicationStatus`.
- Accepting or rejecting an application triggers the respective mutations (`useAcceptApplication` / `useRejectApplication`).

## 4. Technical Stack

- **API Layer**: `app/api/job-applications/job-applications.services.ts`
- **Hook Layer**: `hooks/useJobApplications.ts`
- **Profile Layer**: `hooks/useJobseeker.ts` (Handles profile creation/parsing from resumes).

# Job Posting Logic & Flow

This document details the complete end-to-end flow of posting a job vacancy on the BuyOrSell platform, highlighting the differences from the standard ad posting flow.

## Job Posting Lifecycle

The job posting process is a multi-step flow that mirrors the ad posting structure but enforces business-specific constraints.

### 1. Step 1: Category Selection

- **Route**: `/[locale]/post-job/select`
- **Component**: `SelectCategoryContent`
- **Logic**:
  - Users navigate through a job-specific category tree.
  - The `useAdPostingStore` tracks the selection path.
  - Selecting a "Leaf" category redirects the user to the job details page.

### 2. Step 2: Form Initialization

- **Route**: `/[locale]/post-job/details/[leafCategoryId]`
- **Component**: `JobLeafCategoryContent`
- **Hydration**:
  - Similar to ads, if a user arrives via "AI Job Generation", the `prompt` is used to hydrate the description.
- **Dynamic Schema**:
  - The `createPostJobSchema(category)` utility generates a Zod schema tailored for job vacancies.

### 3. Step 3: Job-Specific Information Entry

The form contains sections tailored for recruitment:

#### A. Organization (Mandatory)

- **Constraint**: Unlike standard ads, jobs **must** be posted on behalf of a verified organization.
- **UI**: The "Post as Individual" option is disabled in the `JobLeafCategoryContent` flow.

#### B. Core Job Details

- **Job Title & Description**: Manual or AI-assisted.
- **Salary Range**: Includes mandatory `minSalary` and `maxSalary` fields (in AED).
- **Employment Type**: `jobMode` (On-site, Remote, Hybrid) and `jobShift` (Day, Night, Rotational) are required selectors.

#### C. Media & Location

- **Images/Video**: Unlike standard ads, job postings currently default to **no images or videos** (empty arrays in payload).
- **Location**: `MapComponent` is used to pinpoint the workplace address or headquarters.

#### D. Connection Types

- Defines how candidates should reach out: `call`, `chat`, or `whatsapp`.

### 4. Step 4: Eligibility & Validation

- **Zod Validation**: Validates salary ranges (must be positive) and employment details.
- **Job Availability**: Uses the `useAdAvailability` hook.
  - It specifically checks for plans with `type: "JOB"`.
  - Also includes **Basic (Free)** plans as fallback slots, as they cover both Ads and Jobs.

### 5. Step 5: Submission & Success

- **Mutation**: `useCreateAd` is reused with the `adType: "JOB"` flag.
- **Payload Differences**:
  - `price` is set to `0`.
  - `images` and `videoUrl` are omitted/empty.
  - Includes `minSalary`, `maxSalary`, `jobMode`, and `jobShift`.
- **Final Step**: Upon success, redirects to the `/[locale]/success?id=...` page.

---

## Technical Differences from Ad Posting

- **Component**: Uses `JobLeafCategoryContent` instead of `LeafCategoryContent`.
- **Validation**: Uses `createPostJobSchema` which includes salary and employment mode validations.
- **Constraint**: Strict enforcement of `organizationId`.
- **Media**: Restricted media uploads compared to standard ads.

## Posting Statuses

- **`idle`**: User filling the form.
- **`loading`**: Data being submitted.
- **`success`**: Job created, redirecting to success page.
- **`error`**: Submission failed (e.g., failed eligibility check or server error).

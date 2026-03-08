# Organization Logic & Flow

This document explains the organization management system, which is a prerequisite for professional job postings and business-level interactions.

## Overview

Organizations represent businesses, recruitment agencies, or entities on the platform. They are required for posting jobs and can be followed by users.

## 1. Requirement for Job Posting

A core constraint in the system is that **jobs must be tied to an organization**.

- In the `JobLeafCategoryContent.tsx` form, the option to "Post as Individual" is disabled.
- Users must select an organization they own or manage to proceed with a job post.
- This ensures accountability and builds trust for job seekers.

## 2. Organization Lifecycle

### Registration & Verification

1. **Creation**: Users create a profile via `useCreateOrganization`.
2. **Submission**: Once details are filled, the organization is submitted for review (`useSubmitOrganization`).
3. **Admin Review**: Admins can approve (`useApproveOrganization`) or reject (`useRejectOrganization`) based on verification documents.
4. **Status**: An organization can be `pending`, `verified`, or `rejected`. Only verified organizations appear with the "Verified" badge.

### Management

- Users can manage their own entities via `useMyOrganization`.
- Organizations can be blocked by admins in case of policy violations (`useBlockOrganization`).

## 3. Social Interaction

- **Following**: Users can follow organizations to receive updates (`useFollowOrganization`).
- **Followers List**: Organizations can see their growth via `useFollowers` and `useFollowersCount`.

## 4. Technical Implementation

- **API Layer**: `app/api/organization/organization.services.ts`
- **Hooks**: `hooks/useOrganizations.ts`
- **State**: The `organizationId` is a required field in the `PostAdPayload` when `adType` is `"JOB"`.

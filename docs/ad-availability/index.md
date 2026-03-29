# Subscription & Ad Availability Logic

This document explains the logic behind subscription management, ad/job posting, featuring, and renewal availability checks in the BuyOrSell platform.

## Overview

The platform uses a subscription-based model where users purchase plans that grant them a certain number of ad postings, featured ads, and AI-powered assists. Availability checks ensure users operate within their plan limits across three main flows: **Posting**, **Featuring**, and **Renewing**.

## 1. Subscription Matching Logic (`utils/subscription-match.ts`)

Centralized logic in `utils/subscription-match.ts` determines if a subscription covers a specific category by prioritizing unique IDs over string names.

### Matching Rules (In Priority Order):
1.  **Rule #0: ID-Based Matching**: If the target category's `_id` exists in the plan's `categories` array, it is a **Guaranteed Match**. This handles complex categories like "Business & Industrial" without naming conflicts.
2.  **Wildcard Plans**: Plans with type `"basic"` or `"ads"`, or marked as `isDefault`, match **all** categories.
3.  **Legacy Text Matching**: If no ID match is found, the plan's `type` is compared against the target category name (case-insensitive).

---

## 2. Ad Posting Availability (`useAdAvailability.ts`)

Used during the `Post Ad` flow to verify the user can create a new listing.

### The `checkAvailability` Flow:
1.  **System Check**: Checks if any paid plans exist in the system for this category. If none exist, posting is free (bypass) **provided the user has at least one active subscription**.
2.  **Plan Match**: Filters active subscriptions using both `categoryName` and `categoryId`. **ID matching is tried first**.
3.  **Credit Check**: Sums available credits across matching plans.
4.  **Mode Resolution**:
    *   `no_plans`: No valid plan exists.
    *   `insufficient`: Plans exist but 0 credits remain.
    *   `selection`: Multiple valid plans found, or user only has a Basic plan (prompting a better choice).

---

## 3. Featured Ad Availability (`useFeatureAdAvailability.ts`)

Used when a user clicks "Feature" on an existing ad.

### Logic Flow:
1.  **Credit Check**: Finds a matching subscription with `featuredAdsAvailable > 0`.
2.  **Modes**:
    *   **`has_credits`**: Matching credits found. Shows `FeatureConfirmDialog` (Free, uses credit).
    *   **`no_featured_credits`**: No plan covers the ad OR all featured credits consumed. Shows `FeatureAdDialog` (Pay fee to feature).

---

## 4. Ad Renewal Availability (`useRenewAdAvailability.ts`)

Used when a user clicks "Renew" on an existing ad to extend its validity.

### Logic Flow:
1.  **System Check**: Verifies if the category requires a plan to exist.
2.  **Matching Check**: Filters subscriptions valid for the ad's category.
3.  **Modes**:
    *   `no_plans`: User has no valid plan covering this ad. Shows `NoActivePlansDialog`.
    *   `insufficient`: Matching plan found but 0 ad credits remain. Shows `InsufficientAdsDialog`.
    *   `select_plan`: Multiple valid subscriptions found with credits. Shows `PlanSelectionDialog`.
    *   `has_credits`: Exactly one valid subscription with credits found. Shows `RenewAdDialog`.

---

## 5. Availability Dialog System

The platform uses a unified set of dialogs to handle these states:

| Mode | Component | Usage | Action |
| :--- | :--- | :--- | :--- |
| `no_plans` | `NoActivePlansDialog` | Posting / Renewing | Redirects to plans page. |
| `insufficient` | `InsufficientAdsDialog` | Posting / Renewing | Prompts to upgrade or pay single fee. |
| `selection` / `select_plan` | `PlanSelectionDialog` | Posting / Renewing | Allows manual subscription selection. |
| `no_featured_credits` | `FeatureAdDialog` | Featuring | Pay a flat fee (e.g., 2 AED) to feature. |
| `has_credits` | `FeatureConfirmDialog` | Featuring | Confirm using a plan credit for free. |
| `has_credits` | `RenewAdDialog` | Renewing | Choose duration (30/60/90 days) and confirm. |

---

## 6. Implementation Notes

- **Category Mapping**: During Renewal and Featuring, the system detects the "Plan Type" by looking at `ad.relatedCategories[0]`. If missing, it falls back to keyword detection in `ad.category.name`.
- **isFeatured Auto-Tagging**: During initial posting, if a user selects a **Premium** plan that has featured credits available, the ad is automatically marked as `isFeatured: true`.
- **Payloads**: Both Featuring and Renewing mutations now require a `subscriptionId` to ensure credits are deducted from the correct user plan.
- **Unified Hook**: The `useAdSubscription` hook is the single entry point for all Posting and Renewal availability state management.

---

## Related Documentation

- For the end-to-end ad posting workflow involving these checks, see: [Ad Posting Logic & Flow](../ad-posting/index.md)

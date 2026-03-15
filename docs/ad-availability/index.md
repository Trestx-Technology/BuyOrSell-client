# Subscription & Ad Availability Logic

This document explains the logic behind subscription management and ad/job availability checks in the BuyOrSell platform.

## Overview

The platform uses a subscription-based model where users purchase plans that grant them a certain number of ad postings, featured ads, and AI-powered assists.

## 1. Subscription Management

### Core Components

- **`useSubscriptionStore`**: React state management (Zustand) for fetching and filtering user subscriptions.
- **`Subscription` Interface**: Defines the structure of a user's active plan, including:
  - `addsAvailable`: Total postings allowed.
  - `adsUsed`: Postings already consumed.
  - `featuredAdsAvailable`: Total featured slots allowed.
  - `featuredAdsUsed`: Featured slots consumed.
  - `categories`: The categories this plan applies to (e.g., "Properties", "Motors").

### Active Subscription Logic

A subscription is considered active if:

1. `isActive` is true.
2. The current date is within the `startDate` and `endDate` (validation period).

---

## 2. Ad Availability Logic (`useAdAvailability.ts`)

Before a user can post an ad or a job, the system performs an availability check to ensure they have remaining slots in their plan.

### Category-Based Filtering

Plans can be generic or category-specific. The check handles hierarchical categories:

- **Default/Universal Plans**: If `plan.categories` is empty, it applies to all categories of that type.
- **Basic (Free) Plan**: Plans with `type: 'basic'` or `isDefault: true` are treated as multi-purpose. They cover **both** Ads and Jobs across all categories, with a shared limit (typically 5 postings in total). The availability logic automatically includes these plans regardless of whether the user is posting an ad or a job.
- **Property/Motor Plans**: Specific logic handles broad categories like "Properties for Sale" or "Motors" to cover their respective sub-categories.

### Availability Calculation

The total available slots are calculated by iterating through all active subscriptions that match the target category:

```typescript
normalAvailableTotal += Math.max(
  0,
  (sub.addsAvailable || 0) - (sub.adsUsed || 0),
);
featuredAvailableTotal += Math.max(
  0,
  (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0),
);
```

### The `checkAvailability` Flow

1. **Bypass Check**: If no plans exist in the database for the given category/type, the user is allowed to post for free (bypass) **ONLY if they have at least one active subscription**.
   - If a user has **0 active subscriptions**, they are blocked and prompted to get a plan (even the free Basic plan), regardless of whether plans exist for that category.
2. **Featured Post**: Checks `featuredAvailableTotal > 0`.
3. **Normal Post**: Checks `normalAvailableTotal > 0`.
4. **Dialog Trigger**: If no slots are available or no subscription is found, the `InsufficientAdsDialog` is triggered. It shows a specific "Subscription Required" message if the user is completely unsubscribed.

---

## 3. Job Posting Logic

Job postings follow a similar logic to ads but are typically mapped to a specific "Jobs" plan type within the subscription system.

## 4. Collection Manager

The Collection Manager handles the grouping of ads into curated sets.

- **Logic**: Aggregates ads based on user-defined labels or system-generated criteria.
- **Access Control**: Users can only manage collections belonging to their UID.

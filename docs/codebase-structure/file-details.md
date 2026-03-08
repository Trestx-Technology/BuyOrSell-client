# Comprehensive File & Folder Guide

This document provides a deep dive into the specific files within each directory of the BuyOrSell project.

## 1. `app/` - The Application Core

### `app/api/` (Domain Services)

This directory is organized into domain-specific folders. Every folder typically contains:

- **`index.ts`**: Defines the `QueryKeys` and API endpoints for that domain. It's the "source of truth" for React Query keys.
- **`*.services.ts`**: Implements the actual Axios HTTP calls (GET, POST, etc.) for that domain.
  - _Example (`app/api/plans/`)_: `plan.services.ts` handles fetching plans and activating subscriptions.

### `app/[locale]/(root)/` (Main Views)

Folders here represent the public-facing pages of the app.

- **`page.tsx`**: The main entry point for the route.
- **`layout.tsx`**: Route-specific layouts (e.g., ensuring a sidebar is consistent across user pages).
- **`_components/`**: Private components used _only_ within this specific page/route to keep the code modular.
  - _Key Folders_: `post-ad/`, `post-job/`, `plans/`, `chat/`, `organizations/`.

---

## 2. `components/` - UI Library

### `components/ui/` (Atomic Components)

Based on Shadcn/UI. These are high-performance, accessible primitives.

- **`button.tsx`**: Standard button with multiple variants (ghost, purple, outline).
- **`responsive-modal.tsx`**: A hybrid component that acts as a dialog on desktop and a drawer on mobile.
- **`typography.tsx`**: The design system's unified font engine.

### `components/features/` (Feature Blocks)

- **`ai-searchbar/`**: Contains the logic and UI for the smart search bar.
- **`category-nav/`**: Handles the category selection menu.

### `components/global/` (Foundational UI)

- **`Navbar.tsx` & `Footer.tsx`**: Global navigation.
- **`MobileStickyHeader.tsx`**: The header that stays fixed at the top on mobile views.
- **`NoCreditsDialog.tsx`**: Shared modal for AI token top-up prompts.

---

## 3. `hooks/` - Data & Business Logic

Hooks are the bridge between the API services and the UI.

- **`useAds.ts`**: Hooks for creating, fetching, and managing listings.
- **`useSubscriptions.ts`**: Logic for checking user plans and active subscriptions.
- **`useAdAvailability.ts`**: Complex logic to determine if a user can post based on their plan.
- **`useLocale.ts`**: Helper for managing i18n paths and translations.
- **`useAITokens.ts`**: Managing token balance and consumption.

---

## 4. `stores/` - Global State (Zustand)

- **`authStore.ts`**: Manages the current user session, token storage, and login/logout flows.
- **`subscriptionStore.ts`**: Stores the user's active plans to avoid redundant API calls.
- **`adPostingStore.ts`**: Keeps track of the user's progress through the multi-step posting form.
- **`emirateStore.ts`**: Manages the selected region/state filter globally.

---

## 5. `interfaces/` - Type Definitions

- **`ad.types.ts`**: Interfaces for Ads, Payloads, and API responses.
- **`plan.types.ts`**: Defines the `IPlan` structure (validation, pricing, features).
- **`category.types.ts`**: Complex types for dynamic form fields and category hierarchies.

---

## 6. `schemas/` - Validations (Zod)

- **`post-ad.schema.ts`**: Defines strict validation rules for the ad/job creation forms.
- **`auth.schema.ts`**: Rules for login and registration forms.

---

## 7. `utils/` - Shared Helpers

- **`axios-instance.ts`**: Configured Axios client.
- **`slug-utils.ts`**: Converts titles to URL-friendly slugs.
- **`formatters.ts`**: Logic for date formatting, currency strings, and number shortening.

---

## 8. Root Config Files

- **`proxy.ts`**: Development middleware used to handle cross-origin requests or routing bypasses.
- **`next.config.ts`**: Next.js compiler settings, image domain allowances, and rewrites.
- **`tailwind.config.ts`**: The "source of truth" for the design system (colors, spacing, animations).
- **`i18n.ts` & `middleware.ts`**: Core logic for internationalization and route protection.

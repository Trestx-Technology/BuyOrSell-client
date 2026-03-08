# Codebase Structure & Architecture

This document provides a comprehensive overview of the BuyOrSell project's folder structure, architectural patterns, and file organization.

## Directory Tree

```text
BuyOrSell-client/
├── app/                  # Next.js App Router (Pages, Layouts, API Services)
├── components/           # Reusable UI components & Feature blocks
├── constants/            # Global constants, icons, & system config
├── docs/                 # Developer-focused documentation (Feature logic)
├── hooks/                # Custom React hooks (React Query & State)
├── infra/                # Infrastructure & Deployment scripts
├── interfaces/           # TypeScript Types & Interfaces
├── lib/                  # Core library configurations (Axios, Lucide)
├── public/               # Static assets (Logos, Images, SVGs)
├── schemas/              # Zod validation schemas
├── services/             # Core API clients & External integrations
├── stores/               # Zustand global state management
├── styles/               # Global CSS & Design System tokens
├── translations/         # i18n localization files (JSON)
├── utils/                # Helper functions & utilities
└── package.json          # Project dependencies & scripts
```

---

## 📂 Core Directories Explained

### 1. `app/` (The Routing Engine)

This is the heart of the Next.js application.

- **`[locale]/`**: Implements folder-based internationalization (i18n). Pages are nested here (e.g., `(root)/plans`).
- **`api/`**: Contains the service layer organized by domain.
  - Each folder (e.g., `app/api/plans/`) typically contains `index.ts` (Query Keys) and `*.services.ts` (Axios calls).
- **`(root)/`**: A route group used for the main application layout.

### 2. `components/` (The UI System)

Components are organized by their scope and reuse level:

- **`ui/`**: Base primitive components (Buttons, Inputs, Modals) powered by Shadcn/UI patterns.
- **`global/`**: Layout-level components like `Navbar`, `Footer`, and `MobileStickyHeader`.
- **`features/`**: Complex blocks that include business logic (e.g., `ai-searchbar`).
- **`typography/`**: Centralized typography system for consistent font styles.

### 3. `hooks/` (Data & State Lifecycle)

- **React Query Hooks**: Prefixed with `use` (e.g., `usePlans.ts`, `useAds.ts`). These wrap the API services from `app/api/` to provide caching and loading states.
- **Custom Hooks**: specialized logic like `useLocale.ts` or `useAdAvailability.ts`.

### 4. `interfaces/` (Type Safety)

Centralized TypeScript definitions.

- Files match the domain (e.g., `plan.types.ts`, `ad.types.ts`).
- Ensures end-to-end type safety from the API responses to the UI components.

### 5. `stores/` (Global State)

Uses **Zustand** for lightweight global state management.

- **`authStore.ts`**: Manages user sessions and authentication status.
- **`subscriptionStore.ts`**: Tracks active user plans and usage.
- **`adPostingStore.ts`**: Manages the multi-step state of the post-ad flow.

### 6. `lib/` & `services/` (External Integration)

- **`lib/axios-instance.ts`**: Configured Axios client with interceptors for auth tokens and base URLs.
- **`services/ai-service.ts`**: Direct integrations with external providers like OpenAI.

### 7. `translations/` (Localization)

Contains JSON files for multiple languages (e.g., `en.json`, `ar.json`).

- Features are nested as keys (e.g., `t.home.navbar.title`).

---

## 🏗️ Architectural Patterns

### Service-Hook Pattern

The project strictly follows a **Service -> Hook -> Component** flow:

1. **Service**: `app/api/ad/ad.services.ts` defines the raw HTTP request.
2. **Hook**: `hooks/useAds.ts` wraps the service in a `useQuery` or `useMutation`.
3. **Component**: UI consumes the hook, using `isLoading`, `data`, and `error` states.

### Persistence

- Sensitive state (Auth) is persisted in `localStorage`.
- Transient flow state (Post Ad) is often kept in `sessionStorage` or just Zustand memory to prevent stale data.

### Styling

The project uses **Tailwind CSS** with a customized design system defined in `styles/globals.css` and `tailwind.config.ts`. Premium aesthetics are maintained via custom color palettes like `purple` and `emerald`.

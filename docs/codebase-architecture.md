# 🏗️ Master Codebase Architecture

This document provides a holistic view of the BuyOrSell platform's architecture, combining high-level design patterns with a detailed breakdown of the physical folder structure and their responsibilities.

---

## 🗺️ Holistic Architecture Map

The application is built on a **Modular Layered Architecture**. Each domain is isolated at the service/logic level but shares a unified UI and state foundation.

### 🔌 1. The Data & Network Layer
- **Central API Client**: Located in `services/axios-api-client.ts`. It handles base URLs, request timeouts, and global interceptors for auth tokens and region context.
- **Service Layer**: Defined in `app/api/`. Contains pure functions that map 1:1 with backend endpoints.
- **Server Actions**: Located in `actions/` and `lib/ai-actions.ts`. Used for secure operations like cookie management or external AI model calls.

### 🧠 2. The Logic & State Layer
- **Server State (React Query)**: Custom hooks in `hooks/` manage server-side data fetching, caching, and background synchronization.
- **Global Client State (Zustand)**: Stores in `stores/` manage transient application states (Auth, Ad Posting flow, etc.).
- **Business Validations**: Files in `validations/` encapsulate complex business rules (e.g., category-specific field requirements).

### 🖥️ 3. The UI & Presentation Layer
- **App Router**: Organized in `app/[locale]/`. Uses route groups `(root)` for layout consistency and locale-based segmenting.
- **Atomic UI**: `components/ui/` contains primitive Shadcn/UI components.
- **Feature Blocks**: `components/features/` and `components/global/` bridge UI with business logic.

---

## 🔄 Core Flow: The "Life of a User Action"

*Example: Post an Ad with AI*
1. **User Interaction**: User uploads an image in the UI.
2. **Server Action**: `identifyCategory` analyzes the image via OpenAI.
3. **Internal API Call**: Server Action calls the semantic search service to map results.
4. **State Sync**: `adPostingStore` (Zustand) is updated with the identified category.
5. **Redirection**: User is navigated to the dynamic form.
6. **Form Validation**: Zod schemas and business validations check inputs.
7. **Final Submission**: A React Query mutation sends the payload via the Axios client.

---

## 📂 Directory Breakdown & Responsibility

### 🧱 Core Directories

| Folder | Responsibility |
|:---|:---|
| `actions/` | Next.js **Server Actions**. Used for operations that must run on the server (e.g., setting cookies, secure API calls). |
| `app/` | The heart of the app. Contains the **App Router** (`[locale]`) and the **Service Layer** (`api`). |
| `app/api/` | Organized by domain (e.g., `ads`, `auth`). Each contains `index.ts` (query keys) and `*.services.ts` (raw axios calls). |
| `components/` | All UI components, categorized by their complexity and reuse level. |
| `components/ui/` | **Atomic Primitives** (Buttons, Inputs, Dialogs). Based on Shadcn/UI. Zero business logic. |
| `components/global/` | **Layout Blocks** used across multiple pages (Navbar, Footer, Sidebar, Carousels). |
| `components/features/` | **Logic-Heavy Components** tied to specific features (e.g., `ai-searchbar`, `chat-window`). |
| `components/layouts/` | **Container Components** that define the grid, width, and spacing constraints for pages. |
| `constants/` | Global static data, Enums, hardcoded IDs, and system-wide configurations (e.g., `routes.constants.ts`). |
| `docs/` | Technical documentation and architectural guides (like this one). |
| `hooks/` | **Domain Logic**. Primarily TanStack Query hooks that wrap services to provide server-state to the UI. |
| `interfaces/` | **Type Definitions**. Centralized TypeScript interfaces to ensure end-to-end type safety. |
| `lib/` | **Third-Party Configs**. Initializations for Firebase, OpenAI wrappers, i18n middleware, and shared utilities. |
| `public/` | **Static Assets**. Site icons, local images, and SVGs. |
| `schemas/` | **Validation Schemas**. Zod-based definitions used for form validation and data parsing. |
| `services/` | **Infrastructure**. The base Axios client, structured logger (Pino), and cookie/storage management. |
| `stores/` | **Global State**. Zustand stores for client-side state persistence (Auth, Subscription tracking). |
| `styles/` | **Design Tokens**. Global CSS, Tailwind layers, and design variables (colors, shadows). |
| `translations/` | **Localization Assets**. JSON files for translation strings in English and Arabic. |
| `utils/` | **Helpers**. Pure, stateless functions for formatting dates, currency, and data transformation. |
| `validations/` | **Business Logic**. Complex validation rules that extend beyond simple schema checks. |

---

## 🌲 Physical Structure Visualization

```text
BuyOrSell-client/
├── actions/              # Server Actions (Cookies, Secure API)
├── app/                  # Routing & Service layer
│   ├── api/              # Domain-specific Services (Ads, Auth, Plans...)
│   └── [locale]/         # Internationalized Pages & Layouts
├── components/           # UI System
│   ├── ui/               # Base primitives (Shadcn/UI)
│   ├── global/           # Layout blocks (Navbar, Footer)
│   ├── features/         # Feature logic blocks
│   └── layouts/          # Container components
├── constants/            # Global Enums & Config
├── docs/                 # Technical documentation
├── hooks/                # Server-state hooks (React Query)
├── interfaces/           # TS Types & Interfaces
├── lib/                  # Library wrappers (AI, Firebase)
├── schemas/              # Zod validation schemas
├── services/             # Core infrastructure (Axios, Logger)
├── stores/               # Client-state (Zustand)
├── styles/               # Design system & CSS
├── translations/         # i18n (EN/AR)
├── utils/                # Pure helper functions
└── validations/          # Domain-specific business logic
```

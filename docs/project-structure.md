# 📂 Project Structure

The BuyOrSell codebase follows a clean, module-based architecture designed for scalability and maintainability.

## Root Directory Map

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router (Pages, Layouts, and API route structure). |
| `components/` | Reusable UI components (UI primitives, Global layout, Feature blocks). |
| `constants/` | System-wide static data, configuration, icons, and route maps. |
| `docs/` | Technical documentation and feature-specific logic guides. |
| `hooks/` | Custom React hooks (React Query integrations and shared logic). |
| `interfaces/` | Centralized TypeScript types and interfaces for the entire project. |
| `lib/` | Third-party library configurations and server-side utilities. |
| `public/` | Static assets such as logos, images, and SVGs. |
| `schemas/` | Zod validation schemas for forms and API payloads. |
| `services/` | Core system services (Logging, API Client, Google Maps). |
| `stores/` | Zustand stores for global client-side state management. |
| `styles/` | Global CSS, design tokens, and Tailwind configuration. |
| `translations/` | Localization JSON files (English & Arabic support). |
| `utils/` | Shared helper functions, formatters, and small utilities. |
| `validations/` | Business-logic specific validation hunters and rules. |

## Key Directories Breakdown

### `app/` (Next.js App Router)
- **`[locale]/`**: Implements folder-based internationalization.
- **`(root)/`**: Main application route group sharing the core layout.
- **`api/`**: **Note**: In this project, `app/api/` is used to organize **client-side service definitions** mapped to backend endpoints, not necessarily local API routes.

### `components/`
- **`ui/`**: Atomic components (Buttons, Inputs) powered by Shadcn/UI.
- **`global/`**: Layout-level components (Navbar, Footer, Carousels).
- **`layouts/`**: Container components for consistent grid and spacing.

### `hooks/`
- **`useAds.ts`, `useAuth.ts`, etc.**: These are TanStack Query hooks that keep the UI state in sync with the backend.

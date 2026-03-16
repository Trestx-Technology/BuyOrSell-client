# 🧱 Core Architecture Blocks

These directories house the essential logic and configuration that support the entire application.

## 🛠️ Utilities (`utils/`)
Pure, stateless helper functions used across components.
- **Formatting**: Currency, date, and string manipulation.
- **Data**: Array filtering, object cleaning, and local storage wrappers.
- **File**: Image resizing and MIME type checks.

## 🏪 Global Stores (`stores/`)
Built with **Zustand** for predictable client-side state management.
- `authStore`: User session, tokens, and profile data.
- `adPostingStore`: Temporary state for the multi-step ad creation flow.
- `subscriptionStore`: Tracks usage limits and plan benefits.

## 🎨 Styling (`styles/`)
Centralized design system management.
- `globals.css`: Contains the theme variables, Tailwind layers, and custom glassmorphism/animation utilities.
- Uses **Tailwind CSS 4** for a utility-first styling approach.

## ⚙️ Core Services (`services/`)
External integrations and system-level utilities.
- `axios-api-client.ts`: Configures the base API client with interceptors for auth and error handling.
- `logger.ts`: Centralized Pino logger for structured logs.
- `cookie-service.ts`: Client-side management of secure cookies.

## 📄 Validation Schemas (`schemas/`)
Centralized **Zod** definitions.
- **Form Schemas**: Defines the structure and error messages for every form in the app (Login, Ad Posting, Profile update).
- Ensures that data is validated on the client before it ever hits the network.

## ⚖️ Business Validations (`validations/`)
Complex logic that goes beyond simple schema checks.
- Ad posting eligibility rules.
- Category-specific field requirements.
- Job application validation logic.

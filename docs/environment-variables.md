# 🌐 Environment Variables

This project requires several environment variables for local development and production. Create a `.env.local` file in the root directory.

## Core API
- `NEXT_PUBLIC_BACKEND_URL`: The base URL for the BuyOrSell Backend API.
- `NEXT_PUBLIC_SITE_URL`: The frontend site URL (used for canonical links and SEO).

## AI Integration (OpenAI)
- `OPENAI_API_KEY`: Secret key for OpenAI services (Server-side only).
- `OPENAI_MODEL`: Specific model to use (default: `gpt-4o-mini`).

## External Services
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: API key for Google Maps, Places, and Geocoding.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: For processing payments and subscriptions.
- `STRIPE_SECRET_KEY`: Secret key for Stripe (Server-side only).

## System Configuration
- `NEXT_PUBLIC_LOG_LEVEL`: Controls the verbosity of the Pino logger (`info`, `debug`, `trace`, `error`).
- `NEXT_PUBLIC_APP_ENV`: Current environment (`development`, `staging`, `production`).

## Authentication
- Access and Refresh tokens are managed via cookies named `buyorsell_access_token` and `refresh_token`.

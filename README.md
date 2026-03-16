# 🛒 BuyOrSell Client

The official frontend for the BuyOrSell platform—a premium marketplace for Ads, Motors, Properties, and Jobs in the UAE.

---

## 🛠️ Technology Stack

- **Core**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5 (React Query)](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations**: [Framer Motion / Motion 12](https://motion.dev/) & [GSAP](https://gsap.com/)
- **Backend Integration**: [Axios](https://axios-http.com/)
- **Authentication**: JWT-based session management
- **Internationalization**: Custom i18n middleware (English & Arabic support)
- **Maps**: Google Maps API integration

---

## 🚀 Getting Started

First, install dependencies:

```bash
yarn install
```

Next, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure & Logic

Comprehensive documentation of the codebase architecture, feature logic, and domain flows can be found in the [docs/](file:///c:/Users/shivm/BuyOrSell-client/docs/) directory.

### 📖 System Documentation:
- 🗺️ **[Architecture & Folder Structure](file:///c:/Users/shivm/BuyOrSell-client/docs/codebase-architecture.md)**
- 🛠️ **[Technology Stack](file:///c:/Users/shivm/BuyOrSell-client/docs/tech-stack.md)**
- 🏗️ **[Project Structure](file:///c:/Users/shivm/BuyOrSell-client/docs/project-structure.md)**
- 🔌 **[API Structure & Flow](file:///c:/Users/shivm/BuyOrSell-client/docs/api-structure.md)**
- 🧱 **[Core Architecture Blocks](file:///c:/Users/shivm/BuyOrSell-client/docs/core-architecture.md)**
- 📦 **[Application Modules](file:///c:/Users/shivm/BuyOrSell-client/docs/modules.md)**
- 🌐 **[Environment Variables](file:///c:/Users/shivm/BuyOrSell-client/docs/environment-variables.md)**

### 📝 Feature Logic Guides:

- 🏗️ **[Architecture Overview](file:///c:/Users/shivm/BuyOrSell-client/docs/codebase-structure/index.md)**
- 📝 **[Ad Posting Logic](file:///c:/Users/shivm/BuyOrSell-client/docs/ad-posting/index.md)**
- 💼 **[Job Posting Logic](file:///c:/Users/shivm/BuyOrSell-client/docs/job-posting/index.md)**
- 💳 **[Subscription & Eligibility](file:///c:/Users/shivm/BuyOrSell-client/docs/subscriptions/index.md)**
- 🤖 **[AI Tokens & Setup](file:///c:/Users/shivm/BuyOrSell-client/docs/ai/index.md)**
- 🤝 **[Connections & Messaging](file:///c:/Users/shivm/BuyOrSell-client/docs/connections/index.md)**
- 🎫 **[Support Ticket System](file:///c:/Users/shivm/BuyOrSell-client/docs/tickets/index.md)**

---

## 🪵 Logging

This project uses [Pino](https://getpino.io/) for structured logging.

### Usage

```typescript
import { log } from "@/services/logger";

log.info("User action", { userId: "123", action: "purchase" });
log.error("API failed", error, { endpoint: "/api/data" });
```

- **Development**: Pretty-printed logs (`pino-pretty`).
- **Production**: Structured JSON logs.
- **Log Levels**: Trace, Debug, Info, Warn, Error, Fatal (controlled via `NEXT_PUBLIC_LOG_LEVEL`).

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

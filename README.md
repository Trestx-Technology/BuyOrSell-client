# BuyOrSell Client

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## 📂 Project Structure

### Root Directory

- `actions/`: Server actions for Next.js.
- `app/`: Next.js App Router directory and API route handlers.
- `components/`: Reusable React components (auth, common, features, global, ui, etc.).
- `constants/`: Global constants and configuration values.
- `hooks/`: Custom React hooks.
- `interfaces/`: TypeScript interfaces and types.
- `lib/`: Utility libraries and configurations.
- `public/`: Static assets such as images and fonts.
- `schemas/`: Validation schemas (Zod).
- `services/`: API client services (AI, HTTP, Cookies, Logger).
- `stores/`: State management (Zustand).
- `translations/`: Internationalization files.
- `utils/`: Miscellaneous utility functions.

---

## 🗺️ Application Pages

The application is localized under `/[locale]` and organized into route groups:

### Authentication (`(auth)`)
- `forgot-password/`: Request password reset.
- `login/`: Standard login.
- `methods/`: Social/Alternative login options.
- `reset-password/`: Reset credentials.
- `signup/`: New user registration.

### Ads & Listings (`(root)`)
- `/`: Main landing page.
- `ad/[adId]/`: **(Dynamic)** Detailed view of an advertisement.
- `ai-ad-post/`: AI-assisted ad creation.
- `categories/[...slug]/`: **(Dynamic Catch-all)** Browse ads by category/subcategory hierarchy.
- `favorites/`: User's saved ads list.
  - `[id]/`: **(Dynamic)** Specific favorites collection.
- `post-ad/`: entry point for posting.
  - `select/`: Step 1: Category selection.
  - `details/`: Step 2: Form entry.
  - `details/[leafCategoryId]/`: **(Dynamic)** Category-specific fields.
  - `edit/[adId]/`: **(Dynamic)** Edit an existing ad.
  - `success/`: Post-submission confirmation.
  - `[...slug]/`: **(Dynamic Catch-all)** posting logic routes.

### Job Portal (`jobs`)
- `jobs/`: Jobs hub.
- `jobs/applied/`: List of applications sent.
- `jobs/saved/`: Bookmarked job listings.
- `jobs/my-profile/`: Jobseeker professional profile.
- `jobs/jobseeker/`: Jobseeker directory.
  - `new/`: Create jobseeker profile.
  - `[id]/`: **(Dynamic)** View specific jobseeker.
- `jobs/listing/`: Employer job management.
  - `my/`: Jobs posted by current user.
  - `[jobId]/applicants/`: **(Dynamic)** Manage candidates for a job.
  - `[...slug]/`: **(Dynamic Catch-all)** Job search results.
- `jobs/[category]/`: **(Dynamic)** Jobs within a specific industry.

### Organizations
- `organizations/`: Directory of registered businesses.
- `organizations/my/`: User's business profiles.
- `organizations/new/`: Register a new organization.
- `organizations/saved/`: Organizations the user follows.
- `organizations/edit/[id]/`: **(Dynamic)** Modify organization details.
- `organizations/[id]/`: **(Dynamic)** Public organization profile.

### User Account (`user`)
- `user/profile/`: Dashboard summary.
- `user/profile/edit/`: Update user info.
- `user/profile/settings/`: Account preferences.
  - `blocked-users/`: Blocked list.
  - `change-password/`: Security settings.
  - `notification-settings/`: Alert preferences.
- `user/address/`: Saved locations.
  - `new/`: Add location.
  - `[id]/`: **(Dynamic)** View/Edit location.
- `user/my-ads/`: User's active/inactive listings.
- `user/notifications/`: System/Activity inbox.
- `user/search-history/`: Recent search queries.
- `user/emarati-status/`: Verification for UAE nationals.

### Help & Support
- `help-centre/`: Support home.
- `help-centre/my-tickets/`: Status of user requests.
- `help-centre/new/`: Submit a new support ticket.
- `help-centre/messages/`: Support chat history.
- `help-centre/ticket/[ticketId]/`: **(Dynamic)** Ticket details and updates.

### Payments & System
- `pay/`: Payment checkout.
- `pay/response/`: Transaction status (Success/Fail).
- `plans/`: Subscription tier details.
- `my-subscriptions/`: Active billing plans.
- `map-view/`: Map-based ad exploration.
- `watch/`: Video feed of products/ads.
- `connections/`: User networking.
- `deals/`: Promotions and offers.
- `rate-us/`: App feedback.
- `no-internet/`: Offline fallback.


---

## 🪵 Logging

This project uses [Pino](https://getpino.io/) for structured logging.

### Usage
```typescript
import { log } from '@/services/logger';

log.info('User action', { userId: '123', action: 'purchase' });
log.error('API failed', error, { endpoint: '/api/data' });
```
- **Development**: Pretty-printed logs (`pino-pretty`).
- **Production**: Structured JSON logs.
- **Log Levels**: Trace, Debug, Info, Warn, Error, Fatal (controlled via `NEXT_PUBLIC_LOG_LEVEL`).

---

## 🏗️ Infrastructure & Deployment

### AWS ECS Fargate
An AWS CloudFormation template is provided at `infra/cloudformation/ecr-ecs-fargate.yml` to provision:
- ECR Repository
- ECS Cluster & Service (Fargate)
- IAM Roles & CloudWatch Log Groups

### Deployment Command Example
```bash
aws cloudformation deploy \
  --template-file infra/cloudformation/ecr-ecs-fargate.yml \
  --stack-name buy-or-sell-ecs \
  --parameter-overrides RepositoryName=buy-or-sell-client VpcId=vpc-xxx SubnetIds=subnet-xxx
```

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Pino Documentation](https://getpino.io/)
- [Vercel Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
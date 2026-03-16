# 📦 Application Modules

The BuyOrSell platform is organized into several key modules, each representing a core area of functionality.

## 1. Ad Management (Ads, Motors, Properties)
The primary module for the marketplace.
- **Posting**: Multi-step flow for creating listings.
- **Search**: Advanced filtering and search for all ad types.
- **Visuals**: Specialized handling for car specifications and property details.

## 2. Jobs
A specialized module within the marketplace for employment.
- **Listing**: Employers posting single job ads.
- **Applications**: Candidates applying to jobs.

## 3. AI Assistant
Powered by OpenAI to enhance the user experience.
- **AI Ad Post**: Automatically identifies categories and generates descriptions from images.
- **AI Search**: Natural language search for finding the right deals.

## 4. Subscriptions & Billing
Manages access control and premium features.
- **Plans**: Various tiers for individuals and organizations.
- **Limits**: Tracking tokens and ad availability based on active plans.
- **Payments**: Integrated with Stripe for plan purchasing.

## 5. User & Organization Profiles
- **Authentication**: JWT-based secure login and registration.
- **Profiles**: Personalized dashboards for users and legal organizations.
- **Verification**: Status tracking for verified sellers.

## 6. Messaging & Connections
- **In-App Communication**: Real-time chat between buyers and sellers.
- **Leads**: Tracking contact requests (WhatsApp, Call).

## 7. Support & Tickets
- **Help Center**: Integrated ticketing system for user issues.
- **Feedback**: Reporting bugs or marketplace concerns.

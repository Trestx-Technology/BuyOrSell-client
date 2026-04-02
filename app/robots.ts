import { MetadataRoute } from "next";

/**
 * Standardized robots.txt configuration for the BuyOrSell platform.
 *
 * Strategy:
 *  - Allow all public content including dynamic category pages,
 *    job listings, and the jobs portal.
 *  - Disallow crawlers on account-specific, system, and private routes.
 *  - Explicitly allow key dynamic paths so no wildcard disallow can override them.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://buyorsell.ae"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/", // Allow everything by default

          // Explicitly allow dynamic public pages for all locales
          "/*/jobs", // Jobs portal landing
          "/*/jobs/listing/", // Job listing pages (by subcategory)
          "/*/deals", // Hot deals
          "/*/exchange", // Exchange
          "/*/blog", // Blog
          "/*/blog/", // Blog posts
          "/*/organizations", // Business directory
          "/*/seller/", // Public seller profiles
          "/*/map-view", // Map explorer
          "/*/watch", // Shorts / Watch
          "/*/download", // App download
          "/*/help-centre", // Support / FAQ
          "/*/contact-us", // Contact
          "/*/plans", // Pricing
          "/*/methods", // Payment methods
          "/*/rate-us", // Feedback
          "/*/privacy-policy", // Legal
          "/*/terms-and-conditions", // Legal
          "/*/my-subscriptions", // Subscription plans
          "/*/post-ad", // Ad posting landing
          "/*/post-job", // Job posting landing
          "/*/ai-ad-post", // AI ad posting
          "/*/login", // Login page
          "/*/register", // Registration page
          "/*/forgot-password", // Password recovery
        ],
        disallow: [
          // System and API routes
          "/api/",
          "/_next/",
          "/static/",

          // User account and private sections
          "/*/profile",
          "/*/settings",
          "/*/my-ads",
          "/*/messages",
          "/*/chat",
          "/*/notifications",
          "/*/favorites",
          "/*/wallet",
          "/*/checkout",
          "/*/pay",

          // Internal utility pages
          "/*/connections",
          "/*/ai-tokens",

          // Drafts / Sensitive actions
          "/*/new-ticket",
          "/*/jobseeker/new",
        ],
      },
      {
        // Google specific — same rules but ensures Googlebot is explicitly welcomed
        userAgent: "Googlebot",
        allow: [
          "/",
          "/*/jobs",
          "/*/jobs/listing/",
          "/*/my-subscriptions",
          "/*/post-ad",
          "/*/post-job",
          "/*/ai-ad-post",
          "/*/login",
          "/*/register",
          "/*/forgot-password",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/*/profile",
          "/*/my-ads",
          "/*/messages",
          "/*/chat",
          "/*/notifications",
          "/*/favorites",
          "/*/wallet",
          "/*/checkout",
          "/*/pay",
          "/*/ai-tokens",
          "/*/connections",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import { MetadataRoute } from "next";

/**
 * Standardized robots.txt configuration for the BuyOrSell platform.
 * Protects user privacy by disallowing crawlers on account-specific and system routes.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://buyorsell.ae";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
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

        // Internal status/utility pages
        "/*/success",
        "/*/error",
        "/*/connections",
        "/*/ai-tokens",
        "/*/my-subscriptions",

        // Drafts/Sensitive actions
        "/*/new-ticket",
        "/*/jobseeker/new",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

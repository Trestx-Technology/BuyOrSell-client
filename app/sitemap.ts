import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

/**
 * Generates a comprehensive XML sitemap for the BuyOrSell platform.
 * It includes all localized static routes and core landing pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://buyorsell.ae"
  ).replace(/\/$/, "");

  // Define all key public-facing sections of the site
  const staticRoutes = [
    "", // Home
    "/jobs", // Jobs Portal
    "/deals", // Hot Deals
    "/exchange", // Exchange Section
    "/help-centre", // Support/FAQ
    "/contact-us", // Contact Form
    "/privacy-policy", // Legal
    "/terms-and-conditions", // Legal
    "/post-ad", // Ad Submission
    "/post-job", // Job Submission
    "/ai-ad-post", // AI-Powered Ad Post
    "/plans", // Pricing Plans
    "/methods", // Payment Methods
    "/seller", // Seller Portal
    "/rate-us", // Feedback
    "/map-view", // Map Explorer
    "/watch", // Watch/Shorts
    "/organizations", // Business Directory
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Generate localized entries for every route
  for (const locale of locales) {
    for (const route of staticRoutes) {
      const isHome = route === "";
      const isLegal = [
        "/privacy-policy",
        "/terms-and-conditions",
        "/methods",
        "/plans",
      ].includes(route);
      const isDynamic = [
        "/jobs",
        "/deals",
        "/organizations",
        "/map-view",
      ].includes(route);

      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency:
          isHome || isDynamic ? "daily" : isLegal ? "monthly" : "weekly",
        priority: isHome ? 1.0 : isDynamic ? 0.9 : isLegal ? 0.3 : 0.7,
      });
    }
  }

  // Note: Future enhancement could include fetching all categories via getCategoriesTree()
  // and all active ads, though for large marketplaces these are often split into sitemap indexes.

  return entries;
}

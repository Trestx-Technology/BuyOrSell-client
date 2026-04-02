import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import blogsData from "@/data/blogs.json";
import { Blog } from "@/interfaces/blog";
import { getCategoriesTree } from "@/app/api/categories/categories.services";
import { getJobSubcategories } from "@/app/api/categories/categories.services";
import { SubCategory } from "@/interfaces/categories.types";
import { toSlug } from "@/utils/slug-utils";

/**
 * Creates an XML-safe slug by removing characters that break XML
 * (like &) which Next.js sitemap serializer does not escape.
 */
function toXmlSafeSlug(name: string): string {
  const slug = toSlug(name);
  // Remove bare & and the surrounding hyphens (e.g. "Lynk-&-Co" -> "Lynk-Co")
  return slug
    .replace(/-&-/g, "-")
    .replace(/&/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Recursively collects all category slug paths from the category tree.
 * For a tree like Electronics > Mobiles > Smartphones, this generates:
 *   ["electronics", "electronics/mobiles", "electronics/mobiles/smartphones"]
 */
function collectCategoryPaths(
  categories: SubCategory[],
  parentPath: string = ""
): string[] {
  const paths: string[] = [];

  for (const category of categories) {
    const slug = toXmlSafeSlug(category.name);
    if (!slug) continue;

    const currentPath = parentPath ? `${parentPath}/${slug}` : slug;
    paths.push(currentPath);

    if (category.children && category.children.length > 0) {
      paths.push(...collectCategoryPaths(category.children, currentPath));
    }
  }

  return paths;
}

/**
 * Generates a comprehensive XML sitemap for the BuyOrSell platform.
 * Includes:
 *  - All localized static routes
 *  - Dynamic category listing pages (all levels)
 *  - Dynamic job listing pages (by subcategory)
 *  - Dynamic blog post pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = blogsData as Blog[];
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
    "/download", // App Download Page
    "/blog", // Blog Section
  ];

  const entries: MetadataRoute.Sitemap = [];

  // --- Fetch dynamic data (categories + job subcategories) ---
  let categoryPaths: string[] = [];
  let jobSubcategorySlugs: string[] = [];

  try {
    const categoriesResponse = await getCategoriesTree();
    if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
      categoryPaths = collectCategoryPaths(categoriesResponse.data);
    }
  } catch (error) {
    console.warn("Sitemap: Failed to fetch categories tree", error);
  }

  try {
    const jobSubcategoriesResponse = await getJobSubcategories();
    if (
      jobSubcategoriesResponse?.data &&
      Array.isArray(jobSubcategoriesResponse.data)
    ) {
      jobSubcategorySlugs = jobSubcategoriesResponse.data
        .map((sub) => toXmlSafeSlug(sub.name))
        .filter((slug) => slug.length > 0);
    }
  } catch (error) {
    console.warn("Sitemap: Failed to fetch job subcategories", error);
  }

  // --- Generate localized entries for static routes ---
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
        "/blog",
      ].includes(route);

      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency:
          isHome || isDynamic ? "daily" : isLegal ? "monthly" : "weekly",
        priority: isHome ? 1.0 : isDynamic ? 0.9 : isLegal ? 0.3 : 0.7,
      });
    }

    // --- Dynamic category pages: /{locale}/{category-path} ---
    for (const categoryPath of categoryPaths) {
      entries.push({
        url: `${baseUrl}/${locale}/${categoryPath}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }

    // --- Dynamic job listing pages: /{locale}/jobs/listing/{subcategory} ---
    for (const jobSlug of jobSubcategorySlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/jobs/listing/${jobSlug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }

    // --- Dynamic blog posts ---
    for (const blog of blogs) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${blog.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

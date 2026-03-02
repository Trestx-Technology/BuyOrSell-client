# SEO Audit Skill for BuyOrSell

This skill provides a comprehensive framework for auditing and improving the SEO of the BuyOrSell platform. It is tailored to the project's unique architecture (Next.js App Router, multi-locale, AI-powered features).

## 1. Project-Specific SEO Overview

- **Framework**: Next.js App Router (13.x/14.x/15.x).
- **Locales**: English (`en-US`), Arabic (`ar`), Dutch (`nl`, `nl-NL`).
- **Dynamic Metadata**: Uses `generateMetadata()` in `page.tsx` files, often fetching from `getSeoByRoute(route)`.
- **Sitemap**: Dynamically generated at `app/sitemap.ts`.
- **Robots**: Configured in `app/robots.ts`.
- **AI Search**: Integrated semantic search for ads and categories.

## 2. Technical SEO Checklist

### Core Setup

- [x] **Dynamic Sitemap**: Ensure `sitemap.xml` includes all static routes across all locales.
- [x] **Robots.txt**: Block sensitive routes (profile, messages, checkout) while allowing marketplace paths.
- [x] **Global Metadata**: Root `layout.tsx` must have a title template, description, and OpenGraph/Twitter defaults.
- [x] **Internationalization (hreflang)**: Use `alternates.languages` in global metadata for proper locale mapping.

### Page-Level Optimization

- [x] **Metadata Inheritance**: Ensure pages use `generateMetadata` to fetch CMS-driven SEO data.
- [x] **Client Component Pattern**: For "use client" pages, extract logic to a component and keep `page.tsx` as a server component to enable `generateMetadata`.
- [ ] **Structured Data (JSON-LD)**: Implement Schema.org markup for:
  - Products (Ads)
  - JobPostings (Jobs portal)
  - Breadcrumbs
  - Organizations (Verified businesses)

## 3. Implementation Patterns

### 3.1 Server/Client Separation for SEO

When a page requires "use client" but needs SEO:

1.  Extract the content to `_components/MyPageContent.tsx`.
2.  In `page.tsx`, keep it as a server component.
3.  Define `export async function generateMetadata()`.
4.  Export the main page which returns `<MyPageContent />`.

### 3.2 Dynamic Route Metadata

For dynamic routes like `/ad/[id]` or `/categories/[...slug]`:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchData(slug);
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    // ...OG/Twitter tags
  };
}
```

## 4. Current Audit Findings (2025)

- **Problem**: Root metadata was set to "Create Next App" defaults.
- **Fix**: Updated `app/layout.tsx` with premium branding and internationalization support.
- **Problem**: Lower-level pages like Privacy and Terms lacked metadata due to being client-only components.
- **Fix**: Refactored to server/client pattern with dynamic `generateMetadata`.
- **Problem**: Sitemap was minimal.
- **Fix**: Expanded to 19+ routes across 4 locales with tiered priorities.

## 5. Next Steps for Audit

1.  **Image Optimization**: Audit components for missing `alt` tags.
2.  **Schema Markup**: Add JSON-LD to the Ads and Jobs pages.
3.  **Performance**: Audit Largest Contentful Paint (LCP) on the homepage.

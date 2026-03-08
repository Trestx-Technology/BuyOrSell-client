# Sponsored & Ad Banner Tracking

This document tracks all banner placements across the platform and their associated slugs for seamless API access and dynamic mapping.

## Banner Slugs & Locations

| Banner Name / Slug         | Description                                                                                                                                                                | Component / File Location                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home-page-carousel`       | The main hero carousel spanning the landing page.                                                                                                                          | `app/[locale]/(root)/_components/home-carousel.tsx`                                                                                               |
| `explore-deals`            | The global sponsored ad block fallback. Appears in the home page slider arrays and dynamically loads throughout `Hot Deals` and `Exchange` product lists (every 6th item). | `components/global/page-banner-carousel.tsx`<br>`deals/_components/DealsContent.tsx`<br>`exchange/[[...slug]]/_components/ExchangeAdsContent.tsx` |
| `post-ad-page`             | Prominent banner located atop the Select Ad Categories flow.                                                                                                               | `app/[locale]/(root)/post-ad/select/_components/SelectCategoryContent.tsx`                                                                        |
| `post-job-page`            | Prominent banner resting above the Select Job Categories layout.                                                                                                           | `app/[locale]/(root)/post-job/select/_components/SelectJobCategoryContent.tsx`                                                                    |
| `organization-create-page` | Large banner seated above the organization creation configuration form.                                                                                                    | `app/[locale]/(root)/organizations/new/page.tsx`                                                                                                  |
| `organization-edit-page`   | Large banner seated above the organization editing and update form.                                                                                                        | `app/[locale]/(root)/organizations/edit/[id]/page.tsx`                                                                                            |
| `deals-page`               | Primary featured page banner leading the deals catalog routing.                                                                                                            | `app/[locale]/(root)/deals/_components/DealsContent.tsx`                                                                                          |
| `exchange-page`            | Primary featured page banner leading the exchange marketplace categories.                                                                                                  | `app/[locale]/(root)/exchange/[[...slug]]/_components/ExchangeAdsContent.tsx`                                                                     |

## Internal Functionality & Fallbacks

To support richer, distinct native ads and externally sponsored redirects, the core `Banner` definitions have been upgraded to utilize these dynamic parameters internally inside the `BannerCTAWrapper`:

```typescript
{
  isSponsored?: boolean;      // Toggles behavioral override for the CTA click and routes externally.
  sponsoredLink?: string;     // The exact third-party URL the banner will target if sponsored.
  buttonLabel?: string;       // Custom text written onto the CTA button (Falls back to "Explore All Deals").
  title?: string;             // Absolute overlaid DOM title content, helpful if banner source imagery lacks native baked-in text graphics.
  description?: string;       // Absolute overlaid descriptive sub-header text.
}
```

If `isSponsored` rests as `true` and a `sponsoredLink` specifies a valid target, interacting with the banner automatically delegates to that specific third-party URL link securely rather than building generic native application links.

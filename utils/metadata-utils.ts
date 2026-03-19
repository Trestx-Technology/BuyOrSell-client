import { Metadata } from 'next';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

export function constructMetadata(
  seo: SEOData,
  fallback: { title: string; description: string; url?: string }
): Metadata {
  const currentUrl = seo.canonicalUrl || fallback.url || "/";
  const ogImageUrl = seo.ogImage || seo.twitterImage;
  const keywords = Array.isArray(seo.keywords) ? seo.keywords.join(", ") : seo.keywords;

  return {
    metadataBase: new URL("https://buyorsell.ae"),
    title: seo.title || fallback.title,
    description: seo.description || fallback.description,
    keywords: keywords,
    openGraph: {
      title: seo.ogTitle || seo.title || fallback.title,
      description: seo.ogDescription || seo.description || fallback.description,
      url: currentUrl.startsWith("http") ? currentUrl : `https://buyorsell.ae${currentUrl.startsWith("/") ? "" : "/"}${currentUrl}`,
      siteName: "BuyOrSell",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      type: "website",
    },
    robots: {
      index: !seo.robots?.includes('noindex'),
      follow: !seo.robots?.includes('nofollow'),
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.title || fallback.title,
      description: seo.twitterDescription || seo.ogDescription || seo.description || fallback.description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: currentUrl.startsWith("http") ? currentUrl : `https://buyorsell.ae${currentUrl.startsWith("/") ? "" : "/"}${currentUrl}`,
    },
  };
}

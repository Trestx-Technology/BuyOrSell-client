import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocale, locales } from "./lib/i18n/config";

/**
 * Proxy function for handling locale redirection and routing logic.
 * This is the Next.js 16 equivalent of middleware.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Basic Locale Check
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname already has a locale, allow the request to proceed
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 2. Define Exclusion Logic
  // Exclude API, internal Next.js, and important SEO/system files from redirect
  const excludedPaths = [
    "/api",
    "/_next",
    "/favicon.ico",
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.json",
    "/pay",
    "/pay/response",
    "/firebase-messaging-sw.js",
    "/images",
    "/assets",
    "/static",
  ];

  const shouldBeExcluded =
    excludedPaths.some((p) => pathname.startsWith(p) || pathname === p) ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml)$/i.test(pathname);

  if (shouldBeExcluded) {
    return NextResponse.next();
  }

  // 3. Double-check: safeguard to prevent multiple redirects
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  // 4. Redirect with detected locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

// Optimization: Use a simpler matcher to avoid Vercel deployment manifest conflicts.
// Most logic is handled inside the proxy function for maximum robustness.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

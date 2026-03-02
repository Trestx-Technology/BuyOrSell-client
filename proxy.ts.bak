import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocale, locales } from "./lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname already has a locale, allow the request to proceed
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // All routes except excluded ones will be validated and redirected with locale

  // Define routes that should be excluded from locale validation
  // These routes will NOT be redirected to include locale prefix
  const excludedRoutes = [
    "/api", // API routes
    "/_next", // Next.js internal routes
    "/favicon.ico", // Favicon
    "/pay", // Pay routes
    "/pay/response", // Pay response routes
    "/firebase-messaging-sw.js", // Firebase service worker
    "/manifest.json", // PWA manifest
    "/images", // Static images
    "/assets", // Static assets
    // Add more routes/keywords here that should be excluded from locale validation
  ];

  // Check if the current path should be excluded from locale validation
  const shouldBeExcluded = excludedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route,
  );

  // If the route should be excluded, allow it to proceed without locale validation
  if (shouldBeExcluded) {
    return NextResponse.next();
  }

  // Double-check: if locale already exists in pathname, don't append again (extra safeguard)
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  // Redirect if the route is not excluded and doesn't have locale yet
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /ad/123
  // The new URL is now /en-US/ad/123
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

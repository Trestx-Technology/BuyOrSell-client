import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocale, locales } from "./lib/i18n/config";

/**
 * Proxy function for handling locale redirection and routing logic.
 * This is the Next.js 16 equivalent of middleware.
 */
export async function proxy(request: NextRequest) {
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
    "/sitemap.xml", // Sitemap
    "/robots.txt", // Robots.txt
    "/images", // Static images
    "/assets", // Static assets
    // Add more routes/keywords here that should be excluded from locale validation
  ];

  const shouldBeExcluded =
    excludedRoutes.some((p) => pathname.startsWith(p) || pathname === p) ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml)$/i.test(pathname);

  if (shouldBeExcluded) {
    return NextResponse.next();
  }

  // 2. User Status Check
  const userId = request.cookies.get("buyorsell_user_id")?.value;
  const isHaltedPage = pathname.includes("/account-halted");

  if (userId && !isHaltedPage && !pathname.startsWith("/api")) {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/users/user/${userId}/status`, {
        next: { revalidate: 60 } // Cache for 1 minute
      } as any);

      if (res.ok) {
        const responseData = await res.json();
        const status = responseData?.data?.status?.toUpperCase();

        if (status === "BLOCKED" || status === "BANNED" || status === "SUSPENDED") {
          const currentLocale = locales.find(
            (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
          ) || getLocale(request);
          
          const url = request.nextUrl.clone();
          url.pathname = `/${currentLocale}/account-halted`;
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error("[Proxy] User status check failed:", error);
    }
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

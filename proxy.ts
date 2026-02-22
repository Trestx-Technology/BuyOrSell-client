import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocale, locales } from "./lib/i18n/config";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // GLOBAL BYPASS AND REDIRECT TO COMING SOON
  if (
    pathname.includes("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes("favicon.ico") ||
    pathname.includes(".png") ||
    pathname.includes(".svg") ||
    pathname.includes(".jpg") ||
    pathname.includes(".jpeg")
  ) {
    return NextResponse.next();
  }

  // Block all other API calls
  if (pathname.startsWith("/api")) {
    return new NextResponse(
      JSON.stringify({ message: "Service Unavailable - Coming Soon" }),
      {
        status: 503,
        headers: { "content-type": "application/json" },
      },
    );
  }

  // Detect locale or default to en-US
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = locales.includes(segments[0] as any)
    ? segments[0]
    : "en-US";

  const comingSoonUrl = new URL(`/${currentLocale}/coming-soon`, request.url);

  if (pathname === `/${currentLocale}/coming-soon`) {
    return NextResponse.next();
  }

  return NextResponse.redirect(comingSoonUrl);

  // Original logic starts here (bypassed above)

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
    return handleAuth(request);
  }

  // Redirect if the route is not excluded and doesn't have locale yet
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /ad/123
  // The new URL is now /en-US/ad/123
  return NextResponse.redirect(request.nextUrl);
}

function handleAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the authentication token from cookies
  // Note: Cookies are set client-side via CookieService (non-httpOnly)
  // but are still accessible to middleware because cookies are sent with every HTTP request
  // The cookie is set in authStore.setSession() and authStore.refreshTokens()
  const token = request.cookies.get(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
  const isAuthenticated = !!token?.value;

  // Define auth routes (login, signup, etc.)
  const authRoutes = [
    "/login",
    "/signup",
    "/methods",
    "/forgot-password",
    "/reset-password",
  ];

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/user",
    "/post-ad",
    "/chat",
    "/favorites",
    "/ai-ad-post",
  ];

  // Check if the current path is a protected route
  // We explicitly ensure /pay is NOT matched here (it isn't in the list, but good to verify)
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.includes(route), // Changed to include to catch /en-US/user etc.
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.includes(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login when accessing protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Store the original URL to redirect back after login
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except internal _next paths and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

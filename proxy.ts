import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLocale, locales } from './lib/i18n/config';
// import { AUTH_TOKEN_NAMES } from '@/constants/auth.constants';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname already has a locale, allow the request to proceed
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Define routes that should be under [locale] (i18n routes)
  // Only these routes will be redirected to include locale prefix
  const localeRoutes = [
    '/test-i18n',
    '/login',
    '/signup',
    '/methods',
    '/forgot-password',
    '/reset-password',
    // Add more routes here that should be under [locale]
  ];

  // Check if the current path should be under [locale]
  const shouldHaveLocale = localeRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  // If the route should not have a locale, allow it to proceed
  // This allows (auth) and (root) routes to be accessed freely
  if (!shouldHaveLocale) {
    return NextResponse.next();
  }

  // Redirect if the route should have a locale but doesn't
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  // e.g. incoming request is /test-i18n
  // The new URL is now /en-US/test-i18n
  return NextResponse.redirect(request.nextUrl);

  // ============================================================================
  // COMMENTED OUT: Token-related authentication logic
  // ============================================================================
  
  // // Get the authentication token from cookies
  // // Note: Cookies are set client-side via CookieService (non-httpOnly)
  // // but are still accessible to middleware because cookies are sent with every HTTP request
  // // The cookie is set in authStore.setSession() and authStore.refreshTokens()
  // const token = request.cookies.get(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
  // const isAuthenticated = !!token?.value;

  // // Define auth routes (login, signup, etc.)
  // const authRoutes = ['/login', '/signup', '/methods', '/forgot-password', '/reset-password'];

  // // Define protected routes that require authentication
  // const protectedRoutes = [
  //   '/user',
  //   '/post-ad',
  //   '/chat',
  //   '/favorites',
  //   '/ai-ad-post',   
  // ];

  // // Check if the current path is a protected route
  // const isProtectedRoute = protectedRoutes.some(route => 
  //   pathname.startsWith(route)
  // );

  // // Check if the current path is an auth route
  // const isAuthRoute = authRoutes.some(route => 
  //   pathname === route || pathname.startsWith(route)
  // );

  // // Redirect authenticated users away from auth pages
  // if (isAuthenticated && isAuthRoute) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/';
  //   return NextResponse.redirect(url);
  // }

  // // Redirect unauthenticated users to login when accessing protected routes
  // if (!isAuthenticated && isProtectedRoute) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   // Store the original URL to redirect back after login
  //   url.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(url);
  // }

  // // Allow the request to proceed
  // return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


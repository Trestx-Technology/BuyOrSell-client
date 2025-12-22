import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_NAMES } from '@/constants/auth.constants';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the authentication token from cookies
  // Note: Cookies are set client-side via CookieService (non-httpOnly)
  // but are still accessible to middleware because cookies are sent with every HTTP request
  // The cookie is set in authStore.setSession() and authStore.refreshTokens()
  const token = request.cookies.get(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
  const isAuthenticated = !!token?.value;

  // Define auth routes (login, signup, etc.)
  const authRoutes = ['/login', '/signup', '/methods', '/forgot-password', '/reset-password'];

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/user',
    '/post-ad',
    '/chat',
    '/favorites',
    '/ai-ad-post',   
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login when accessing protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Store the original URL to redirect back after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


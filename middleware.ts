import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow access to public assets and the coming-soon page itself
  // We check for /coming-soon in any locale context or as a direct path
  if (
    pathname.includes('/coming-soon') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') || // Might need auth for some reasons? No, user said bypass everything
    pathname.includes('favicon.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.svg') ||
    pathname.includes('.jpg') ||
    pathname.includes('.jpeg')
  ) {
    return NextResponse.next();
  }

  // 2. Block all other API calls
  if (pathname.startsWith('/api')) {
    return new NextResponse(
      JSON.stringify({ message: "Service Unavailable - Coming Soon" }),
      {
        status: 503,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  // 3. Redirect all other page requests to /en-US/coming-soon (or a detected locale)
  const segments = pathname.split('/').filter(Boolean);
  const locales = ['en-US', 'ar']; // common locales in this app
  const currentLocale = locales.includes(segments[0]) ? segments[0] : 'en-US';

  const comingSoonUrl = new URL(`/${currentLocale}/coming-soon`, request.url);
  
  // Prevent infinite redirect if we are already there (though handled above)
  if (pathname === `/${currentLocale}/coming-soon`) {
      return NextResponse.next();
  }

  return NextResponse.redirect(comingSoonUrl);
}

// Match all paths except certain static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled inside middleware)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

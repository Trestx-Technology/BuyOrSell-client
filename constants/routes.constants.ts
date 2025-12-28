/**
 * Public API endpoints that don't require authentication
 * These routes will skip token validation in axios interceptors
 */
export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh-token',
  '/public/', // Any route starting with /public/
  // Add more public endpoints as needed
] as const;

/**
 * Checks if a URL is a public endpoint that doesn't require authentication
 * @param url - The request URL
 * @returns true if the endpoint is public
 */
export function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  
  return PUBLIC_ENDPOINTS.some(endpoint => {
    if (endpoint.endsWith('/')) {
      // Match prefix for routes like '/public/'
      return url.startsWith(endpoint);
    }
    // Exact match for specific routes
    return url === endpoint || url.startsWith(`${endpoint}?`);
  });
}


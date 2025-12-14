export const isBrowser = typeof window !== "undefined";

/**
 * Client-side cookie service
 * Note: Cannot set httpOnly cookies from client-side JavaScript
 * For security, consider using httpOnly cookies with server-side updates
 */
export class CookieService {
  /**
   * Get a cookie value by name
   */
  static get(name: string): string | null {
    if (!isBrowser) return null;
    
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
      }
    }
    return null;
  }

  /**
   * Set a cookie
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options (maxAge in seconds, defaults to 24 hours)
   */
  static set(
    name: string,
    value: string,
    options: {
      maxAge?: number; // in seconds
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void {
    if (!isBrowser) return;

    const {
      maxAge = 86400, // Default to 24 hours
      path = '/',
      domain,
      secure = true,
      sameSite = 'lax',
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (maxAge) {
      cookieString += `; max-age=${maxAge}`;
    }

    if (path) {
      cookieString += `; path=${path}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += `; secure`;
    }

    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Remove a cookie
   */
  static remove(name: string, options: { path?: string; domain?: string } = {}): void {
    if (!isBrowser) return;

    const { path = '/', domain } = options;

    // Set cookie with expiration in the past to delete it
    let cookieString = `${name}=; max-age=0`;

    if (path) {
      cookieString += `; path=${path}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Clear all cookies (removes cookies for current domain/path)
   */
  static clear(): void {
    if (!isBrowser) return;
    
    // Get all cookies and remove them
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      this.remove(name);
    }
  }
}


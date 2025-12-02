export const isBrowser = typeof window !== "undefined";

export class LocalStorageService {
  static get<T>(key: string): T | null {
    if (!isBrowser) return null;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        // Try to parse as JSON first (for values stored via LocalStorageService.set)
        const parsed = JSON.parse(value);
        return parsed as T;
      } catch (err) {
        // If parsing fails, it might be a plain string (not JSON-stringified)
        // Return the raw value as-is for string types
        if (typeof value === 'string') {
          return value as T;
        }
        console.error(`[LocalStorageService] Failed to parse value for key "${key}":`, err);
        return null;
      }
    }
    return null;
  }

  static set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  static clear(): void {
    if (!isBrowser) return;
    localStorage.clear();
  }
}

export const isBrowser = typeof window !== "undefined";

export class LocalStorageService {
  static get<T>(key: string): T | null {
    if (!isBrowser) return null;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON?.parse(value) as T;
      } catch (err) {
        console.error(err);
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

import { useParams } from 'next/navigation';
import { type Locale, locales, defaultLocale } from '@/lib/i18n/config';
import { getTranslations } from '@/translations';
import type { Translations } from '@/translations';

/**
 * Hook to get the current locale from route params
 * Returns the locale and a helper function to create locale-aware paths
 * 
 * @example
 * ```tsx
 * const { locale, localePath, t } = useLocale();
 * // locale: 'en-US'
 * // localePath('/login') => '/en-US/login'
 * // t.auth.login.title => 'Log In'
 * ```
 */
export function useLocale() {
  const params = useParams();
  const localeParam = params?.locale as string | undefined;
  
  // Validate locale
  const locale = (localeParam && locales.includes(localeParam as Locale))
    ? (localeParam as Locale)
    : defaultLocale;

  /**
   * Creates a locale-aware path
   * @param path - The path without locale (e.g., '/login' or '/signup')
   * @returns The path with locale prefix (e.g., '/en-US/login')
   */
  const localePath = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${locale}${cleanPath}`;
  };

  /**
   * Get all translations for the current locale
   */
  const t: Translations = getTranslations(locale);

  return { locale, localePath, t };
}


/**
 * Global Translations Index
 * 
 * This is the main entry point for all translations in the application.
 * 
 * Structure:
 * - Each feature/domain has its own translation file (e.g., auth.ts, common.ts)
 * - All translations are organized by locale
 * - Type-safe translations with TypeScript
 * 
 * Usage:
 * ```ts
 * import { getTranslations } from '@/translations';
 * const t = getTranslations('en-US');
 * t.auth.login.title // "Log In"
 * ```
 * 
 * Adding new translations:
 * 1. Create a new file in this directory (e.g., common.ts)
 * 2. Define the type in translations/types.ts
 * 3. Export it from this file
 * 4. Add it to the Translations type in types.ts
 */

import { type Locale } from '@/lib/i18n/config';
import { authTranslations } from './auth';
import { homeTranslations } from './home';
import type { Translations } from './types';

/**
 * Get all translations for a specific locale
 * @param locale - The locale to get translations for
 * @returns All translations for the specified locale
 */
export function getTranslations(locale: Locale): Translations {
  return {
    auth: authTranslations[locale],
    home: homeTranslations[locale],
    // Add more namespaces here as you create them:
    // common: commonTranslations[locale],
    // navigation: navigationTranslations[locale],
  };
}

/**
 * Get a specific translation namespace for a locale
 * @param locale - The locale to get translations for
 * @param namespace - The translation namespace to get
 * @returns The specified translation namespace for the locale
 */
export function getTranslationNamespace<K extends keyof Translations>(
  locale: Locale,
  namespace: K
): Translations[K] {
  const translations = getTranslations(locale);
  return translations[namespace];
}

// Export individual translation files for direct access if needed
export { authTranslations } from './auth';
export { homeTranslations } from './home';

// Export types
export type { Translations, AuthTranslations, HomeTranslations } from './types';


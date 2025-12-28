/**
 * Global Translations Entry Point
 *
 * This file provides the main interface for accessing translations
 * across the application. It uses a modular folder structure where
 * each feature/page has its own folder with translations and types.
 *
 * Structure:
 * translations/
 * ├── index.ts              # Main entry point (this file)
 * ├── README.md             # Documentation
 * ├── auth/                 # Authentication translations
 * │   ├── index.ts         # Auth translations
 * │   └── types.ts         # Auth type definitions
 * ├── home/                 # Home page translations
 * │   ├── index.ts         # Home translations
 * │   └── types.ts         # Home type definitions
 * ├── ad/                   # Ad page translations
 * │   ├── index.ts         # Ad translations
 * │   └── types.ts         # Ad type definitions
 * ├── common/               # Shared/common translations
 * │   ├── index.ts         # Common translations
 * │   └── types.ts         # Common type definitions
 * └── types/                # Global/shared types
 *     └── index.ts         # Global type exports
 *
 * Usage:
 * ```ts
 * import { getTranslations } from '@/translations';
 * const t = getTranslations('en-US');
 * t.auth.login.title // "Log In"
 * ```
 *
 * Adding new translations:
 * 1. Create a new folder for your feature (e.g., translations/user/)
 * 2. Add index.ts with translations and types.ts with type definitions
 * 3. Import and add to the registry in this file
 * 4. Update the Translations type in types/index.ts
 */

import { type Locale } from "@/lib/i18n/config";
import { authTranslations } from "./auth";
import { homeTranslations } from "./home";
import { adTranslations } from "./ad";
import { commonTranslations } from "./common";
import { searchHistoryTranslations } from "./search-history";
import { notificationsTranslations } from "./notifications";
import { favoritesTranslations } from "./favorites";
import { categoriesTranslations } from "./categories";
import { userTranslations } from "./user";
import { organizationTranslations } from "./organizations";
import { sellerTranslations } from "./seller";
import { dealsTranslations } from "./deals";
import { plansTranslations } from "./plans";
import type { Translations } from "./types";
import { DEFAULT_LOCALE } from "../validations/utils";

// Translation registry for automatic loading
const translationRegistry = {
  auth: authTranslations,
  home: homeTranslations,
  ad: adTranslations,
  common: commonTranslations,
  searchHistory: searchHistoryTranslations,
  notifications: notificationsTranslations,
  favorites: favoritesTranslations,
  categories: categoriesTranslations,
  user: userTranslations,
  organizations: organizationTranslations,
  seller: sellerTranslations,
  deals: dealsTranslations,
  plans: plansTranslations,
} as const;

/**
 * Get all translations for a specific locale
 * @param locale - The locale to get translations for
 * @returns All translations for the specified locale
 */
export function getTranslations(locale: Locale): Translations {
  // Use registry to dynamically build translations object
  const translations = {} as Translations;

  for (const [namespace, translationData] of Object.entries(
    translationRegistry
  )) {
    (translations as any)[namespace] = translationData[locale];
  }

  return translations;
}

/**
 * Get translations for a specific locale with fallback to default locale
 * @param locale - The requested locale
 * @returns Translations for the locale or default locale if not found
 */
export function getTranslationsWithFallback(locale: Locale): Translations {
  try {
    return getTranslations(locale);
  } catch (error) {
    // Fallback to default locale if requested locale is not available
    console.warn(
      `Translations not found for locale: ${locale}, falling back to ${DEFAULT_LOCALE}`
    );
    return getTranslations(DEFAULT_LOCALE);
  }
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
export { authTranslations } from "./auth";
export { homeTranslations } from "./home";
export { adTranslations } from "./ad";
export { commonTranslations } from "./common";
export { searchHistoryTranslations } from "./search-history";
export { notificationsTranslations } from "./notifications";
export { favoritesTranslations } from "./favorites";
export { categoriesTranslations } from "./categories";
export { userTranslations } from "./user";
export { organizationTranslations } from "./organizations";
export { sellerTranslations } from "./seller";
export { dealsTranslations } from "./deals";
export { plansTranslations } from "./plans";

// Export types
export type { Translations } from "./types";

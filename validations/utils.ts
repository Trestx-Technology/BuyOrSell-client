/**
 * Shared utilities for translations
 *
 * This file contains common imports, types, and utilities used across
 * all translation files to reduce duplication and improve maintainability.
 */

import { type Locale } from "@/lib/i18n/config";
import { type TranslationNamespace } from "../translations/types";

// Re-export commonly used types for convenience
export type { Locale, TranslationNamespace };

// Supported locales array for iteration
export const SUPPORTED_LOCALES: readonly Locale[] = [
  "en-US",
  "nl-NL",
  "nl",
  "ar",
] as const;

// Default locale (should match the one in i18n config)
export const DEFAULT_LOCALE: Locale = "en-US";

/**
 * Helper function to create a translation namespace with proper typing
 * This reduces boilerplate in individual translation files
 */
export function createTranslationNamespace<T>(
  translations: Record<Locale, T>
): TranslationNamespace<T> {
  return translations;
}

/**
 * Type-safe helper to ensure all locales are provided
 * This helps catch missing translations at compile time
 */
export function validateTranslationNamespace<T>(
  translations: Record<Locale, T>
): TranslationNamespace<T> {
  // Check that all supported locales are present
  for (const locale of SUPPORTED_LOCALES) {
    if (!(locale in translations)) {
      throw new Error(`Missing translation for locale: ${locale}`);
    }
  }

  return translations as TranslationNamespace<T>;
}

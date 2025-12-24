/**
 * Global/shared translation types
 */

import { type Locale } from '@/lib/i18n/config';

// Re-export commonly used types
export type { Locale };

// Base type for all translation namespaces
export type TranslationNamespace<T> = Record<Locale, T>;

// Import and re-export all feature-specific types
export type { AuthTranslations } from '../auth/types';
export type { HomeTranslations } from '../home/types';
export type { AdTranslations } from '../ad/types';
export type { CommonTranslations } from '../common/types';

// Combined translations type
export type Translations = {
  auth: AuthTranslations;
  home: HomeTranslations;
  ad: AdTranslations;
  common: CommonTranslations;
};

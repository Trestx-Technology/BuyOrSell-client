import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const locales = ['en-US', 'nl-NL', 'nl', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en-US';

// Locale display names
export const localeNames: Record<Locale, string> = {
  'en-US': 'English',
  'nl-NL': 'Nederlands',
  'nl': 'Nederlands',
  'ar': 'العربية',
};

export function getLocale(request: Request): Locale {
  // Negotiator expects plain object so we need to transform headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Use negotiator and intl-localematcher to get the best locale
  const languages = new Negotiator({ headers }).languages();
  
  // Map common language codes to our supported locales
  const languageMap: Record<string, Locale> = {
    'en': 'en-US',
    'nl': 'nl-NL',
    'ar': 'ar',
  };
  
  // Try to match exact locale first
  let locale = match(languages, locales, defaultLocale);
  
  // If no exact match, try language code mapping
  if (!locales.includes(locale as Locale)) {
    const primaryLang = languages[0]?.split('-')[0]?.toLowerCase();
    if (primaryLang && languageMap[primaryLang]) {
      locale = languageMap[primaryLang];
    } else {
      locale = defaultLocale;
    }
  }

  return locale as Locale;
}


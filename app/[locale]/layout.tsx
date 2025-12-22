import { type ReactNode } from 'react';
import { type Locale, locales } from '@/lib/i18n/config';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  
  // Validate and get locale
  const locale = (locales.includes(localeParam as Locale) 
    ? (localeParam as Locale) 
    : locales[0]) as Locale;
  
  // Determine if RTL (Arabic)
  const isRTL = locale === 'ar';
  const lang = locale === 'ar' ? 'ar' : locale.split('-')[0];

  // This layout wraps locale-specific routes
  // The root layout already provides html/body tags
  return (
    <div lang={lang} dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}


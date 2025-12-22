import { type Locale, locales, localeNames } from '@/lib/i18n/config';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Locale-specific content
const content = {
  'en-US': {
    title: 'Internationalization Test Page',
    currentLocale: 'Current Locale',
    locale: 'Locale',
    testSwitching: 'Test Locale Switching',
    tryAccessing: 'Try accessing this page with different locales:',
    howItWorks: 'How It Works',
    middlewareDetects: 'The middleware automatically detects the user\'s preferred language from the',
    acceptLanguage: 'Accept-Language',
    header: 'header and redirects to the appropriate locale.',
    ifYouAccess: 'If you access',
    youllBeRedirected: 'you\'ll be redirected to',
    localeInfo: 'Locale Information',
    supportedLocales: 'Supported Locales',
    defaultLocale: 'Default Locale',
    localeName: 'English',
  },
  'nl-NL': {
    title: 'Internationalisatie Test Pagina',
    currentLocale: 'Huidige Locale',
    locale: 'Locale',
    testSwitching: 'Test Locale Wisselen',
    tryAccessing: 'Probeer deze pagina te openen met verschillende locales:',
    howItWorks: 'Hoe Het Werkt',
    middlewareDetects: 'De middleware detecteert automatisch de voorkeurstaal van de gebruiker vanuit de',
    acceptLanguage: 'Accept-Language',
    header: 'header en leidt door naar de juiste locale.',
    ifYouAccess: 'Als je',
    youllBeRedirected: 'opent, word je doorgestuurd naar',
    localeInfo: 'Locale Informatie',
    supportedLocales: 'Ondersteunde Locales',
    defaultLocale: 'Standaard Locale',
    localeName: 'Nederlands',
  },
  'nl': {
    title: 'Internationalisatie Test Pagina',
    currentLocale: 'Huidige Locale',
    locale: 'Locale',
    testSwitching: 'Test Locale Wisselen',
    tryAccessing: 'Probeer deze pagina te openen met verschillende locales:',
    howItWorks: 'Hoe Het Werkt',
    middlewareDetects: 'De middleware detecteert automatisch de voorkeurstaal van de gebruiker vanuit de',
    acceptLanguage: 'Accept-Language',
    header: 'header en leidt door naar de juiste locale.',
    ifYouAccess: 'Als je',
    youllBeRedirected: 'opent, word je doorgestuurd naar',
    localeInfo: 'Locale Informatie',
    supportedLocales: 'Ondersteunde Locales',
    defaultLocale: 'Standaard Locale',
    localeName: 'Nederlands',
  },
  'ar': {
    title: 'صفحة اختبار التدويل',
    currentLocale: 'اللغة الحالية',
    locale: 'اللغة',
    testSwitching: 'اختبار تبديل اللغة',
    tryAccessing: 'جرب الوصول إلى هذه الصفحة بلغات مختلفة:',
    howItWorks: 'كيف يعمل',
    middlewareDetects: 'يكتشف البرنامج الوسيط تلقائيًا اللغة المفضلة للمستخدم من',
    acceptLanguage: 'Accept-Language',
    header: 'ويوجه إلى اللغة المناسبة.',
    ifYouAccess: 'إذا قمت بالوصول إلى',
    youllBeRedirected: 'سيتم توجيهك إلى',
    localeInfo: 'معلومات اللغة',
    supportedLocales: 'اللغات المدعومة',
    defaultLocale: 'اللغة الافتراضية',
    localeName: 'العربية',
  },
};

export default async function TestI18nPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  
  // Validate that locale is a supported locale
  const locale = (locales.includes(localeParam as Locale) 
    ? (localeParam as Locale) 
    : locales[0]) as Locale; // Fallback to default locale if somehow invalid

  // Get locale-specific content
  const t = content[locale] || content['en-US'];
  const isRTL = locale === 'ar';

  return (
    <div className="container mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
        
        <div className="space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t.currentLocale}</h2>
            <p className="text-lg">
              <span className="font-medium">{t.locale}:</span>{' '}
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {locale} ({t.localeName})
              </code>
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t.testSwitching}</h2>
            <p className="mb-4">
              {t.tryAccessing}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <a
                  href="/en-US/test-i18n"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  /en-US/test-i18n
                </a>
              </li>
              <li>
                <a
                  href="/nl-NL/test-i18n"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  /nl-NL/test-i18n
                </a>
              </li>
              <li>
                <a
                  href="/nl/test-i18n"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  /nl/test-i18n
                </a>
              </li>
              <li>
                <a
                  href="/ar/test-i18n"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  /ar/test-i18n
                </a>
              </li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t.howItWorks}</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                {t.middlewareDetects}{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{t.acceptLanguage}</code>{' '}
                {t.header}
              </p>
              <p>
                {t.ifYouAccess}{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/test-i18n</code>{' '}
                {t.youllBeRedirected}{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/{locale}/test-i18n</code>.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t.localeInfo}</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">{t.supportedLocales}:</span>{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  en-US, nl-NL, nl, ar
                </code>
              </p>
              <p>
                <span className="font-medium">{t.defaultLocale}:</span>{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  en-US
                </code>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


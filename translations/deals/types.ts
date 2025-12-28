import type { Locale } from "@/lib/i18n/config";

export type DealsTranslations = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  browseCategories: string;
  limitedTimeOffers: string;
  sortOptions: {
    default: string;
    newest: string;
    oldest: string;
    priceAsc: string;
    priceDesc: string;
  };
};

export type DealsTranslationNamespace = Record<Locale, DealsTranslations>;


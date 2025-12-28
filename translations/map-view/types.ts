import type { Locale } from "@/lib/i18n/config";

export type MapViewTranslations = {
  title: string;
};

export type MapViewTranslationNamespace = Record<Locale, MapViewTranslations>;


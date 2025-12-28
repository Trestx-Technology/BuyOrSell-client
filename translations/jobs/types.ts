import type { Locale } from "@/lib/i18n/config";

export type JobsTranslations = {
  title: string;
  description: string;
};

export type JobsTranslationNamespace = Record<Locale, JobsTranslations>;


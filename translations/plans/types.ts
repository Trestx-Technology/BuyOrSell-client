import type { Locale } from "@/lib/i18n/config";

export type PlanFeature = {
  text: string;
};

export type Plan = {
  name: string;
  description: string;
  features: string[];
  buttonText: string;
};

export type PlansTranslations = {
  badge: string;
  title: string;
  subtitle: string;
  monthly: string;
  yearly: string;
  perMonth: string;
  plans: {
    basic: Plan;
    advanced: Plan;
    premium: Plan;
  };
};

export type PlansTranslationNamespace = Record<Locale, PlansTranslations>;


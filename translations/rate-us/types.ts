import type { Locale } from "@/lib/i18n/config";

export type FeedbackOption = {
  id: string;
  label: string;
};

export type RateUsTranslations = {
  title: string;
  tapToRate: string;
  howWasExperience: string;
  feedbackHelps: string;
  quickFeedback: string;
  tellUsMore: string;
  tellUsMorePlaceholder: string;
  submitRating: string;
  selectRating: string;
  thankYouFeedback: string;
  ratingSubmitted: string;
  feedbackOptions: {
    easyToUse: string;
    userFriendly: string;
    fastReliable: string;
    wouldRecommend: string;
  };
};

export type RateUsTranslationNamespace = Record<Locale, RateUsTranslations>;


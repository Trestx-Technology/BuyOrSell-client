/**
 * Terms and Conditions translations type definitions
 */
export type TermsAndConditionsTranslations = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  navigation: string;
  assistance: {
    title: string;
    description: string;
    emailSupport: string;
  };
  sections: {
    acceptance: {
      title: string;
      content: string;
    };
    eligibility: {
      title: string;
      content: string;
    };
    account: {
      title: string;
      content: string;
    };
    houseRules: {
      title: string;
      content: string;
    };
    fees: {
      title: string;
      content: string;
    };
    promotions: {
      title: string;
      content: string;
    };
    intellectualProperty: {
      title: string;
      content: string;
    };
    disclaimer: {
      title: string;
      content: string;
    };
    liability: {
      title: string;
      content: string;
    };
    governingLaw: {
      title: string;
      content: string;
    };
    modifications: {
      title: string;
      content: string;
    };
    contact: {
      title: string;
      content: string;
    };
  };
};

export type TermsAndConditionsTranslationNamespace = Record<string, TermsAndConditionsTranslations>;

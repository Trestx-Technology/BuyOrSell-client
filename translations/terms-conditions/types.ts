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
  region: string;
  sections: {
    introduction: { title: string; content: string[] };
    eligibility: { title: string; content: string[] };
    natureOfPlatform: { title: string; content: string[] };
    userObligations: { title: string; content: string[] };
    listingsAndContent: { title: string; content: string[] };
    intellectualProperty: { title: string; content: string[] };
    subscriptions: { title: string; content: string[] };
    cancellations: { title: string; content: string[] };
    uaeRules: { title: string; content: string[] };
    reviews: { title: string; content: string[] };
    communication: { title: string; content: string[] };
    thirdParty: { title: string; content: string[] };
    privacy: { title: string; content: string[] };
    cookiePolicy: { title: string; content: string[] };
    disclaimer: { title: string; content: string[] };
    liability: { title: string; content: string[] };
    indemnity: { title: string; content: string[] };
    suspension: { title: string; content: string[] };
    changes: { title: string; content: string[] };
    governingLaw: { title: string; content: string[] };
    miscellaneous: { title: string; content: string[] };
    contact: { title: string; content: string[] };
    annex1Property: { title: string; content: string[] };
    annex2Motors: { title: string; content: string[] };
    annex3Jobs: { title: string; content: string[] };
  };
};

export type TermsAndConditionsTranslationNamespace = Record<string, TermsAndConditionsTranslations>;

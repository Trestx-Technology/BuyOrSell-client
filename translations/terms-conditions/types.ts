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
    introduction: { 
      title: string; 
      items: string[];
    };
    eligibility: { 
      title: string; 
      items: string[];
    };
    natureOfPlatform: { 
      title: string; 
      intro: string;
      categories: string[];
      outro: string;
      notRole: {
        title: string;
        items: string[];
      };
      verification: string;
    };
    userObligations: { 
      title: string; 
      intro: string;
      prohibited: string[];
      outro: string;
    };
    listingsAndContent: { 
      title: string; 
      definitions: string;
      responsibilities: string[];
      rights: string;
      backups: string;
    };
    intellectualProperty: { 
      title: string; 
      ownership: string;
      licence: string;
      userGrant: string;
      userOwnership: string;
    };
    subscriptions: { 
      title: string; 
      features: string;
      payments: string;
      renewals: string;
      declined: string;
      commitment: string;
      checkoutAuth: string;
    };
    cancellations: { 
      title: string; 
      process: string;
      access: string;
      refunds: string;
      feeMod: string;
      refundMethod: string;
      alternativeMethod: string;
    };
    uaeRules: { 
      title: string; 
      exclusivity: string;
      categorization: string;
      rulesTable: {
        headers: string[];
        rows: string[][];
      };
      rulesTableTitle: string;
      specialApprovals: string;
      compliance: string;
      visibility: string;
    };
    reviews: { 
      title: string; 
      intro: string;
      guidelines: {
        intro: string;
        items: string[];
      };
      disclaimer: string;
      monitoring: string;
    };
    communication: { 
      title: string; 
      intro: string;
      prohibitions: string;
      investigation: string;
    };
    thirdParty: { 
      title: string; 
      links: string;
      policies: string;
      liability: string;
    };
    privacy: { 
      title: string; 
      intro: string;
      consent: string;
      controllerResp: string;
      security: string;
    };
    cookiePolicy: { 
      title: string; 
      intro: string;
      whatAreCookies: {
        title: string;
        content: string;
      };
      cookiesWeUse: {
        title: string;
        table: {
          headers: string[];
          rows: string[][];
        };
      };
      categories: {
        title: string;
        definitions: string[];
      };
      management: {
        title: string;
        firstVisit: string[];
        anytime: string[];
        important: string;
      };
      thirdParties: {
        title: string;
        table: {
          headers: string[];
          rows: string[][];
        };
      };
      legal: {
        title: string;
        items: string[];
      };
      children: {
        title: string;
        content: string;
      };
      transfers: {
        title: string;
        content: string;
      };
      updates: {
        title: string;
        content: string;
      };
    };
    disclaimer: { 
      title: string; 
      basis: string;
      scope: string;
      continuity: string;
      accuracy: string;
    };
    liability: { 
      title: string; 
      indirect: string;
      availability: string;
      aggregate: string;
      statutory: string;
    };
    indemnity: { 
      title: string; 
      scope: string;
      defenseControl: string;
    };
    suspension: { 
      title: string; 
      reasons: string;
      effects: string;
      userTermination: string;
    };
    changes: { 
      title: string; 
      aspects: string;
      revision: string;
      acceptance: string;
    };
    governingLaw: { 
      title: string; 
      governance: string;
      jurisdiction: string;
      amicable: string;
    };
    miscellaneous: { 
      title: string; 
      severability: string;
      nonWaiver: string;
      assignment: string;
      entireAgreement: string;
      verifiedBusiness: string;
      annexesRef: string;
    };
    contact: { 
      title: string; 
      intro: string;
      registeredEntity: string;
      labels: {
        companyName: string;
        locationAddress: string;
        directSupport: string;
        support: string;
      };
      company: string;
      address: string;
      email: string;
      phone: string;
    };
    annex1Property: { 
      title: string; 
      intro: string;
      owners: {
        title: string;
        items: string[];
      };
      brokers: {
        title: string;
        items: string[];
      };
      buyersRenters: {
        title: string;
        items: string[];
      };
    };
    annex2Motors: { 
      title: string; 
      intro: string;
      sellers: {
        title: string;
        items: string[];
      };
      proofOwnership: {
        title: string;
        content: string;
      };
    };
    annex3Jobs: { 
      title: string; 
      intro: string;
      employers: {
        title: string;
        items: string[];
      };
      jobSeekers: {
        title: string;
        items: string[];
      };
    };
  };
};

export type TermsAndConditionsTranslationNamespace = Record<string, TermsAndConditionsTranslations>;

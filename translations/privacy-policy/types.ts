/**
 * Privacy Policy translations type definitions
 */
export type PrivacyPolicyTranslations = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effective: string;
  navigation: string;
  assistance: {
    title: string;
    description: string;
    emailSupport: string;
  };
  sections: {
    glance: {
      title: string;
      items: {
        collect: string;
        why: string;
        share: string;
        rights: string;
        contact: string;
      };
    };
    whoWeAre: {
      title: string;
      content: string[];
    };
    scope: {
      title: string;
      intro: string;
      items: string[];
      outro: string;
    };
    dataWeCollect: {
      title: string;
      intro: string;
      direct: {
        title: string;
        table: {
          headers: string[];
          rows: string[][];
        };
      };
      automatic: {
        title: string;
        intro: string;
        items: string[];
      };
      thirdParty: {
        title: string;
        items: string[];
      };
    };
    howWeUse: {
      title: string;
      intro: string;
      table: {
        headers: string[];
        rows: string[][];
      };
      optOut: string;
    };
    howWeShare: {
      title: string;
      intro: string;
      visible: {
        title: string;
        intro: string;
        items: string[];
        caution: string;
      };
      serviceProviders: {
        title: string;
        intro: string;
        table: {
          headers: string[];
          rows: string[][];
        };
      };
      legal: {
        title: string;
        intro: string;
        items: string[];
      };
      business: {
        title: string;
        content: string;
      };
    };
    transfers: {
      title: string;
      content: string[];
      items: string[];
      outro: string;
    };
    retention: {
      title: string;
      intro: string;
      table: {
        headers: string[];
        rows: string[][];
      };
      outro: string;
    };
    security: {
      title: string;
      intro: string;
      items: string[];
    };
    yourRights: {
      title: string;
    };
    cookies: {
      title: string;
    };
    children: {
      title: string;
    };
    thirdParty: {
      title: string;
    };
    changes: {
      title: string;
    };
    contact: {
      title: string;
    };
  };
};

export type PrivacyPolicyTranslationNamespace = Record<string, PrivacyPolicyTranslations>;

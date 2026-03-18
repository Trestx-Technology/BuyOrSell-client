/**
 * Help Center translations type definitions
 */
export type HelpCenterTranslations = {
  title: string;
  subtitle: string;
  actions: {
    messages: string;
    myTickets: string;
    newTicket: string;
    viewAll: string;
  };
  stats: {
    total: string;
    open: string;
    inProgress: string;
    resolved: string;
  };
  recentTickets: {
    title: string;
    empty: string;
  };
  commonTopics: {
    title: string;
    accountSettings: string;
    accountSettingsDesc: string;
    billingPayments: string;
    billingPaymentsDesc: string;
    securityPrivacy: string;
    securityPrivacyDesc: string;
    learnMore: string;
  };
};

/**
 * Contact Us translations type definitions
 */
export type ContactUsTranslations = {
  title: string;
  subtitle: string;
  info: {
    title: string;
    email: string;
    phone: string;
    addressLabel: string;
    address: string;
  };
  form: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    category: string;
    categoryPlaceholder: string;
    categories: {
      general: string;
      support: string;
      sales: string;
      partnership: string;
      feedback: string;
      other: string;
    };
    subject: string;
    subjectPlaceholder: string;
    orderId: string;
    orderIdPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
  };
  responseTime: {
    title: string;
    description: string;
  };
  messages: {
    requiredFields: string;
    invalidEmail: string;
    success: string;
    error: string;
  };
  breadcrumb: {
    home: string;
    contactUs: string;
  };
};

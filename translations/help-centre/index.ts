import { createTranslationNamespace } from '../../validations/utils';
import type { HelpCenterTranslations } from './types';

export const helpCenterTranslations = createTranslationNamespace<HelpCenterTranslations>({
  'en': {
    title: 'Help Center',
    subtitle: 'Manage your support tickets and get help.',
    actions: {
      messages: 'Messages',
      myTickets: 'My Tickets',
      newTicket: 'New Ticket',
      viewAll: 'View All',
    },
    stats: {
      total: 'Total Tickets',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
    },
    recentTickets: {
      title: 'Recent Tickets',
      empty: 'No recent support tickets.',
    },
    commonTopics: {
      title: 'Common Topics',
      accountSettings: 'Account Settings',
      accountSettingsDesc: 'Learn more about account settings',
      billingPayments: 'Billing & Payments',
      billingPaymentsDesc: 'Learn more about billing & payments',
      securityPrivacy: 'Security & Privacy',
      securityPrivacyDesc: 'Learn more about security & privacy',
      learnMore: 'Learn more about {{topic}}',
    },
  },
  'ar': {
    title: 'مركز المساعدة',
    subtitle: 'إدارة تذاكر الدعم والحصول على المساعدة.',
    actions: {
      messages: 'الرسائل',
      myTickets: 'تذاكري',
      newTicket: 'تذكرة جديدة',
      viewAll: 'عرض الكل',
    },
    stats: {
      total: 'إجمالي التذاكر',
      open: 'مفتوحة',
      inProgress: 'قيد التنفيذ',
      resolved: 'تم الحل',
    },
    recentTickets: {
      title: 'التذاكر الأخيرة',
      empty: 'لا توجد تذاكر دعم أخيرة.',
    },
    commonTopics: {
      title: 'المواضيع الشائعة',
      accountSettings: 'إعدادات الحساب',
      accountSettingsDesc: 'تعرف على المزيد حول إعدادات الحساب',
      billingPayments: 'الفواتير والمدفوعات',
      billingPaymentsDesc: 'تعرف على المزيد حول الفواتير والمدفوعات',
      securityPrivacy: 'الأمن والخصوصية',
      securityPrivacyDesc: 'تعرف على المزيد حول الأمن والخصوصية',
      learnMore: 'تعرف على المزيد حول {{topic}}',
    },
  },
  'nl-NL': {
    title: 'Help Center',
    subtitle: 'Manage your support tickets and get help.',
    actions: {
      messages: 'Messages',
      myTickets: 'My Tickets',
      newTicket: 'New Ticket',
      viewAll: 'View All',
    },
    stats: {
      total: 'Total Tickets',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
    },
    recentTickets: {
      title: 'Recent Tickets',
      empty: 'No recent support tickets.',
    },
    commonTopics: {
      title: 'Common Topics',
      accountSettings: 'Account Settings',
      accountSettingsDesc: 'Learn more about account settings',
      billingPayments: 'Billing & Payments',
      billingPaymentsDesc: 'Learn more about billing & payments',
      securityPrivacy: 'Security & Privacy',
      securityPrivacyDesc: 'Learn more about security & privacy',
      learnMore: 'Learn more about {{topic}}',
    },
  },
  'nl': {
    title: 'Help Center',
    subtitle: 'Manage your support tickets and get help.',
    actions: {
      messages: 'Messages',
      myTickets: 'My Tickets',
      newTicket: 'New Ticket',
      viewAll: 'View All',
    },
    stats: {
      total: 'Total Tickets',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
    },
    recentTickets: {
      title: 'Recent Tickets',
      empty: 'No recent support tickets.',
    },
    commonTopics: {
      title: 'Common Topics',
      accountSettings: 'Account Settings',
      accountSettingsDesc: 'Learn more about account settings',
      billingPayments: 'Billing & Payments',
      billingPaymentsDesc: 'Learn more about billing & payments',
      securityPrivacy: 'Security & Privacy',
      securityPrivacyDesc: 'Learn more about security & privacy',
      learnMore: 'Learn more about {{topic}}',
    },
  },
});

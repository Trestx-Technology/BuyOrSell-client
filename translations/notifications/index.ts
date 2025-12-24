import { createTranslationNamespace } from "../../validations/utils";
import type { NotificationsTranslations } from "./types";

export const notificationsTranslations =
  createTranslationNamespace<NotificationsTranslations>({
    "en-US": {
      // Popover
      title: "Notifications",
      markAllRead: "Mark All as Read",
      markingAll: "Marking...",
      loading: "Loading...",
      noNotifications: "No notifications",
      viewAll: "View All",

      // Page
      pageTitle: "Notifications",
      pageDescription: "View and manage your notifications",
      loadingNotifications: "Loading notifications...",
      failedToLoad: "Failed to load notifications",
      failedToLoadDescription:
        "Unable to fetch notifications. Please try again later.",
      noNotificationsPage: "No notifications",
      noNotificationsDescription: "Your notifications will appear here",

      // Status
      read: "Read",
      unread: "Unread",
    },
    "nl-NL": {
      // Popover
      title: "Meldingen",
      markAllRead: "Alles als Gelezen Markeren",
      markingAll: "Markeren...",
      loading: "Laden...",
      noNotifications: "Geen meldingen",
      viewAll: "Alles Weergeven",

      // Page
      pageTitle: "Meldingen",
      pageDescription: "Bekijk en beheer je meldingen",
      loadingNotifications: "Meldingen laden...",
      failedToLoad: "Kan meldingen niet laden",
      failedToLoadDescription:
        "Kan meldingen niet ophalen. Probeer het opnieuw.",
      noNotificationsPage: "Geen meldingen",
      noNotificationsDescription: "Je meldingen verschijnen hier",

      // Status
      read: "Gelezen",
      unread: "Ongelezen",
    },
    nl: {
      // Popover
      title: "Meldingen",
      markAllRead: "Alles als Gelezen Markeren",
      markingAll: "Markeren...",
      loading: "Laden...",
      noNotifications: "Geen meldingen",
      viewAll: "Alles Weergeven",

      // Page
      pageTitle: "Meldingen",
      pageDescription: "Bekijk en beheer je meldingen",
      loadingNotifications: "Meldingen laden...",
      failedToLoad: "Kan meldingen niet laden",
      failedToLoadDescription:
        "Kan meldingen niet ophalen. Probeer het opnieuw.",
      noNotificationsPage: "Geen meldingen",
      noNotificationsDescription: "Je meldingen verschijnen hier",

      // Status
      read: "Gelezen",
      unread: "Ongelezen",
    },
    ar: {
      // Popover
      title: "الإشعارات",
      markAllRead: "تعليم الكل كمقروء",
      markingAll: "جاري التعليم...",
      loading: "جارٍ التحميل...",
      noNotifications: "لا توجد إشعارات",
      viewAll: "عرض الكل",

      // Page
      pageTitle: "الإشعارات",
      pageDescription: "عرض وإدارة الإشعارات الخاصة بك",
      loadingNotifications: "جارٍ تحميل الإشعارات...",
      failedToLoad: "فشل في تحميل الإشعارات",
      failedToLoadDescription:
        "تعذر جلب الإشعارات. يرجى المحاولة مرة أخرى لاحقاً.",
      noNotificationsPage: "لا توجد إشعارات",
      noNotificationsDescription: "ستظهر الإشعارات الخاصة بك هنا",

      // Status
      read: "مقروء",
      unread: "غير مقروء",
    },
  });

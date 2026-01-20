import type { Locale } from "@/lib/i18n/config";

export type ChatTranslations = {
  loadingChats: string;
  pleaseLogin: string;
  goToLogin: string;
  chatNotFound: string;
  failedToLoadChat: string;
  failedToSendMessage: string;
  messageDeleted: string;
  failedToDeleteMessage: string;
};

export type ChatTranslationNamespace = Record<Locale, ChatTranslations>;


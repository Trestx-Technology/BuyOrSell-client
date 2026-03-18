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
  messageEdited: string;
  failedToEditMessage: string;
  chatDeleted: string;
  failedToDeleteChat: string;
  searchPlaceholder: string;
  noChatsFound: string;
  noChatsSubtext: string;
  selectChatTitle: string;
  selectChatSubtext: string;
  sharedImage: string;
  sharedLocation: string;
  sendImage: string;
  shareLocation: string;
  messagePlaceholder: string;
  typing: string;
  deleteChat: string;
  cancel: string;
  confirmDeleteChat: string;
  online: string;
  lastSeen: string;
  lastSeenRecently: string;
  aiAssistant: string;
  aiFeatures: {
    proofread: { name: string; description: string };
    inquiry: { name: string; description: string };
    negotiation: { name: string; description: string };
    meeting: { name: string; description: string };
    translate: { name: string; description: string };
  };
  chatTypes: {
    ad: string;
    dm: string;
    organisation: string;
    ticket: string;
  };
  today: string;
  yesterday: string;
  edit: string;
  delete: string;
  saveChanges: string;
  editMessage: string;
  deleteMessage: string;
  confirmDeleteMessage: string;
  editPlaceholder: string;
  loginToChat: string;
};

export type ChatTranslationNamespace = Record<Locale, ChatTranslations>;

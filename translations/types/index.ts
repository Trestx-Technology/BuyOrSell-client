/**
 * Global/shared translation types
 */

import { type Locale } from "@/lib/i18n/config";
import { AuthTranslations } from "../auth/types";
import { HomeTranslations } from "../home/types";
import { CommonTranslations } from "../common/types";
import { AdTranslations } from "../ad/types";
import { SearchHistoryTranslations } from "../search-history/types";
import { NotificationsTranslations } from "../notifications/types";
import { FavoritesTranslations } from "../favorites/types";
import { CategoriesTranslations } from "../categories/types";
import { UserTranslations } from "../user/types";
import { type AiTokensTranslations } from "../ai-tokens/types";
import { type BlogTranslations } from "../blog/types";
import { type ConnectionsTranslations } from "../connections/types";
import { type DownloadTranslations } from "../download/types";
import { type AccountHaltedTranslations } from "../account-halted/types";
import { type MySubscriptionsTranslations } from "../my-subscriptions/types";
import { type SuccessTranslations } from "../success/types";
import { type OrganizationTranslations } from "../organizations/types";
import { SellerTranslations } from "../seller/types";
import { DealsTranslations } from "../deals/types";
import { PlansTranslations } from "../plans/types";
import { RateUsTranslations } from "../rate-us/types";
import { AIAdPostTranslations } from "../ai-ad-post/types";
import { ChatTranslations } from "../chat/types";
import { JobsTranslations } from "../jobs/types";
import { MapViewTranslations } from "../map-view/types";
import { ExchangeTranslations } from "../exchange/types";
import { ContactUsTranslations } from "../contact-us/types";
import { HelpCenterTranslations } from "../help-centre/types";
import { WatchTranslations } from "../watch/types";
import { PrivacyPolicyTranslations } from "../privacy-policy/types";
import { TermsAndConditionsTranslations } from "../terms-conditions/types";
export type { CommonTranslations } from "../common/types";

// Re-export commonly used types
export type { Locale };

// Base type for all translation namespaces
export type TranslationNamespace<T> = Record<Locale, T>;

// Import and re-export all feature-specific types

// Combined translations type
export type Translations = {
  auth: AuthTranslations;
  home: HomeTranslations;
  ad: AdTranslations;
  common: CommonTranslations;
  searchHistory: SearchHistoryTranslations;
  notifications: NotificationsTranslations;
  favorites: FavoritesTranslations;
  categories: CategoriesTranslations;
  user: UserTranslations;
  aiTokens: AiTokensTranslations;
  blog: BlogTranslations;
  connections: ConnectionsTranslations;
  download: DownloadTranslations;
  accountHalted: AccountHaltedTranslations;
  mySubscriptions: MySubscriptionsTranslations;
  success: SuccessTranslations;
  organizations: OrganizationTranslations;
  seller: SellerTranslations;
  deals: DealsTranslations;
  plans: PlansTranslations;
  rateUs: RateUsTranslations;
  aiAdPost: AIAdPostTranslations;
  chat: ChatTranslations;
  jobs: JobsTranslations;
  mapView: MapViewTranslations;
  exchange: ExchangeTranslations;
  contactUs: ContactUsTranslations;
  helpCenter: HelpCenterTranslations;
  watch: WatchTranslations;
  privacyPolicy: PrivacyPolicyTranslations;
  termsAndConditions: TermsAndConditionsTranslations;
};

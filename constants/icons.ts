/**
 * Centralized icon constants for the BuyOrSell application
 * All S3 icon URLs are organized by category for easy reuse
 */

const S3_BASE_URL = "https://dev-buyorsell.s3.me-central-1.amazonaws.com";

// ============================================================================
// LOGO & BRANDING
// ============================================================================
export const LOGO_ICONS = {
  main: `${S3_BASE_URL}/assets/logo.svg`,
  adsPosting: `${S3_BASE_URL}/assets/Ads+Posting.png`,
  authBanner: `${S3_BASE_URL}/assets/auth-banner.jpg`,
} as const;

// ============================================================================
// UI ICONS
// ============================================================================
export const UI_ICONS = {
  hamburger: `${S3_BASE_URL}/icons/hamburger.svg`,
  close: `${S3_BASE_URL}/icons/close.svg`,
  mystery: `${S3_BASE_URL}/icons/mystery.svg`,
  help: `${S3_BASE_URL}/icons/help.svg`,
  unreadChat: `${S3_BASE_URL}/icons/unread_chat.svg`,
  menWalking: `${S3_BASE_URL}/icons/man-going-for-walk.svg`,
  finishLine: `${S3_BASE_URL}/icons/finish-line.svg`,
  fallback: `/assets/fallback.png`,
  company: `/assets/company.png`,
  Map: `${S3_BASE_URL}/icons/location.png`,
} as const;

// ============================================================================
// AI & TECHNOLOGY ICONS
// ============================================================================
export const AI_ICONS = {
  aiPurpleBg: `${S3_BASE_URL}/icons/ai-purple-bg.svg`,
  aiBgWhite: `${S3_BASE_URL}/icons/ai-bg-white.svg`,
} as const;

// ============================================================================
// CURRENCY ICONS
// ============================================================================
export const CURRENCY_ICONS = {
  aed: `${S3_BASE_URL}/icons/AED.svg`,
  aedBlack: `${S3_BASE_URL}/icons/aed-icon-black.svg`,
  aedWhite: `${S3_BASE_URL}/icons/aed-icon-white.svg`,
} as const;

// ============================================================================
// AUTHENTICATION ICONS
// ============================================================================
export const AUTH_ICONS = {
  mail: `${S3_BASE_URL}/icons/mail.svg`,
  key: `${S3_BASE_URL}/icons/key.svg`,
  gmail: `${S3_BASE_URL}/icons/gmail.svg`,
  userLogin: `${S3_BASE_URL}/icons/user-login.svg`,
  verified: `/verified-seller.svg`,
} as const;

// ============================================================================
// NAVIGATION & MENU ICONS
// ============================================================================
export const NAVIGATION_ICONS = {
  profile: `${S3_BASE_URL}/icons/profile.svg`,
  explore: `${S3_BASE_URL}/icons/explore.svg`,
  search: `${S3_BASE_URL}/icons/search.svg`,
  myAds: `${S3_BASE_URL}/icons/my-ads.svg`,
  favorites: `${S3_BASE_URL}/icons/favorites.svg`,
  notificationBell: `${S3_BASE_URL}/icons/notification-bell.svg`,
  jobsDashboard: `${S3_BASE_URL}/icons/jobs-dashboard.svg`,
  offersPackages: `${S3_BASE_URL}/icons/offers-packages.svg`,
  settings: `${S3_BASE_URL}/icons/settings.svg`,
  helpCenter: `${S3_BASE_URL}/icons/help-center.svg`,
  privacyPolicy: `${S3_BASE_URL}/icons/privacy-policy.svg`,
  termsConditions: `${S3_BASE_URL}/icons/terms-conditions.svg`,
  contactUs: `${S3_BASE_URL}/icons/contact-us.svg`,
  starRate: `${S3_BASE_URL}/icons/star-rate.svg`,
  share: `${S3_BASE_URL}/icons/share.svg`,
} as const;

// ============================================================================
// JOB NAVIGATION ICONS
// ============================================================================
export const JOB_NAVIGATION_ICONS = {
  jobsDashboard: `${S3_BASE_URL}/icons/jobs-dashboard.svg`,
  jobListings: `${S3_BASE_URL}/icons/job-seeking.png`,
  myJobListings: `${S3_BASE_URL}/icons/job (1).png`,
  jobseekers: `${S3_BASE_URL}/icons/job (1).png`,
  organizations: `${S3_BASE_URL}/icons/company-building.png`,
  myJobProfile: `${S3_BASE_URL}/icons/user-profile.png`,
  myOrganization: `${S3_BASE_URL}/icons/property-budget.png`,
} as const;

// ============================================================================
// CATEGORY ICONS
// ============================================================================
export const CATEGORY_ICONS = {
  motors: `${S3_BASE_URL}/category-icons/motors.svg`,
  rent: `${S3_BASE_URL}/category-icons/rent.svg`,
  sale: `${S3_BASE_URL}/category-icons/sale.svg`,
  electronics: `${S3_BASE_URL}/category-icons/electronics.svg`,
  community: `${S3_BASE_URL}/category-icons/community.svg`,
  business: `${S3_BASE_URL}/category-icons/business.svg`,
  appliances: `${S3_BASE_URL}/category-icons/appliances.svg`,
  furniture: `${S3_BASE_URL}/category-icons/furniture.svg`,
  classifieds: `${S3_BASE_URL}/category-icons/classifieds.svg`,
  jobs: `${S3_BASE_URL}/category-icons/jobs.svg`,
} as const;

// ============================================================================
// MOTORS ICONS
// ============================================================================
export const MOTORS_ICONS = {
  cars: `${S3_BASE_URL}/category-icons/motors/cars.svg`,
  crane: `${S3_BASE_URL}/category-icons/motors/crane.svg`,
  cruiseShip: `${S3_BASE_URL}/category-icons/motors/cruise-ship.svg`,
  motorcycle: `${S3_BASE_URL}/category-icons/motors/motorcycle.svg`,
  others: `${S3_BASE_URL}/category-icons/motors/others.svg`,
} as const;

// ============================================================================
// BANNER IMAGES
// ============================================================================
export const BANNER_IMAGES = {
  estateBanner: `${S3_BASE_URL}/banners/estate-banner.png`,
} as const;

// ============================================================================
// CONSOLIDATED ICONS OBJECT
// ============================================================================
export const ICONS = {
  logo: LOGO_ICONS,
  ui: UI_ICONS,
  ai: AI_ICONS,
  currency: CURRENCY_ICONS,
  auth: AUTH_ICONS,
  navigation: NAVIGATION_ICONS,
  jobNavigation: JOB_NAVIGATION_ICONS,
  category: CATEGORY_ICONS,
  banner: BANNER_IMAGES,
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export type LogoIcon = keyof typeof LOGO_ICONS;
export type UIIcon = keyof typeof UI_ICONS;
export type AIIcon = keyof typeof AI_ICONS;
export type CurrencyIcon = keyof typeof CURRENCY_ICONS;
export type AuthIcon = keyof typeof AUTH_ICONS;
export type NavigationIcon = keyof typeof NAVIGATION_ICONS;
export type JobNavigationIcon = keyof typeof JOB_NAVIGATION_ICONS;
export type CategoryIcon = keyof typeof CATEGORY_ICONS;
export type BannerImage = keyof typeof BANNER_IMAGES;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Get icon URL by category and key
 * @param category - The icon category
 * @param key - The icon key within the category
 * @returns The full S3 URL for the icon
 */
export function getIconUrl<T extends keyof typeof ICONS>(
  category: T,
  key: keyof (typeof ICONS)[T]
): string {
  return ICONS[category][key] as string;
}

/**
 * Get all icons from a specific category
 * @param category - The icon category
 * @returns All icons from the specified category
 */
export function getIconsByCategory<T extends keyof typeof ICONS>(
  category: T
): (typeof ICONS)[T] {
  return ICONS[category];
}

// ============================================================================
// COMMON USAGE EXAMPLES
// ============================================================================
/*
// Usage examples:

// 1. Direct access
import { ICONS } from '@/constants/icons';
const logoUrl = ICONS.logo.main;
const hamburgerUrl = ICONS.ui.hamburger;

// 2. Using utility functions
import { getIconUrl, getIconsByCategory } from '@/constants/icons';
const logoUrl = getIconUrl('logo', 'main');
const allCategoryIcons = getIconsByCategory('category');

// 3. Destructuring specific categories
import { LOGO_ICONS, AI_ICONS, CATEGORY_ICONS } from '@/constants/icons';
const logoUrl = LOGO_ICONS.main;
const aiIconUrl = AI_ICONS.aiPurpleBg;
const motorsIconUrl = CATEGORY_ICONS.motors;
*/

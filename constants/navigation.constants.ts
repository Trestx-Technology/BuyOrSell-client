import React from "react";
import { LogOut, Users } from "lucide-react";
import { ICONS } from "./icons";

export type NavigationItemType = "link" | "button" | "divider";

export interface NavigationItem {
  id: string;
  type: NavigationItemType;
  href?: string;
  translationKey: string;
  icon?: React.ComponentType<{ className?: string }> | string;
  iconType?: "lucide" | "image";
  alt?: string;
  onClick?: () => void;
  className?: string;
  showDividerBefore?: boolean;
}

// Regular navigation menu items
export const REGULAR_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "profile",
    type: "link",
    href: "/user/profile",
    translationKey: "myProfile",
    icon: ICONS.navigation.profile,
    iconType: "image",
    alt: "Profile",
  },
  {
    id: "jobs-dashboard",
    type: "link",
    href: "/jobs/",
    translationKey: "jobsDashboard",
    icon: ICONS.navigation.jobsDashboard,
    iconType: "image",
    alt: "Jobs",
  },
  {
    id: "emarati-status",
    type: "link",
    href: "/user/emarati-status",
    translationKey: "Emarati Status",
    icon: ICONS.ui.emaratiStatus,
    iconType: "image",
    alt: "Emarati Status",
  },
  {
    id: "my-searches",
    type: "link",
    href: "/user/search-history",
    translationKey: "mySearches",
    icon: ICONS.navigation.search,
    iconType: "image",
    alt: "Searches",
  },

  {
    id: "my-ads",
    type: "link",
    href: "/user/profile",
    translationKey: "myAds",
    icon: ICONS.navigation.myAds,
    iconType: "image",
    alt: "Ads",
  },
  {
    id: "favorites",
    type: "link",
    href: "/favorites",
    translationKey: "favourites",
    icon: ICONS.navigation.favorites,
    iconType: "image",
    alt: "Favorites",
  },
  {
    id: "notifications",
    type: "link",
    href: "/user/notifications",
    translationKey: "notifications",
    icon: ICONS.navigation.notificationBell,
    iconType: "image",
    alt: "Notifications",
  },
  {
    id: "offers",
    type: "link",
    href: "/plans",
    translationKey: "offersPackages",
    icon: ICONS.navigation.offersPackages,
    iconType: "image",
    alt: "Offers",
  },
  {
    id: "my-subscriptions",
    type: "link",
    href: "/my-subscriptions",
    translationKey: "My Subscriptions",
    icon: ICONS.navigation.mySubscriptions,
    iconType: "image",
    alt: "My Subscriptions",
  },
  {
    id: "settings",
    type: "link",
    href: "/user/profile/settings",
    translationKey: "settings",
    icon: ICONS.navigation.settings,
    iconType: "image",
    alt: "Settings",
  },

  {
    id: "sign-out",
    type: "button",
    translationKey: "signOut",
    icon: LogOut,
    iconType: "lucide",
    className: "hover:bg-red-50 hover:text-red-700",
    showDividerBefore: true,
  },
];

// Job navigation menu items
export const JOB_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "go-home",
    type: "link",
    href: "/",
    translationKey: "Go Home",
    icon: ICONS.navigation.home,
    iconType: "image",
    alt: "Go Home",
  },
  {
    id: "jobs-dashboard",
    type: "link",
    href: "/jobs",
    translationKey: "jobsDashboard",
    icon: ICONS.jobNavigation.jobsDashboard,
    iconType: "image",
    alt: "Jobs Dashboard",
  },
  {
    id: "connections",
    type: "link",
    href: "/connections",
    translationKey: "My Connections",
    icon: ICONS.ui.connections,
    iconType: "image",
    alt: "Connections",
  },
  {
    id: "post-job",
    type: "link",
    href: "/post-job/select",
    translationKey: "Post Job",
    icon: ICONS.jobNavigation.postJob,
    iconType: "image",
    alt: "Post Job",
  },

  // {
  //   id: "job-listings",
  //   type: "link",
  //   href: "/jobs/listing",
  //   translationKey: "jobListings",
  //   icon: ICONS.jobNavigation.jobListings,
  //   iconType: "image",
  //   alt: "Job Listings",
  // },
  {
    id: "my-job-listings",
    type: "link",
    href: "/jobs/listing/my",
    translationKey: "myJobListings",
    icon: ICONS.jobNavigation.myJobListings,
    iconType: "image",
    alt: "My Job Listings",
  },
  {
    id: "jobseekers",
    type: "link",
    href: "/jobs/jobseeker",
    translationKey: "jobseekers",
    icon: ICONS.jobNavigation.jobseekers,
    iconType: "image",
    alt: "Jobseekers",
  },
  {
    id: "organizations",
    type: "link",
    href: "/organizations/my",
    translationKey: "organizations",
    icon: ICONS.jobNavigation.organizations,
    iconType: "image",
    alt: "Organizations",
  },
  {
    id: "saved-organizations",
    type: "link",
    href: "/organizations/saved",
    translationKey: "Saved Organizations",
    icon: ICONS.navigation.favorites, // reusing favorites icon or similar
    iconType: "image",
    alt: "Saved Organizations",
  },
  {
    id: "my-job-profile",
    type: "link",
    href: "/jobs/my-profile",
    translationKey: "myProfile",
    icon: ICONS.jobNavigation.myJobProfile,
    iconType: "image",
    alt: "My Job Profile",
  },
  {
    id: "sign-out",
    type: "button",
    translationKey: "signOut",
    icon: LogOut,
    iconType: "lucide",
    className: "hover:bg-red-50 hover:text-red-700",
    showDividerBefore: true,
  },
];

// SideMenu menu item interface (simpler than NavigationItem, uses labels directly)
export interface SideMenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}

// Activity section menu items for SideMenu
export const SIDE_MENU_ACTIVITY_ITEMS: SideMenuItem[] = [
  {
    id: "my-searches",
    label: "My Searches",
    icon: ICONS.navigation.search,
    href: "/user/search-history",
  },
  {
    id: "my-chats",
    label: "My Chats",
    icon: ICONS.ui.chat,
    href: "/chat",
  },
  {
    id: "emarati-status",
    label: "Emarati Status",
    icon: ICONS.ui.emaratiStatus,
    href: "/user/emarati-status",
  },
  {
    id: "view-on-map",
    label: "View on Map",
    icon: ICONS.ui.Map,
    href: "/map-view",
  },
  {
    id: "my-ads",
    label: "My Ads",
    icon: ICONS.navigation.myAds,
    href: "/user/profile",
  },
  {
    id: "saved-organizations",
    label: "Saved Organizations",
    icon: ICONS.navigation.favorites, // reusing favorites icon or similar
    href: "/organizations/saved",
  },
  {
    id: "favorites",
    label: "Favourites",
    icon: ICONS.navigation.favorites,
    href: "/favorites",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: ICONS.navigation.notificationBell,
    href: "/user/notifications",
  },
  {
    id: "jobs-dashboard",
    label: "Jobs Dashboard",
    icon: ICONS.navigation.jobsDashboard,
    href: "/jobs/",
  },
  {
    id: "offers-packages",
    label: "Offers & Packages",
    icon: ICONS.navigation.offersPackages,
    href: "/plans",
  },
  {
    id: "my-subscriptions",
    label: "My Subscriptions",
    icon: ICONS.navigation.mySubscriptions,
    href: "/my-subscriptions",
  },
  {
    id: "settings",
    label: "Settings",
    icon: ICONS.navigation.settings,
    href: "/user/profile/settings",
  },
];

// Others section menu items for SideMenu
export const SIDE_MENU_OTHERS_ITEMS: SideMenuItem[] = [
  {
    id: "help-center",
    label: "Help Center",
    icon: ICONS.navigation.helpCenter,
    href: "/help-centre",
  },
  {
    id: "privacy-policy",
    label: "Privacy Policy",
    icon: ICONS.navigation.privacyPolicy,
    href: "/privacy-policy",
  },
  {
    id: "terms-conditions",
    label: "Terms & Conditions",
    icon: ICONS.navigation.termsConditions,
    href: "/terms-conditions",
  },
  {
    id: "contact-us",
    label: "Contact Us",
    icon: ICONS.navigation.contactUs,
    href: "/contact-us",
  },
  {
    id: "rate-us",
    label: "Rate us",
    icon: ICONS.navigation.starRate,
    href: "/rate-us",
    onClick: () => {
      // Handle rating logic
      console.log("Rate us clicked");
    },
  },
  {
    id: "share",
    label: "Share with Friend",
    icon: ICONS.navigation.share,
    onClick: () => {
      // Handle sharing logic
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator.share({
          title: "BuyOrSell",
          text: "Check out this amazing marketplace app!",
          url: window.location.origin,
        });
      }
    },
  },
];

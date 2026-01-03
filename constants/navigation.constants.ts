import React from "react";
import {
 
  LogOut,
 
} from "lucide-react";
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
    id: "my-searches",
    type: "link",
    href: "/user/searches",
    translationKey: "mySearches",
    icon: ICONS.navigation.search,
    iconType: "image",
    alt: "Searches",
  },
  {
    id: "my-ads",
    type: "link",
    href: "/user/ads",
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
    href: "/user/offers",
    translationKey: "offersPackages",
    icon: ICONS.navigation.offersPackages,
    iconType: "image",
    alt: "Offers",
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
    id: "jobs-dashboard",
    type: "link",
    href: "/jobs",
    translationKey: "jobsDashboard",
    icon: ICONS.jobNavigation.jobsDashboard,
    iconType: "image",
    alt: "Jobs Dashboard",
  },
  {
    id: "job-listings",
    type: "link",
    href: "/jobs/listing",
    translationKey: "jobListings",
    icon: ICONS.jobNavigation.jobListings,
    iconType: "image",
    alt: "Job Listings",
  },
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
    href: "/jobs/organization",
    translationKey: "organizations",
    icon: ICONS.jobNavigation.organizations,
    iconType: "image",
    alt: "Organizations",
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
    id: "my-organization",
    type: "link",
    href: "/jobs/organization/me",
    translationKey: "myOrganization",
    icon: ICONS.jobNavigation.myOrganization,
    iconType: "image",
    alt: "My Organization",
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

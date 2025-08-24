"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import logo from "@/public/assets/logo.svg";
import { Typography } from "../typography";

// Import your Figma icons
import notificationBell from "@/public/icons/notification-bell.svg";
import userLogin from "@/public/icons/user-login.svg";
import explore from "@/public/icons/explore.svg";
import search from "@/public/icons/search.svg";
import myAds from "@/public/icons/my-ads.svg";
import favorites from "@/public/icons/favorites.svg";
import jobsDashboard from "@/public/icons/jobs-dashboard.svg";
import offersPackages from "@/public/icons/offers-packages.svg";
import settings from "@/public/icons/settings.svg";
import helpCenter from "@/public/icons/help-center.svg";
import privacyPolicy from "@/public/icons/privacy-policy.svg";
import termsConditions from "@/public/icons/terms-conditions.svg";
import contactUs from "@/public/icons/contact-us.svg";
import starRate from "@/public/icons/star-rate.svg";
import share from "@/public/icons/share.svg";
import profile from "@/public/icons/profile.svg";

interface SideMenuProps {
  trigger: React.ReactNode;
  isLoggedIn?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

interface MenuItemProps {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  hasArrow?: boolean;
  showBorder?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  href,
  onClick,
  hasArrow = true,
  showBorder = true,
}) => {
  const content = (
    <div
      className={`flex items-center justify-between w-full py-3 hover:bg-purple/10 group transition-colors ${
        showBorder ? "border-b border-[#E5E5E5]" : ""
      }`}
    >
      <div className="flex items-center gap-3 px-6">
        <div className="w-6 h-6 flex-shrink-0">
          <Image src={icon} alt={label} width={24} height={24} />
        </div>
        <Typography
          variant="xs-regular-inter"
          className="text-xs font-medium text-[#475467] group-hover:text-purple"
        >
          {label}
        </Typography>
      </div>
      {hasArrow && (
        <ChevronRight className="w-5 h-5 text-[#667085] group-hover:text-purple" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-6 py-3">
    <Typography
      variant="sm-semibold-inter"
      className="text-sm font-semibold text-[#1D2939]"
    >
      {title}
    </Typography>
  </div>
);

export const SideMenu: React.FC<SideMenuProps> = ({
  trigger,
  isLoggedIn = false,
  user,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="w-[375px] p-0 gap-0">
        <SheetHeader className="p-0">
          {/* Header Section */}
          <div className={`${isLoggedIn ? "bg-purple" : "bg-white"} px-4 py-4`}>
            {!isLoggedIn && (
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt="BuyOrSell Logo"
                    width={125}
                    height={36}
                  />
                </div>

                {/* Close Button */}
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={`${isLoggedIn ? "text-white hover:bg-white/10" : "text-black hover:bg-gray-100"}`}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </div>
            )}

            {/* User Info (if logged in) */}
            {isLoggedIn && user && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 max-w-[120px]">
                    <Typography
                      variant="sm-semibold-inter"
                      className="text-white truncate"
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="xs-regular-inter"
                      className="text-white/80 text-xs truncate"
                    >
                      {user.email}
                    </Typography>
                  </div>
                  {user.isVerified && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white text-white text-xs px-3 py-1 hover:bg-white hover:text-purple"
                    >
                      Verify Account
                    </Button>
                  )}
                </div>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`px-2 text-white hover:bg-gray-100`}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </div>
            )}
          </div>
        </SheetHeader>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Personal Section */}
          <div className="py-0">
            <SectionHeader title="Personal" />

            {!isLoggedIn ? (
              <MenuItem
                icon={userLogin}
                label="Log In / Sign Up"
                href="/login"
                showBorder={false}
              />
            ) : (
              <MenuItem icon={profile} label="Profile" href="/profile" />
            )}
          </div>

          {/* Explore Section */}
          <div className="py-0">
            <SectionHeader title="Explore" />
            <MenuItem icon={explore} label="Explore" href="/explore" />
          </div>

          {/* Activity Section */}
          <div className="py-2">
            <SectionHeader title="Activity" />
            <MenuItem icon={search} label="My Searches" href="/searches" />

            <MenuItem icon={myAds} label="My Ads" href="/my-ads" />

            <MenuItem icon={favorites} label="Favourites" href="/favourites" />

            <MenuItem
              icon={notificationBell}
              label="Notifications"
              href="/notifications"
            />

            <MenuItem
              icon={jobsDashboard}
              label="Jobs Dashboard"
              href="/jobs"
            />

            <MenuItem
              icon={offersPackages}
              label="Offers & Packages"
              href="/offers"
            />

            <MenuItem icon={settings} label="Settings" href="/settings" />
          </div>

          {/* Others Section */}
          <div className="py-2">
            <SectionHeader title="Others" />
            <MenuItem icon={helpCenter} label="Help Center" href="/help" />

            <MenuItem
              icon={privacyPolicy}
              label="Privacy Policy"
              href="/privacy"
            />

            <MenuItem
              icon={termsConditions}
              label="Terms & Conditions"
              href="/terms"
            />

            <MenuItem icon={contactUs} label="Contact Us" href="/contact" />

            <MenuItem
              icon={starRate}
              label="Rate us"
              onClick={() => {
                // Handle rating logic
                console.log("Rate us clicked");
              }}
            />

            <MenuItem
              icon={share}
              label="Share with Friend"
              onClick={() => {
                // Handle sharing logic
                if (navigator.share) {
                  navigator.share({
                    title: "BuyOrSell",
                    text: "Check out this amazing marketplace app!",
                    url: window.location.origin,
                  });
                }
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;

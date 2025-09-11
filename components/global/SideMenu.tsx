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

import { Typography } from "../typography";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isActive = href && pathname.includes(href);
  const content = (
    <div
      className={`flex items-center justify-between w-full py-3 pr-4 hover:bg-purple/10 group transition-colors ${
        showBorder ? "border-b border-[#E5E5E5]" : ""
      } ${isActive ? "bg-purple text-white" : ""}`}
    >
      <div className="flex items-center gap-3 px-6">
        <div className=" size-7 flex-shrink-0">
          <Image src={icon} alt={label} width={28} height={28} />
        </div>
        <Typography
          variant="xs-regular-inter"
          className={`text-xs font-medium text-[#475467] group-hover:text-purple ${
            isActive ? "text-white" : ""
          }`}
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
                    src={
                      "https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/logo.svg"
                    }
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
                icon={
                  "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/user-login.svg"
                }
                label="Log In / Sign Up"
                href="/login"
                showBorder={false}
              />
            ) : (
              <MenuItem
                icon={
                  "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/profile.svg"
                }
                label="Profile"
                href="/profile"
              />
            )}
          </div>

          {/* Explore Section */}
          <div className="py-0">
            <SectionHeader title="Explore" />
            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/explore.svg"
              }
              label="Explore"
              href="/explore"
            />
          </div>

          {/* Activity Section */}
          <div className="py-2">
            <SectionHeader title="Activity" />
            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/search.svg"
              }
              label="My Searches"
              href="/searches"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/my-ads.svg"
              }
              label="My Ads"
              href="/my-ads"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/favorites.svg"
              }
              label="Favourites"
              href="/favourites"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/notification-bell.svg"
              }
              label="Notifications"
              href="/notifications"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/jobs-dashboard.svg"
              }
              label="Jobs Dashboard"
              href="/jobs"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/offers-packages.svg"
              }
              label="Offers & Packages"
              href="/offers"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/settings.svg"
              }
              label="Settings"
              href="/settings"
            />
          </div>

          {/* Others Section */}
          <div className="py-2">
            <SectionHeader title="Others" />
            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/help-center.svg"
              }
              label="Help Center"
              href="/help"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/privacy-policy.svg"
              }
              label="Privacy Policy"
              href="/privacy"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/terms-conditions.svg"
              }
              label="Terms & Conditions"
              href="/terms"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/contact-us.svg"
              }
              label="Contact Us"
              href="/contact"
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/star-rate.svg"
              }
              label="Rate us"
              onClick={() => {
                // Handle rating logic
                console.log("Rate us clicked");
              }}
            />

            <MenuItem
              icon={
                "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/share.svg"
              }
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

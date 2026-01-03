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
import { useMyOrganization } from "@/hooks/useOrganizations";
import { Organization } from "@/interfaces/organization.types";
import {
  SIDE_MENU_ACTIVITY_ITEMS,
  SIDE_MENU_OTHERS_ITEMS,
  SideMenuItem,
} from "@/constants/navigation.constants";
import { useRouter } from "nextjs-toploader/app";

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

interface OrganizationItemProps {
  organization: Organization;
  onClick?: () => void;
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({
  organization,
  onClick,
}) => {
  // Format location (City, Country)
  const getLocation = (): string => {
    const city = organization.city || "";
    const country = organization.country || "AE";
    return city ? `${city}, ${country}` : country;
  };

  // Get organization display name
  const displayName =
    organization.tradeName || organization.legalName || "Organization";

  // Get organization type - show as-is from API
  const organizationType = organization.type || "ORGANIZATION";

  // Get status badge text and color
  const getStatusBadge = () => {
    const status = organization.status?.toLowerCase();
    if (!status) return null;

    const statusConfig: Record<
      string,
      { text: string; bgColor: string; textColor: string }
    > = {
      pending: {
        text: "Draft",
        bgColor: "bg-[#FFF4E6]",
        textColor: "text-[#B88230]",
      },
      active: {
        text: "Active",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
      },
      inactive: {
        text: "Inactive",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      },
      suspended: {
        text: "Suspended",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
      <div
        className={`px-2 py-1 ${config.bgColor} rounded-md flex-shrink-0 mr-4`}
      >
        <Typography
          variant="xs-regular-inter"
          className={`text-xs font-medium ${config.textColor}`}
        >
          {config.text}
        </Typography>
      </div>
    );
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-3 pr-4 hover:bg-purple/10 group transition-colors border-b border-[#E5E5E5]"
    >
      <div className="flex items-center gap-3 px-6 flex-1 min-w-0">
        {/* Organization Icon */}
        <div className="size-7 flex-shrink-0">
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={displayName}
              width={28}
              height={28}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-purple/20 rounded flex items-center justify-center">
              <Typography
                variant="xs-regular-inter"
                className="text-purple font-semibold text-xs"
              >
                {displayName.charAt(0).toUpperCase()}
              </Typography>
            </div>
          )}
        </div>

        {/* Organization Details */}
        <div className="flex-1 text-left min-w-0">
          <Typography
            variant="xs-regular-inter"
            className="text-xs font-semibold text-[#1D2939] truncate"
          >
            {displayName}
          </Typography>
          <Typography
            variant="xs-regular-inter"
            className="text-xs text-[#8A8A8A] truncate"
          >
            {organizationType.toUpperCase()} • {getLocation()}
          </Typography>
        </div>
      </div>

      {/* Status Badge */}
      {getStatusBadge()}
    </button>
  );
};

export const SideMenu: React.FC<SideMenuProps> = ({
  trigger,
  isLoggedIn = false,
  user,
}) => {
  // Fetch current user's organization using /organizations/me endpoint
  const { data: myOrganizationData } = useMyOrganization();
  const router = useRouter();

  const organizations = myOrganizationData?.data ?? [];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="min-w-[250px] p-0 gap-0">
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
                    className={`${
                      isLoggedIn
                        ? "text-white hover:bg-white/10"
                        : "text-black hover:bg-gray-100"
                    }`}
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

          {/* My Organizations Section */}
          {isLoggedIn && organizations.length > 0 && (
            <div className="py-0">
              <div className="flex items-center justify-between px-6 py-3">
                <Typography
                  variant="sm-semibold-inter"
                  className="text-sm font-semibold text-[#1D2939]"
                >
                  My Organizations
                </Typography>
                <Link href="/jobs/organization">
                  <Typography
                    variant="xs-regular-inter"
                    className="text-xs text-purple hover:text-purple/80 cursor-pointer"
                  >
                    View All
                  </Typography>
                </Link>
              </div>
              {organizations?.map((org) => (
                <OrganizationItem
                  key={org._id}
                  organization={org}
                  onClick={() => {
                    router.push(`/jobs/organization/${org._id}`);
                    // Navigate to organization details or dashboard
                  }}
                />
              ))}
            </div>
          )}

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
            {SIDE_MENU_ACTIVITY_ITEMS.map((item: SideMenuItem) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                onClick={item.onClick}
              />
            ))}
          </div>

          {/* Others Section */}
          <div className="py-2">
            <SectionHeader title="Others" />
            {SIDE_MENU_OTHERS_ITEMS.map((item: SideMenuItem) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;

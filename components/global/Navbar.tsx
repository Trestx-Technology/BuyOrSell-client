"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SideMenu from "./SideMenu";
import { SearchAnimated } from "./ai-search-bar";
import PostAdDialog from "@/app/[locale]/(root)/post-ad/_components/PostAdDialog";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NavigationMenu } from "./navigation-menu";
import { JobNavigationMenu } from "./job-navigation-menu";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logout as LogoutAPI } from "@/app/api/auth/auth.services";
import { toast } from "sonner";
import { useEmirates } from "@/hooks/useLocations";
import { createUrlParamHandler } from "@/utils/url-params";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useLocale } from "@/hooks/useLocale";

// Internal component that uses useSearchParams
const NavbarContent = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [city, setCity] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.session.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: emirates, isLoading: isLoadingEmirates } = useEmirates();
  const { t, locale } = useLocale();
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Initialize city from URL query parameter
  useQueryParam(searchParams, "emirate", setCity);

  // Update URL when city changes
  const handleCityChange = createUrlParamHandler(
    searchParams,
    pathname,
    router,
    "emirate",
    setCity
  );

  const handleLogout = async () => {
    // Call API logout endpoint (clears server-side session, localStorage, and cookies)
    await LogoutAPI();
    // Always clear Zustand store state and redirect, even if API call failed
    await clearSession();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="w-full bg-white">
      <nav
        className={cn(
          "flex container-1080 gap-2 mx-auto items-center w-full py-2 px-4 xl:px-0 justify-between overflow-visible",
          locale === "ar" ? "flex-row-reverse" : "flex-row",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {/*-------------- Side Menu for mobile devices---------- */}
          <SideMenu
            user={
              user
                ? {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    avatar: user.image || "/images/ai-prompt/add-image.png",
                    isVerified: user.emailVerified,
                  }
                : undefined
            }
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                iconPosition="center"
                className="bg-[#F2F4F7] rounded-full size-8 border-[#E7E7E7] hover:bg-transparent md:hidden"
                icon={
                  <Image
                    src={ICONS.ui.hamburger}
                    width={18}
                    height={18}
                    alt="Hamburger Menu"
                  />
                }
              />
            }
            isLoggedIn={isAuthenticated}
          />

          {/*-------------- Logo and Brand Name---------- */}
          <Link href="/" className="flex items-center">
            <Image
              src={ICONS.logo.main}
              alt="BuyOrSell Logo"
              width={156}
              height={49}
            />
          </Link>
        </div>

        {/*-------------- Center Section - Location and Search---------- */}
        <div className="flex items-start gap-2 md:flex-1">
          <Button
            variant="ghost"
            size="icon"
            icon={<Bell className="size-5 mx-1" />}
            iconPosition="center"
            className="md:hidden"
          />

          {/*---------- Location Selector for desktop devices---------- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                icon={<ChevronDown className="-ml-3" />}
                iconPosition="right"
                className="py-2 text-xs text-secondary-40 hover:text-purple transition-colors whitespace-nowrap border-0 px-0 shadow-none data-[state=open]:text-purple focus:outline-none focus:ring-0 hover:bg-transparent"
              >
                {city || "UAE"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit text-xs max-h-[300px] overflow-y-auto z-[60]"
              align="start"
            >
              <DropdownMenuItem onClick={() => handleCityChange("")}>
                All Cities (UAE)
              </DropdownMenuItem>
              {/* TODO: fix this */}
              {isLoadingEmirates
                ? Array.from({ length: 5 }).map((_, i) => (
                    <DropdownMenuItem key={i}>
                      <div className="animate-pulse bg-gray-300 h-5 w-full rounded-sm"></div>
                    </DropdownMenuItem>
                  ))
                : emirates?.map((emirate) => {
                    // Extract emirate properties
                    const emirateName = emirate.emirate;
                    const emirateNameAr = emirate.emirateAr;

                    // Display Arabic if locale is ar, otherwise English
                    const displayName =
                      locale === "ar" ? emirateNameAr : emirateName;
                    // Use English name for URL/state (consistent identifier)
                    const emirateValue = emirateName;

                    return (
                      <DropdownMenuItem
                        key={emirateName}
                        onClick={() => handleCityChange(emirateValue)}
                        className={cn(
                          "cursor-pointer",
                          city === emirateValue
                            ? "bg-purple/20 text-purple"
                            : ""
                        )}
                      >
                        {displayName}
                      </DropdownMenuItem>
                    );
                  })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex flex-1 ">
            <SearchAnimated />
          </div>
        </div>

        {/*-------------- Right Section - Action Buttons---------- */}
        <div className="hidden md:flex items-center gap-5 ml-2">
          {/*-------------- User Menu---------- */}
          {isAuthenticated && user ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 hover:bg-purple-100 transition-colors">
                  <div className="size-[35px] rounded-full border-2 border-purple overflow-hidden bg-purple-100 flex items-center justify-center">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="Profile"
                        className="object-cover w-full h-full"
                        width={35}
                        height={35}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-purple">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="size-5 text-purple" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-50 p-0" align="end">
                {pathname?.includes("/jobs") ? (
                  <JobNavigationMenu
                    onLogout={handleLogout}
                    onClose={() => setPopoverOpen(false)}
                    translations={{
                      jobsDashboard:
                        t.home.navbar.jobsDashboard || "Jobs Dashboard",
                      jobListings: "Job Listings",
                      myJobListings: "My Job Listings",
                      jobseekers: "Jobseekers",
                      organizations: "Organizations",
                      myProfile: "My Job Profile",
                      myOrganization: "My Organization",
                      signOut: t.home.navbar.signOut,
                    }}
                  />
                ) : (
                  <NavigationMenu
                    onLogout={handleLogout}
                    onClose={() => setPopoverOpen(false)}
                    translations={{
                      myProfile: t.home.navbar.myProfile,
                      jobsDashboard: t.home.navbar.jobsDashboard,
                      mySearches: t.home.navbar.mySearches,
                      myAds: t.home.navbar.myAds,
                      favourites: t.home.navbar.favourites,
                      notifications: t.home.navbar.notifications,
                      offersPackages: t.home.navbar.offersPackages,
                      settings: t.home.navbar.settings,
                      signOut: t.home.navbar.signOut,
                    }}
                  />
                )}
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/methods" className="text-xs font-medium text-purple">
              {t.home.navbar.logIn}
            </Link>
          )}

          {/*-------------- Place Ad Button---------- */}
          <PostAdDialog>
            <Button
              variant="filled"
              size="icon-sm"
              iconPosition="right"
              icon={
                <Image
                  src={ICONS.ai.aiPurpleBg}
                  alt="AI Logo"
                  width={24}
                  height={24}
                />
              }
              className="px-4 text-xs font-medium text-white h-10"
            >
              <span className="hidden lg:block">{t.home.navbar.placeAd}</span>
              <span className="block lg:hidden">
                {t.home.navbar.placeAdShort}
              </span>
            </Button>
          </PostAdDialog>
        </div>
      </nav>
    </div>
  );
};

//-------------- Main Navbar component with Suspense wrapper---------- */}
const Navbar = ({ className }: { className?: string }) => {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b" />}>
      <NavbarContent className={className} />
    </Suspense>
  );
};

export default Navbar;

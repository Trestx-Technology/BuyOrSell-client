"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SideMenu from "./SideMenu";
import { SearchAnimated } from "./ai-search-bar";
import PostAdDialog from "../../app/(root)/post-ad/_components/PostAdDialog";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logout as LogoutAPI } from '@/app/api/auth/auth.services';
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
  const [isPostAdDialogOpen, setIsPostAdDialogOpen] = useState(false);
  const { isAuthenticated, session, clearSession } = useAuthStore();
  const user = session.user;
  const { data: emirates, isLoading: isLoadingEmirates } = useEmirates();
  const { t,locale } = useLocale();

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
    try {
      // Call API logout endpoint (clears server-side session, localStorage, and cookies)
      await LogoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local session
    } finally {
      // Always clear Zustand store state and redirect, even if API call failed
      await clearSession();
      
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full bg-white">
      <nav
        className={cn(
          "flex max-w-[1080px] gap-2 mx-auto items-center w-full py-2 px-4 xl:px-0 justify-between overflow-visible",
          className,
          locale === 'ar' ? 'flex-row-reverse' : 'flex-row'
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
                      avatar: "/images/ai-prompt/add-image.png",
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
                className="w-fit text-xs max-h-[300px] overflow-y-auto"
                align="start"
              >
                <DropdownMenuItem onClick={() => handleCityChange("")}>
                  All Cities (UAE)
              </DropdownMenuItem>
              {/* TODO: fix this */}
                {isLoadingEmirates ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <DropdownMenuItem key={i}>
                      <div className="animate-pulse bg-gray-300 h-5 w-full rounded-sm"></div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  emirates?.map((emirate) => {
                    // Extract emirate properties
                    const emirateName = emirate.emirate;
                    const emirateNameAr = emirate.emirateAr;
                    
                    // Display Arabic if locale is ar, otherwise English
                    const displayName = locale === 'ar' ? emirateNameAr : emirateName;
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
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          <div className="hidden md:flex flex-1">
            <SearchAnimated />
          </div>
        </div>

        {/*-------------- Right Section - Action Buttons---------- */}
        <div className="hidden md:flex items-center gap-5 ml-2">
          {/*-------------- User Menu---------- */}
          {isAuthenticated && user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 hover:bg-purple-100 transition-colors">
                  <div className="size-[35px] rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
                    {user.firstName && user.lastName ? (
                      <span className="text-sm font-semibold text-purple">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    ) : (
                      <Image
                        src={"/images/ai-prompt/add-image.png"}
                        alt="Profile"
                        className="object-cover w-full h-full"
                        width={35}
                        height={35}
                      />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-50 p-0" align="end">
                <div className="space-y-1">
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.profile}
                      alt="Profile"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.myProfile}
                  </Link>

                  <Link
                    href="/jobs/"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.jobsDashboard}
                      alt="Jobs"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.jobsDashboard}
                  </Link>

                  <Link
                    href="/user/searches"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.search}
                      alt="Searches"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.mySearches}
                  </Link>

                  <Link
                    href="/user/ads"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.myAds}
                      alt="Ads"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.myAds}
                  </Link>

                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.favorites}
                      alt="Favorites"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.favourites}
                  </Link>

                  <Link
                    href="/user/notifications"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.notificationBell}
                      alt="Notifications"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.notifications}
                  </Link>

                  <Link
                    href="/user/offers"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.offersPackages}
                      alt="Offers"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.offersPackages}
                  </Link>

                  <Link
                    href="/user/profile/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple"
                  >
                    <Image
                      src={ICONS.navigation.settings}
                      alt="Settings"
                      width={24}
                      height={24}
                    />
                    {t.home.navbar.settings}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-50 hover:text-red-700 transition-colors text-gray-700 hover:text-red-700 w-full"
                  >
                    <LogOut className="w-6 h-6" />
                    {t.home.navbar.signOut}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/methods" className="text-xs font-medium text-purple">
              {t.home.navbar.logIn}
            </Link>
          )}

          {/*-------------- Place Ad Button---------- */}

          <Button
            variant="filled"
            size="icon-sm"
            iconPosition="right"
            onClick={() => setIsPostAdDialogOpen(true)}
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
            <span className="block lg:hidden">{t.home.navbar.placeAdShort}</span>
          </Button>
        </div>
      </nav>

      {/*-------------- Post Ad Dialog---------- */}
      <PostAdDialog
        isOpen={isPostAdDialogOpen}
        onClose={() => setIsPostAdDialogOpen(false)}
      />
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

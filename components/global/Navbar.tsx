"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Bell,  } from "lucide-react";
import { Button } from "@/components/ui/button";

import EmirateSelector from "./EmirateSelector";
import { AITokenBalance } from "./AITokenBalance";

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
import { UnifiedProfileMenu } from "./unified-profile-menu";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logout as LogoutAPI } from "@/app/api/auth/auth.services";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";

// Internal component that uses useSearchParams
const NavbarContent = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.session.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { t, locale } = useLocale();
  const [popoverOpen, setPopoverOpen] = useState(false);

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
            width={150}
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
        {/*---------- Location Selector for desktop devices---------- */}
        <EmirateSelector />

        <div className="hidden md:flex flex-1 relative group">
            <SearchAnimated />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-[10px] text-gray-400 pointer-events-none hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <kbd className="font-sans">Ctrl</kbd>
            <span>+</span>
            <kbd className="font-sans">K</kbd>
          </div>
          </div>
        </div>

        {/*-------------- Right Section - Action Buttons---------- */}
        <div className="hidden md:flex items-center gap-5 ml-2">
          {/*-------------- User Menu---------- */}
          {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <AITokenBalance />
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
              <PopoverContent className="w-fit p-0 rounded-xl border-none shadow-none" align="end">
                <UnifiedProfileMenu
                  onLogout={handleLogout}
                  onClose={() => setPopoverOpen(false)}
                />
              </PopoverContent>
            </Popover>
          </div>
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
  );
};

//-------------- Main Navbar component with Suspense wrapper---------- */}
const Navbar = ({ className }: { className?: string }) => {
  return (
    <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" />}>
      <NavbarContent className={className} />
    </Suspense>
  );
};

export default Navbar;

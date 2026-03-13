"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Navbar from "@/components/global/Navbar";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
import { CommandMenu } from "@/components/global/command-menu";
import { SearchAdsDialog } from "@/components/global/search-ads-dialog";
import { useEmirateInvalidation } from "@/hooks/useEmirateInvalidation";
import {
  PAGES_WITH_NAV,
  PAGES_WITH_NAV_MOBILE,
  PAGES_WITHOUT_NAV,
  shouldShowComponent,
} from "@/constants/layout.constants";
import { MobileAppStrip } from "@/components/global/MobileAppStrip";
import { Container1280 } from "./container-1280";
import { Container1080 } from "./container-1080";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const pathname = usePathname();
  useEmirateInvalidation();

  // Determine visibility based on props and constants
  const shouldShowNav = useMemo(() => {
    return shouldShowComponent(pathname || "", PAGES_WITH_NAV);
  }, [pathname]);

  const shouldHideNavOnMobile = useMemo(() => {
    // Only hide on mobile if page is in both PAGES_WITH_NAV and PAGES_WITH_NAV_MOBILE
    return shouldShowComponent(pathname || "", PAGES_WITH_NAV_MOBILE);
  }, [pathname]);

  const shouldHideNavCompletely = useMemo(() => {
    return shouldShowComponent(pathname || "", PAGES_WITHOUT_NAV);
  }, [pathname]);

  // Check if current path is root '/'
  const isRootPage = useMemo(() => {
    const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, "") || "/";
    return pathWithoutLocale === "/";
  }, [pathname]);

  const isBlogPage = useMemo(() => {
    const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, "") || "/";
    return pathWithoutLocale.startsWith("/blog");
  }, [pathname]);

  // Determine navbar className
  const navbarClassName = useMemo(() => {
    // Hide on blog pages or specific without-nav pages
    if (isBlogPage || shouldHideNavCompletely) return "hidden";
    // Root page: always visible (no hidden class)
    if (isRootPage) return "";
    // Pages in PAGES_WITH_NAV: check mobile hiding
    if (shouldShowNav) {
      return shouldHideNavOnMobile ? "hidden sm:flex" : "";
    }
    // Pages NOT in PAGES_WITH_NAV: desktop only
    return "hidden sm:flex";
  }, [
    isRootPage,
    shouldShowNav,
    shouldHideNavOnMobile,
    isBlogPage,
    shouldHideNavCompletely,
  ]);

  const categoryNavClassName = useMemo(() => {
    // Hide on blog pages or specific without-nav pages
    if (isBlogPage || shouldHideNavCompletely) return "hidden";
    // Root page: always visible (no hidden class)
    if (isRootPage) return "";
    // Pages in PAGES_WITH_NAV: check mobile hiding
    if (shouldShowNav) {
      return shouldHideNavOnMobile ? "hidden md:flex" : "";
    }
    // Pages NOT in PAGES_WITH_NAV: desktop only
    return "hidden md:flex";
  }, [
    isRootPage,
    shouldShowNav,
    shouldHideNavOnMobile,
    isBlogPage,
    shouldHideNavCompletely,
  ]);

  return (
    <main className="min-h-[600px] relative flex flex-col bg-white dark:bg-gray-950">
      <div className="sticky top-0 z-50 flex flex-col items-center">
        {!shouldHideNavCompletely && <MobileAppStrip />}
        <Container1080
          className={cn(
            "w-full bg-white dark:bg-gray-900 flex px-4 xl:px-0  flex-col items-center",
            shouldHideNavCompletely && "hidden",
          )}
        >
          <Navbar className={navbarClassName} />
          <CategoryNav className={categoryNavClassName} />
        </Container1080>
      </div>
      <section className="w-full mx-auto flex-grow">{children}</section>
      <CommandMenu />
      <SearchAdsDialog />
    </main>
  );
}

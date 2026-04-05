"use client";

import React, { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Navbar from "@/components/global/Navbar";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
import { CommandMenu } from "@/components/global/command-menu";
import { SearchAdsDialog } from "@/components/global/search-ads-dialog";
import { useEmirateInvalidation } from "@/hooks/useEmirateInvalidation";
import { Footer } from "@/components/global/footer";
import {
  PAGES_WITH_NAV,
  PAGES_WITH_NAV_MOBILE,
  PAGES_WITHOUT_NAV,
  PAGES_WITHOUT_FOOTER,
  shouldShowComponent,
} from "@/constants/layout.constants";
import { MobileAppStrip } from "@/components/global/MobileAppStrip";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isMobileView = type === "mobile";
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
    return isMobileView || shouldShowComponent(pathname || "", PAGES_WITHOUT_NAV);
  }, [pathname, isMobileView]);

  const shouldHideFooter = useMemo(() => {
    return shouldHideNavCompletely || shouldShowComponent(pathname || "", PAGES_WITHOUT_FOOTER);
  }, [pathname, shouldHideNavCompletely]);

  // Check if current path is root '/'
  const isRootPage = useMemo(() => {
    const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, "") || "/";
    return pathWithoutLocale === "/";
  }, [pathname]);

  const isBlogPage = useMemo(() => {
    const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, "") || "/";
    return pathWithoutLocale.startsWith("/blog");
  }, [pathname]);

  const isChatOrHelpCenter = useMemo(() => {
    const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, "") || "/";
    return (
      pathWithoutLocale.startsWith("/chat") ||
      pathWithoutLocale.startsWith("/help-centre")
    );
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
    <main
      className={cn(
        "min-h-[600px] relative flex flex-col bg-white dark:bg-gray-950",
        isChatOrHelpCenter && "h-screen overflow-hidden",
      )}
    >
      <div className="sticky w-full bg-white dark:bg-gray-900 top-0 z-50 flex flex-col items-center">
        {!shouldHideNavCompletely && <MobileAppStrip />}
        <div
          className={cn(
            "w-full max-w-[1180px] flex px-4 xl:px-0  flex-col items-center",
            shouldHideNavCompletely && "hidden",
          )}
        >
          <Navbar className={navbarClassName} />
          <CategoryNav className={categoryNavClassName} />
        </div>
      </div>
      <section
        className={cn(
          "w-full mx-auto flex-grow",
          isChatOrHelpCenter && "h-full overflow-hidden flex flex-col",
        )}
      >
        {children}
      </section>
      <CommandMenu />
      <SearchAdsDialog />
      {!shouldHideFooter && <Footer />}
    </main>
  );
}

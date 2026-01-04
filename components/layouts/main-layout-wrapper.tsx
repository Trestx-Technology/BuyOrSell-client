"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/global/Navbar";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
import { Footer } from "@/components/global/footer";
import {
  PAGES_WITH_NAV,
  PAGES_WITH_NAV_MOBILE,
  shouldShowComponent,
} from "@/constants/layout.constants";
import { cn } from "@/lib/utils";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const pathname = usePathname();

  // Determine visibility based on props and constants
  const shouldShowNav = useMemo(() => {
    return shouldShowComponent(pathname || "", PAGES_WITH_NAV);
  }, [pathname]);

  const shouldHideNavOnMobile = useMemo(() => {
    // Only hide on mobile if page is in both PAGES_WITH_NAV and PAGES_WITH_NAV_MOBILE
    return shouldShowComponent(pathname || "", PAGES_WITH_NAV_MOBILE);
  }, [pathname]);

  // Check if current path is root '/'
  const isRootPage = useMemo(() => {
    const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, "") || "/";
    return pathWithoutLocale === "/";
  }, [pathname]);

  // Determine navbar className
  const navbarClassName = useMemo(() => {
    // Root page: always visible (no hidden class)
    if (isRootPage) return "";
    // Pages in PAGES_WITH_NAV: check mobile hiding
    if (shouldShowNav) {
      return shouldHideNavOnMobile ? "hidden sm:flex" : "";
    }
    // Pages NOT in PAGES_WITH_NAV: desktop only
    return "hidden sm:flex";
  }, [isRootPage, shouldShowNav, shouldHideNavOnMobile]);

  const categoryNavClassName = useMemo(() => {
    // Root page: always visible (no hidden class)
    if (isRootPage) return "";
    // Pages in PAGES_WITH_NAV: check mobile hiding
    if (shouldShowNav) {
      return shouldHideNavOnMobile ? "hidden md:flex" : "";
    }
    // Pages NOT in PAGES_WITH_NAV: desktop only
    return "hidden md:flex";
  }, [isRootPage, shouldShowNav, shouldHideNavOnMobile]);

  return (
    <main className="min-h-[600px] relative flex flex-col bg-[#F9FAFC]">
      <div className="sticky top-0 z-50">
        <Navbar className={navbarClassName} />
        <CategoryNav className={categoryNavClassName} />
      </div>
      <section className="w-full mx-auto flex-grow">{children}</section>
    </main>
  );
}

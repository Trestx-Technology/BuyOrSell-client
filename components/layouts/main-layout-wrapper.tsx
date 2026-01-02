"use client";

import React from "react";
import Navbar from "@/components/global/Navbar";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
import { Footer } from "@/components/global/footer";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showCategoryNav?: boolean;
  showFooter?: boolean;
}

export function MainLayoutWrapper({
  children,
  showNavbar = true,
  showCategoryNav = true,
  showFooter = true,
}: MainLayoutWrapperProps) {
  return (
    <main className="h-dvh min-h-[600px] relative flex flex-col bg-[#F9FAFC] overflow-y-auto">
      {(showNavbar || showCategoryNav) && (
        <div className="sticky top-0 z-50">
          {showNavbar && <Navbar />}
          {showCategoryNav && <CategoryNav />}
        </div>
      )}
      <div className="w-full mx-auto flex-1">{children}</div>
      {showFooter && <Footer />}
    </main>
  );
}

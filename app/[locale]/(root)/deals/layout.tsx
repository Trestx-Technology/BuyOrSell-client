import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";

const DealsRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full relative bg-gray-50 dark:bg-gray-950 min-h-screen">
      {children}
    </main>
  );
};

export default DealsRootLayout;

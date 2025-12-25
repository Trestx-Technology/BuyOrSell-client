import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-gray-100 relative flex flex-col h-dvh">
      <div className="sticky top-0 z-50">
        <Navbar className="hidden sm:flex" />
        <CategoryNav className="hidden sm:block" />
      </div>
      <section className="w-full max-w-[1080px] mx-auto flex-1">
        {children}
      </section>
    </main>
  );
};

export default UserLayout;

import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
import { Footer } from "@/components/global/footer";

const AdListingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#F9FAFC]">
      <Navbar className="hidden sm:flex" />
      <CategoryNav className="hidden sm:block" />
      <section className="w-full max-w-[1080px] mx-auto">{children}</section>
      <Footer />
    </main>
  );
};

export default AdListingLayout;

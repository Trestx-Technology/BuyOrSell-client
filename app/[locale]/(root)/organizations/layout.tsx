import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";
import { Footer } from "@/components/global/footer";

const Organizationlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CategoryNav />
      {children}
      <Footer />
    </div>
  );
};

export default Organizationlayout;

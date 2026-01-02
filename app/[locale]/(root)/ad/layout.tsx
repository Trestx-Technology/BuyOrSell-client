import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "../_components/CategoryNav";
import { Footer } from "@/components/global/footer";

const AdDetailLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#F9FAFC]">
      <Navbar />
      <CategoryNav className="hidden lg:block relative z-999" />
      <section className="w-full max-w-[1080px] mx-auto mb-6">
        {children}
      </section>
      <Footer />
    </main>
  );
};

export default AdDetailLayout;

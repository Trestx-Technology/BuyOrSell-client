import React from "react";
import { Footer } from "@/components/global/footer";

const ApplicantsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#F9FAFC]">
      <section className="w-full max-w-[1080px] mx-auto">{children}</section>
      <Footer />
    </main>
  );
};

export default ApplicantsLayout;


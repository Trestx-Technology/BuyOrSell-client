import React from "react";

const ApplicantsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#F9FAFC]">
      <section className="w-full max-w-[1080px] mx-auto">{children}</section>
    </main>
  );
};

export default ApplicantsLayout;


import Navbar from "@/components/global/Navbar";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-[1280px] w-full mx-auto">
      <Navbar />
      {children}
    </main>
  );
};

export default HomeLayout;

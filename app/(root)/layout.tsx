import { Footer } from "@/components/global/footer";
import Navbar from "@/components/global/Navbar";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full mx-auto">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default HomeLayout;

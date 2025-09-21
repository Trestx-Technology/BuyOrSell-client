import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "../_components/CategoryNav";

const FavouritetRootlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#F9FAFC]">
      <Navbar className="hidden sm:flex" />
      <CategoryNav className="hidden sm:block" />
      <section className="w-full max-w-[1080px] mx-auto">{children}</section>
    </main>
  );
};

export default FavouritetRootlayout;

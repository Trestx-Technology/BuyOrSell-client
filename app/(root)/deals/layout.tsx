import Navbar from "@/components/global/Navbar";
import React from "react";
import CategoryNav from "@/app/[locale]/(root)/_components/CategoryNav";

const DealsRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className="w-full relative bg-[#020617]"
      style={{
        backgroundImage:
          "url('https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/hot-deals-bg.png",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Emerald Radial Glow Background */}
      {/* <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
        }}
      />  */}

      <Navbar className="hidden sm:flex" />
      <CategoryNav className="hidden sm:block" />
      <section className="w-full max-w-[1280px] mx-auto">{children}</section>
    </main>
  );
};

export default DealsRootLayout;

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
      {children}
    </main>
  );
};

export default DealsRootLayout;

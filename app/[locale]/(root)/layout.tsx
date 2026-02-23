import React from "react";
import { MainLayoutWrapper } from "@/components/layouts/main-layout-wrapper";
import { Footer } from "@/components/global/footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainLayoutWrapper>{children}</MainLayoutWrapper>
      <Footer />
    </>
  );
};

export default HomeLayout;

import React, { Suspense } from "react";
import { MainLayoutWrapper } from "@/components/layouts/main-layout-wrapper";
import { Footer } from "@/components/global/footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <MainLayoutWrapper>{children}</MainLayoutWrapper>
    </Suspense>
  );
};

export default HomeLayout;

import React from "react";
import { MainLayoutWrapper } from "@/components/layouts/main-layout-wrapper";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayoutWrapper>{children}</MainLayoutWrapper>;
};

export default HomeLayout;

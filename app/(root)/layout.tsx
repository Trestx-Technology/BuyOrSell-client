import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="w-full mx-auto min-h-[650px]">{children}</main>;
};

export default HomeLayout;

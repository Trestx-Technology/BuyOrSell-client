import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="w-full mx-auto">{children}</main>;
};

export default HomeLayout;

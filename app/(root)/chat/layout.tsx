import Navbar from "@/components/global/Navbar";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#F9FAFC] flex flex-col h-dvh">
      <Navbar className="hidden sm:flex" />
      <section className="w-full max-w-[1440px] mx-auto flex-1 min-h-0 bg-white">
        {children}
      </section>
    </main>
  );
};

export default ChatLayout;

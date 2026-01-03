import React from "react";
import { cn } from "@/lib/utils";

interface Container1080Props {
  children: React.ReactNode;
  className?: string;
}

export function Container1080({ children, className }: Container1080Props) {
  return (
    <main
      className={cn(
        "container-1080 h-full min-h-[calc(100dvh-100px)]",
        className
      )}
    >
      {children}
    </main>
  );
}

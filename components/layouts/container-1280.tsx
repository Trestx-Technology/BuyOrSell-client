import React from "react";
import { cn } from "@/lib/utils";

interface Container1280Props {
  children: React.ReactNode;
  className?: string;
}

export function Container1280({ children, className }: Container1280Props) {
  return <main className={cn("container-1280", className)}>{children}</main>;
}

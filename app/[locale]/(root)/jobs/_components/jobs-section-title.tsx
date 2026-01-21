"use client";

import React from "react";
import { Display3, H2, Typography } from "@/components/typography";

interface JobsSectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function JobsSectionTitle({
  children,
  className = "",
}: JobsSectionTitleProps) {
  return (
    <H2
      className={`text-dark-blue font-bold  mb-3 ${className}`}
    >
      {children}
    </H2>
  );
}


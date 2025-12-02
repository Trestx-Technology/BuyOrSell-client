"use client";

import React from "react";
import { Typography } from "@/components/typography";

interface JobsSectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function JobsSectionTitle({
  children,
  className = "",
}: JobsSectionTitleProps) {
  return (
    <Typography
      variant="h2"
      className={`text-dark-blue font-bold text-3xl mb-3 ${className}`}
    >
      {children}
    </Typography>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Container1080 } from "@/components/layouts/container-1080";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  variant: "job-seekers" | "employers";
}

function CTACard({
  title,
  description,
  buttonText,
  buttonHref,
  variant,
}: CTACardProps) {
  const isJobSeekers = variant === "job-seekers";

  return (
    <motion.div
      variants={cardVariants}
      className={`max-w-[530px] w-full p-6 h-[202px] flex flex-col gap-3 rounded-2xl border-[0.5px] border-[#E2E2E2] shadow-[0px_2.67px_7.11px_0px_rgba(48,150,137,0.08)] ${isJobSeekers ? "bg-slate-100" : "bg-purple"
      } relative overflow-hidden`}
    >
      {/* Title - positioned at x:26, y:30.5 */}
      <div className="space-y-2 flex-1">
        <Typography
          variant="h3"
          className={`text-lg font-bold leading-[1.21] ${
            isJobSeekers ? "text-black" : "text-white"
          }`}
        >
          {title}
        </Typography>

        {/* Description - positioned at x:26, y:62.5 */}
        <Typography
          variant="body-small"
          className={`text-xs font-normal leading-[1.5] ${
            isJobSeekers ? "text-[#1D2939]" : "text-white"
          }`}
        >
          {description}
        </Typography>
      </div>

      {/* Button - positioned at x:26, y:140, 165x40px */}
      <Link href={buttonHref}>
        <Button
          size={"sm"}
          className={`w-[160px] font-semibold h-10  ${
            isJobSeekers
              ? "bg-white text-purple hover:bg-purple hover:text-white"
              : "bg-white text-purple hover:bg-purple/90 hover:text-white"
          } transition-all`}
          variant={isJobSeekers ? "outline" : "outline"}
        >
          {buttonText}
        </Button>
      </Link>
    </motion.div>
  );
}

export default function JobsCTASection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <Container1080 className="px-4 py-10 flex flex-col md:flex-row items-center justify-center gap-6">
        <CTACard
          title="For Job Seekers"
          description="Finding jobs on BuyOrSell is easier than ever. Download the mobile apps to your smartphone device and enjoy for free!"
          buttonText="Browse Jobs"
          buttonHref="/jobs/listing/Jobs"
          variant="job-seekers"
        />
        <CTACard
          title="For Employers"
          description="Finding jobs on BuyOrSell is easier than ever. Download the mobile apps to your smartphone device and enjoy for free!"
          buttonText="Post Jobs"
          buttonHref="/post-job"
          variant="employers"
        />
      </Container1080>
    </motion.section>
  );
}

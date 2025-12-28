"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";

const EmiratisSupport = () => {
  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-[1090px] mx-auto px-4">
        <div className="relative w-full h-[388px] bg-[#CEFFF2] rounded-2xl border-[0.5px] border-[#E2E2E2] shadow-[0px_2.67px_7.11px_0px_rgba(48,150,137,0.08)] overflow-hidden">
          {/* Content Section - positioned at x:44, y:83 */}
          <div className="absolute left-11 top-[83px] flex flex-col gap-6 w-[659px]">
            {/* Title and Subtitle Group */}
            <div className="flex flex-col gap-6">
              <Typography
                variant="h1"
                className="text-[42px] font-bold leading-[1.21] uppercase text-[#1D2939]"
              >
                Supporting Emiratis
              </Typography>
              <Typography
                variant="h2"
                className="text-[28px] font-normal leading-[1.21] uppercase text-[#1D2939] h-[77px]"
              >
                Connecting UAE citizens to jobs & Opportunities
              </Typography>
            </div>

            {/* Button - positioned at y:187 from content top */}
            <Link href="/jobs/listing" className="w-[165px]">
              <Button
                className="w-[165px] h-10 px-[17.78px] py-[12.44px] rounded-[7.11px] text-[14.22px] font-bold leading-[1.21] uppercase bg-purple text-white border border-purple hover:bg-purple/90 transition-all"
                variant="primary"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>

          {/* Image Section - positioned at x:713.06, y:0 */}
          <div className="absolute right-0 top-0 w-[277.23px] h-[388px]">
            <Image
              src="/images/emiratis-support/uae-flag-hand-7a8782.png"
              alt="UAE Flag Hand"
              width={277}
              height={388}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmiratisSupport;

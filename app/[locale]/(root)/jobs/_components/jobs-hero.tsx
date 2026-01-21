"use client";

import { Display2, Typography } from "@/components/typography";
import CandidateSearchBar from "./candidate-search-bar";

export default function JobsHero() {
  return (
    <section
      className="relative w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "491px",
      }}
    >
      <div className="mx-auto px-4 py-24">
        <div className="w-full max-w-[860px] mx-auto flex flex-col items-center gap-[71.11px]">
          {/* Text Section */}
          <div className="flex flex-col items-center gap-[53.33px]">
            <div className="flex flex-col gap-[10.67px] items-center">
              <Display2
                className="text-white text-center font-bold leading-[1.14]"
              >
                Find Your Dream Job Today!
              </Display2>
              <Typography
                variant="body-large"
                className="text-white/80 text-center font-medium text-base max-w-full"
              >
                Connecting Talent with Opportunity: Your Gateway to Career
                Success
              </Typography>
            </div>
          </div>

          {/* Search Section */}
          <CandidateSearchBar />
        </div>
      </div>
    </section>
  );
}

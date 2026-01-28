"use client";

import { Display2, Typography } from "@/components/typography";
import CandidateSearchBar from "./candidate-search-bar";
import { Container1280 } from "@/components/layouts/container-1280";

export interface JobsHeroProps {
  zoom?: number;
}

export default function JobsHero({ zoom = 15 }: JobsHeroProps) {
  return (
    <Container1280 className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img
          src={`/api/map-image?lat=25.2048&lng=55.2708&zoom=${zoom}`}
          alt="Map Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 mx-auto px-4 w-full">
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
    </Container1280>
  );
}

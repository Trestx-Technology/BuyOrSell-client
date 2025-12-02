"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";

export default function JobsHero() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Handle job search logic
    console.log("Searching for:", { jobTitle, location });
  };

  return (
    <section
      className="relative w-full bg-cover bg-center border-b border-red-500"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "391px",
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4 lg:px-[147.56px] py-24">
        <div className="flex flex-col items-center gap-[71.11px]">
          {/* Text Section */}
          <div className="flex flex-col items-center gap-[53.33px]">
            <div className="flex flex-col gap-[10.67px] items-center">
              <Typography
                variant="h1"
                className="text-white text-center font-bold text-[62.22px] leading-[1.14]"
              >
                Find Your Dream Job Today!
              </Typography>
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
          <div className="w-full max-w-[1080px]">
            <div className="flex max-w-[564px] mx-auto flex-col sm:flex-row items-stretch gap-0 bg-white rounded-[14.22px] overflow-hidden shadow-lg">
              {/* Search Inputs Container */}
              <div className="flex flex-col sm:flex-row items-stretch flex-1 gap-0">
                {/* Job Title Input */}
                <div className="flex-1 max-w-[180px] border-r-0 sm:border-r border-[rgba(199,199,199,0.6)]">
                  <Input
                    type="text"
                    placeholder="Job Title or Company"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="border-0 rounded-none h-[71.11px] px-[17.78px] text-[14.22px] placeholder:text-[#8A8A8A] focus:ring-0"
                  />
                </div>

                {/* Location Input */}
                <div className="flex items-center gap-[10.67px] px-[17.78px] border-r-0 max-w-[160px]">
                  <MapPin className="w-[21.33px] h-[21.33px] text-purple" />
                  <Input
                    type="text"
                    placeholder="Enter Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 rounded-none h-full px-0 text-[14.22px] placeholder:text-[#8A8A8A] focus:ring-0"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                icon={
                <Search className="w-[24.22px] h-[24.22px]" />                }
                iconPosition="left"
                className="bg-purple text-white rounded-none h-[71.11px] px-[24.89px] hover:bg-purple/90 flex items-center gap-[8.89px]"
              >
                <span className="font-semibold text-base">Search Job</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


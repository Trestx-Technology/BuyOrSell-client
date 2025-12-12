"use client";

import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function JobsHero() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"job" | "candidate">("candidate");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!jobTitle.trim()) {
      return; // Don't search if no query
    }

    setIsSearching(true);
    const params = new URLSearchParams();
    params.set("type", searchType);
    if (jobTitle) params.set("query", jobTitle); // Use 'query' for API compatibility
    if (location) params.set("location", location);

    // Navigate to results page - the destination pages will use useAds with adType: "JOB"
    if (searchType === "job") {
      router.push(`/jobs/listing?${params.toString()}`);
    } else {
      router.push(`/jobs/jobseeker?${params.toString()}`);
    }
    
    // Reset loading state after navigation
    setTimeout(() => setIsSearching(false), 500);
  };

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
            <div className="flex flex-col sm:flex-row items-stretch gap-0 bg-white rounded-[14.22px] overflow-hidden shadow-lg">
              {/* Search Type Dropdown - First Field */}
              <div className="flex items-center justify-start px-[17.78px] border-r-0 sm:border-r border-[rgba(199,199,199,0.6)] min-w-[188px]">
                <Select
                  value={searchType}
                  onValueChange={(value: "job" | "candidate") =>
                    setSearchType(value)
                  }
                >
                  <SelectTrigger className="border-0 rounded-none h-[71.11px] px-[17.78px] text-[14.22px] focus:ring-0 bg-transparent hover:bg-transparent text-[#8A8A8A]">
                    <SelectValue
                      className="placeholder:text-[#8A8A8A]"
                      placeholder="Candidate"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Title Input - Second Field */}
              <div className="flex-1 border-r-0 sm:border-r border-[rgba(199,199,199,0.6)]">
                <Input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="border-0 rounded-none h-[71.11px] px-[17.78px] text-[14.22px] placeholder:text-[#8A8A8A] focus:ring-0"
                />
              </div>

              {/* Location Input - Third Field */}
              <div className="flex items-center gap-[10.67px] px-[17.78px] border-r-0 sm:border-r border-[rgba(199,199,199,0.6)] min-w-[160px]">
                <MapPin className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Enter Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="border-0 rounded-none h-full px-0 text-[14.22px] placeholder:text-[#8A8A8A] focus:ring-0"
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearching || !jobTitle.trim()}
                icon={
                  isSearching ? (
                    <Loader2 className="w-[24.22px] h-[24.22px] animate-spin" />
                  ) : (
                    <Search className="w-[24.22px] h-[24.22px]" />
                  )
                }
                iconPosition="left"
                className="bg-purple text-white rounded-none h-[71.11px] px-[24.89px] hover:bg-purple/90 flex items-center gap-[8.89px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold text-base">
                  {isSearching
                    ? "Searching..."
                    : searchType === "job"
                      ? "Search Job"
                      : "Search Candidate"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


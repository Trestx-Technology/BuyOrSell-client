"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Briefcase } from "lucide-react";
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
import { useAds } from "@/hooks/useAds";
import { useEmirates } from "@/hooks/useLocations";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";

export default function JobsHero() {
  const router = useRouter();
  const { localePath } = useLocale();
  const [jobTitle, setJobTitle] = useState("");
  const [debouncedJobTitle, setDebouncedJobTitle] = useState("");
  const [selectedEmirate, setSelectedEmirate] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch emirates/locations
  const { data: emiratesData, isLoading: isLoadingEmirates } = useEmirates();
  const emirates = emiratesData || [];

  // Debounce job title input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJobTitle(jobTitle);
    }, 500);

    return () => clearTimeout(timer);
  }, [jobTitle]);

  // Fetch jobs with filters
  const adsFilters = useMemo(() => {
    const filters: {
      adType: "JOB";
      search?: string;
      location?: string;
    } = {
      adType: "JOB",
    };

    if (debouncedJobTitle && debouncedJobTitle.trim()) {
      filters.search = debouncedJobTitle.trim();
    }

    if (selectedEmirate) {
      filters.location = selectedEmirate;
    }

    return filters;
  }, [debouncedJobTitle, selectedEmirate]);

  const { data: jobsData, isLoading: isLoadingJobs } = useAds(adsFilters);
  const jobs =
    jobsData?.data?.ads ||
    jobsData?.data?.adds ||
    (Array.isArray(jobsData?.data) ? jobsData.data : []) ||
    [];

  // Limit results to 5 for dropdown
  const displayJobs = jobs.slice(0, 5);

  // Show dropdown when there are results and user is typing
  useEffect(() => {
    if (debouncedJobTitle.trim() && displayJobs.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedJobTitle, displayJobs.length]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || displayJobs.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayJobs.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && displayJobs[selectedIndex]) {
          handleJobClick(displayJobs[selectedIndex]._id);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleJobClick = (jobId: string) => {
    router.push(localePath(`/jobs/${jobId}`));
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (!jobTitle.trim() && !selectedEmirate) {
      return;
    }

    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set("query", jobTitle.trim());
    if (selectedEmirate) params.set("location", selectedEmirate);

    router.push(localePath(`/jobs/listing?${params.toString()}`));
    setShowDropdown(false);
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
            <div
              ref={searchContainerRef}
              className="relative flex max-w-[564px] mx-auto flex-col sm:flex-row items-stretch gap-0 bg-white rounded-[14.22px] overflow-visible shadow-lg"
            >
              {/* Search Inputs Container */}
              <div className="flex flex-col sm:flex-row items-stretch flex-1 gap-0">
                {/* Job Title Input */}
                <div className="relative flex-1 max-w-[180px] border-r-0 sm:border-r border-[rgba(199,199,199,0.6)]">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (debouncedJobTitle.trim() && displayJobs.length > 0) {
                        setShowDropdown(true);
                      }
                    }}
                    className="border-0 rounded-none h-[71.11px] px-[17.78px] text-[14.22px] placeholder:text-[#8A8A8A] focus:ring-0"
                  />
                  {/* Results Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto">
                      {isLoadingJobs ? (
                        <div className="p-4 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple" />
                          <Typography
                            variant="body-small"
                            className="text-gray-600"
                          >
                            Searching...
                          </Typography>
                        </div>
                      ) : displayJobs.length > 0 ? (
                        <>
                          {displayJobs.map((job, index) => {
                            const locationStr =
                              typeof job.location === "string"
                                ? job.location
                                : `${job.location?.city || ""} ${
                                    job.location?.state || ""
                                  }`.trim() || "Location not specified";
                            return (
                              <Link
                                key={job._id}
                                href={localePath(
                                  `/jobs/listing?jobId=${job._id}`
                                )}
                                onClick={() => {
                                  setShowDropdown(false);
                                  setSelectedIndex(-1);
                                }}
                              >
                                <div
                                  className={`p-3 hover:bg-purple/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                    selectedIndex === index
                                      ? "bg-purple/10"
                                      : ""
                                  }`}
                                  onMouseEnter={() => setSelectedIndex(index)}
                                >
                                  <div className="flex items-start gap-3">
                                    <Briefcase className="w-4 h-4 text-purple mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <Typography
                                        variant="body-large"
                                        className="font-semibold text-dark-blue line-clamp-1"
                                      >
                                        {job.title}
                                      </Typography>
                                      {job.organization?.tradeName ||
                                      job.company ? (
                                        <Typography
                                          variant="body-small"
                                          className="text-gray-600 line-clamp-1"
                                        >
                                          {job.organization?.tradeName ||
                                            job.company}
                                        </Typography>
                                      ) : null}
                                      {locationStr && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <MapPin className="w-3 h-3 text-gray-400" />
                                          <Typography
                                            variant="body-small"
                                            className="text-gray-500 text-xs"
                                          >
                                            {locationStr}
                                          </Typography>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                          {jobs.length > 5 && (
                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                              <button
                                onClick={handleSearch}
                                className="w-full text-center text-purple font-semibold text-sm hover:underline"
                              >
                                View all {jobs.length} results
                              </button>
                            </div>
                          )}
                        </>
                      ) : debouncedJobTitle.trim() ? (
                        <div className="p-4 text-center">
                          <Typography
                            variant="body-small"
                            className="text-gray-500"
                          >
                            No jobs found
                          </Typography>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Location Select */}
                <div className="flex items-center gap-[10.67px] px-[17.78px] border-r-0 max-w-[160px]">
                  <MapPin className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0" />
                  <Select
                    value={selectedEmirate}
                    onValueChange={setSelectedEmirate}
                  >
                    <SelectTrigger className="border-0 rounded-none h-full px-0 text-[14.22px] focus:ring-0 bg-transparent hover:bg-transparent text-[#8A8A8A]">
                      <SelectValue
                        className="placeholder:text-[#8A8A8A]"
                        placeholder="Enter Location"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingEmirates ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        emirates.map((emirate) => (
                          <SelectItem
                            key={emirate.emirate}
                            value={emirate.emirate}
                          >
                            {emirate.emirate}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isLoadingJobs}
                icon={
                  isLoadingJobs ? (
                    <Loader2 className="w-[24.22px] h-[24.22px] animate-spin" />
                  ) : (
                    <Search className="w-[24.22px] h-[24.22px]" />
                  )
                }
                iconPosition="left"
                className="bg-purple text-white rounded-none h-[71.11px] px-[24.89px] hover:bg-purple/90 flex items-center gap-[8.89px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold text-base">
                  {isLoadingJobs ? "Searching..." : "Search Job"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

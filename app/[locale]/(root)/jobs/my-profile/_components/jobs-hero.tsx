"use client";

import React, { useState, useMemo, useRef } from "react";
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
import { useAdsByKeyword } from "@/hooks/useAds";
import { useEmirates } from "@/hooks/useLocations";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export default function JobsHero() {
  const router = useRouter();
  const { localePath } = useLocale();
  const [jobTitle, setJobTitle] = useState("");
  const [selectedEmirate, setSelectedEmirate] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch emirates/locations
  const { data: emiratesData, isLoading: isLoadingEmirates } = useEmirates();
  const emirates = emiratesData || [];

  // State for debounced value used in API calls
  const [debouncedJobTitle, setDebouncedJobTitle] = useState("");

  // Debounce job title input using useDebouncedValue
  const [localJobTitle, setLocalJobTitle] = useDebouncedValue(
    jobTitle,
    (value) => {
      // This callback is called after debounce delay
      setDebouncedJobTitle(value);
    },
    500
  );

  // Fetch keyword suggestions using useAdsByKeyword
  const { data: keywordData, isLoading: isLoadingKeywords } = useAdsByKeyword(
    debouncedJobTitle.trim(),
    undefined
  );

  const keywords = keywordData?.data || [];

  // Show dropdown when there are results and user is typing
  const shouldShowDropdown = useMemo(() => {
    return (
      debouncedJobTitle.trim() !== "" && keywords.length > 0 && showDropdown
    );
  }, [debouncedJobTitle, keywords.length, showDropdown]);

  // Handle click outside to close dropdown using useOutsideClick
  useOutsideClick(
    searchContainerRef,
    () => {
      setShowDropdown(false);
      setSelectedIndex(-1);
    },
    showDropdown
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!shouldShowDropdown || keywords.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < keywords.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && keywords[selectedIndex]) {
          handleKeywordClick(keywords[selectedIndex].name);
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

  const handleKeywordClick = (keyword: string) => {
    setJobTitle(keyword);
    setLocalJobTitle(keyword);
    setDebouncedJobTitle(keyword);
    setShowDropdown(false);
    setSelectedIndex(-1);
    handleSearchWithKeyword(keyword);
  };

  const handleSearch = () => {
    handleSearchWithKeyword(localJobTitle.trim());
  };

  const handleSearchWithKeyword = (searchKeyword: string) => {
    if (!searchKeyword && !selectedEmirate) {
      return;
    }

    const params = new URLSearchParams();
    if (searchKeyword) params.set("query", searchKeyword);
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
                    value={localJobTitle}
                    onChange={(e) => {
                      setLocalJobTitle(e.target.value);
                      setJobTitle(e.target.value);
                      setSelectedIndex(-1);
                      if (e.target.value.trim()) {
                        setShowDropdown(true);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (debouncedJobTitle.trim() && keywords.length > 0) {
                        setShowDropdown(true);
                      }
                    }}
                    className="border-0 rounded-none h-[71.11px] px-[17.78px] text-[14.22px] placeholder:text-[#8A8A8A] focus:ring-0"
                  />
                  {/* Keyword Suggestions Dropdown */}
                  {shouldShowDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto">
                      {isLoadingKeywords ? (
                        <div className="p-4 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple" />
                          <Typography
                            variant="body-small"
                            className="text-gray-600"
                          >
                            Searching...
                          </Typography>
                        </div>
                      ) : keywords.length > 0 ? (
                        <>
                          {keywords.slice(0, 5).map((keyword, index) => (
                            <button
                              key={`${keyword.name}-${index}`}
                              onClick={() => handleKeywordClick(keyword.name)}
                              className={`w-full p-3 hover:bg-purple/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors text-left ${
                                selectedIndex === index ? "bg-purple/10" : ""
                              }`}
                              onMouseEnter={() => setSelectedIndex(index)}
                            >
                              <div className="flex items-start gap-3">
                                <Search className="w-4 h-4 text-purple mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <Typography
                                    variant="body-large"
                                    className="font-semibold text-dark-blue line-clamp-1"
                                  >
                                    {keyword.name}
                                  </Typography>
                                  {keyword.adCount !== undefined && (
                                    <Typography
                                      variant="body-small"
                                      className="text-gray-500 text-xs mt-1"
                                    >
                                      {keyword.adCount} job
                                      {keyword.adCount !== 1 ? "s" : ""} found
                                    </Typography>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                          {keywords.length > 5 && (
                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                              <button
                                onClick={handleSearch}
                                className="w-full text-center text-purple font-semibold text-sm hover:underline"
                              >
                                View all results for "{debouncedJobTitle}"
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
                            No suggestions found
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
                disabled={isLoadingKeywords}
                icon={
                  isLoadingKeywords ? (
                    <Loader2 className="w-[24.22px] h-[24.22px] animate-spin" />
                  ) : (
                    <Search className="w-[24.22px] h-[24.22px]" />
                  )
                }
                iconPosition="left"
                className="bg-purple text-white rounded-none h-[71.11px] px-[24.89px] hover:bg-purple/90 flex items-center gap-[8.89px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold text-base">
                  {isLoadingKeywords ? "Searching..." : "Search Job"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

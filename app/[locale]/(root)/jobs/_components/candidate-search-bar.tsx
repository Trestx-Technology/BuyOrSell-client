import React, { useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { useEmirates } from "@/hooks/useLocations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAds } from "@/hooks/useAds";
import { useSearchJobseekerProfiles } from "@/hooks/useJobseeker";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify, unSlugify } from '@/utils/slug-utils';

export default function CandidateSearchBar() {
      const [searchType, setSearchType] = useState('job');
      const [searchQuery, setSearchQuery] = useState('');
      const [location, setLocation] = useState('');
      const [openLocation, setOpenLocation] = useState(false);
      const [openSearch, setOpenSearch] = useState(false);

      // Debounce inputs
      const [inputLocation, setInputLocation] = useDebouncedValue(location, setLocation, 500);
      const [inputSearch, setInputSearch] = useDebouncedValue(searchQuery, setSearchQuery, 500);

      const router = useRouter();

      // 1. Fetch Location Suggestions
      const { data: emirates } = useEmirates(location ? { search: location } : undefined);

      // 2. Fetch Search Suggestions (Jobs or Candidates)
      const { data: jobSuggestions, isPending: jobSuggestionsPending } = useAds(
            searchType === 'job' && searchQuery ? { search: searchQuery, limit: 10, adType: "JOB" } : undefined
      );


      const { data: candidateSuggestions, isPending: candidateSuggestionsPending } = useSearchJobseekerProfiles(
            searchType !== 'job' && searchQuery ? { q: searchQuery, limit: 10 } : undefined
      );

      const isLoading = jobSuggestionsPending || candidateSuggestionsPending;

      const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();

            const params = new URLSearchParams();
            if (inputLocation) params.set("location", inputLocation);

            if (searchType === 'job') {
                  if (inputSearch) params.set("search", inputSearch);
                  router.push(`/jobs/listing/${slugify(inputSearch)}?${params.toString()}`);
            } else {
            // Candidate/Applicant search
                  params.set("type", "candidate");
                  if (inputSearch) params.set("query", inputSearch); // or 'name' depending on target page logic
                  if (searchType && searchType !== 'applicant') params.set("role", searchType); // if specialized role selected

                  router.push(`/jobs/jobseeker?${params.toString()}`);
            }
      };

      const suggestions = searchType === 'job'
            ? jobSuggestions?.data?.adds?.map((j: any) => ({
                  label: j.title,
                  value: j.title,
                  relatedCategories: j.relatedCategories
            }))
            : candidateSuggestions?.data?.items?.map((c: any) => ({
                  label: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown Candidate',
                  value: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown Candidate'
            }));

      return (
            <form onSubmit={handleSearch} className="w-full max-w-[1080px]">
                  <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-0 lg:bg-white lg:rounded-[14.22px] lg:overflow-hidden lg:shadow-lg">

                        {/* Search Type Dropdown */}
                        <div className="flex items-center justify-start h-12 lg:h-10 px-4 lg:border-r border-[rgba(199,199,199,0.6)] min-w-[150px] w-full lg:w-auto flex-none lg:flex-1 bg-white rounded-[14.22px] lg:bg-transparent lg:rounded-none shadow-sm lg:shadow-none">
                              <Select
                                    value={searchType}
                                    onValueChange={setSearchType}
                              >
                                    <SelectTrigger className="border-0 rounded-none h-full lg:h-[71.11px] px-0 text-[14.22px] focus:ring-0 bg-transparent hover:bg-transparent text-[#8A8A8A] w-full">
                                          <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                          <SelectItem value="job">Find a Job</SelectItem>
                                          <SelectItem value="applicant">Find Candidates</SelectItem>
                                    </SelectContent>
                              </Select>
                        </div>

                        {/* Search Query Input (Auto-complete) */}
                        <div className="flex-1 w-full lg:w-auto lg:max-w-[350px] flex items-center h-[72px] lg:h-10 px-4 lg:border-r border-[rgba(199,199,199,0.6)] relative bg-white rounded-[14.22px] lg:bg-transparent lg:rounded-none shadow-sm lg:shadow-none">
                              <Popover open={openSearch && !!inputSearch} onOpenChange={setOpenSearch}>
                                    <PopoverAnchor asChild>
                                          <div className="relative w-full">
                                                <input
                                                      type="text"
                                                      placeholder={searchType === 'job' ? "Job Title, Keywords..." : "Candidate Name, Skills..."}
                                                      value={inputSearch}
                                                      onChange={(e) => {
                                                            setInputSearch(e.target.value);
                                                            setOpenSearch(true);
                                                      }}
                                                      onFocus={() => setOpenSearch(true)}
                                                      className="w-full border-0 focus:outline-none focus:ring-0 bg-transparent text-[14.22px] placeholder:text-[#8A8A8A] text-[#1D2939] font-medium h-full py-4"
                                                />
                                                {(candidateSuggestionsPending || jobSuggestionsPending) && <Loader2 className="absolute right-3 text-purple top-1/2 -translate-y-1/2 animate-spin" />}
                                          </div>
                                    </PopoverAnchor>
                                    <PopoverContent
                                          className="p-1 w-[200px] sm:w-[300px]"
                                          align="start"
                                          onOpenAutoFocus={(e) => e.preventDefault()}
                                    >
                                          <div className="flex flex-col max-h-[200px] overflow-y-auto">
                                                {isLoading ? (
                                                      Array.from({ length: 3 }).map((_, i) => (
                                                            <div key={i} className="px-3 py-2">
                                                                  <Skeleton className="h-4 w-full" />
                                                            </div>
                                                      ))
                                                ) : suggestions && suggestions?.length > 0 ? (
                                                      suggestions?.map((item: any, idx: number) => (
                                                            <button
                                                                  key={idx}
                                                                  type="button"
                                                                  className="text-left px-3 py-2 hover:bg-gray-100 rounded-sm text-sm"
                                                                  onClick={() => {
                                                                        setInputSearch(item.value);
                                                                        setOpenSearch(false);
                                                                        if (searchType === 'job') {
                                                                              const params = new URLSearchParams();
                                                                              if (inputLocation) params.set("location", inputLocation);
                                                                              params.set("search", item.value);

                                                                              // Build path with title and categories
                                                                              const pathParts = [item.value];
                                                                              if (item.relatedCategories && Array.isArray(item.relatedCategories)) {
                                                                                    pathParts.push(...item.relatedCategories);
                                                                              }

                                                                              router.push(`/jobs/listing/jobs/${slugify(...pathParts)}?${params.toString()}`);
                                                                        }
                                                                  }}
                                                            >
                                                                  {item.label}
                                                            </button>
                                                      ))
                                                ) : (
                                                      <div className="px-3 py-4 text-center text-sm text-gray-500">
                                                            No results found
                                                      </div>
                                                )}
                                          </div>
                                    </PopoverContent>
                              </Popover>
                        </div>

                        {/* Location Input (Auto-complete) */}
                        <div className="flex-1 w-full lg:w-auto flex items-center pl-4 relative bg-white rounded-[14.22px] lg:bg-transparent lg:rounded-none shadow-sm lg:shadow-none h-[72px] lg:h-auto">
                              <MapPin className="size-5 lg:size-10 text-purple mr-2" />
                              <Popover open={openLocation && (emirates?.length || 0) > 0} onOpenChange={setOpenLocation}>
                                    <PopoverAnchor asChild>
                                          <input
                                                type="text"
                                                placeholder="City, Emirates..."
                                                value={inputLocation}
                                                onChange={(e) => {
                                                      setInputLocation(e.target.value);
                                                      setOpenLocation(true);
                                                }}
                                                onFocus={() => setOpenLocation(true)}
                                                className="w-fit border-0 focus:outline-none focus:ring-0 bg-transparent text-[14.22px] placeholder:text-[#8A8A8A] text-[#1D2939] font-medium h-full py-4"
                                          />
                                    </PopoverAnchor>
                                    <PopoverContent
                                          className="p-1 w-[200px] sm:w-[300px]"
                                          align="start"
                                          onOpenAutoFocus={(e) => e.preventDefault()}
                                    >
                                          <div className="flex flex-col max-h-[200px] overflow-y-auto">
                                                {emirates?.map((item, idx) => (
                                                      <button
                                                            key={idx}
                                                            type="button"
                                                            className="text-left px-3 py-2 hover:bg-gray-100 rounded-sm text-sm"
                                                            onClick={() => {
                                                                  setInputLocation(item.emirate);
                                                                  setOpenLocation(false);
                                                            }}
                                                      >
                                                            {item.emirate}
                                                      </button>
                                                ))}
                                          </div>
                                    </PopoverContent>
                              </Popover>
                              <Button
                                    icon={
                                          <Search className="w-5 h-5 -mr-2" />

                                    }
                                    iconPosition='center'
                                    type="submit"
                                    className="hidden lg:flex bg-purple hover:bg-purple/90 text-white rounded-none w-full p-5 h-full"
                              >
                                    Search
                              </Button>
                        </div>

                        {/* Mobile Search Button */}
                        <Button
                              type="submit"
                              className="lg:hidden w-full bg-purple hover:bg-purple/90 text-white rounded-[14.22px] h-[60px]"
                              icon={<Search className="w-5 h-5 -mr-2" />}
                              iconPosition='center'
                        >
                              Search
                        </Button>

                  </div>
            </form>
      );
}

'use client';

import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";

export default function CandidateSearchBar() {
      const [candidate, setCandidate] = useState('');
      const [jobTitle, setJobTitle] = useState('');
      const [location, setLocation] = useState('');
      const { t } = useLocale();

      const router = useRouter();
      // TODO: `candidate` state from dropdown might map to a filter, e.g. role or category. 
      // For now, we'll mostly use jobTitle and location for search.

      const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();

            const params = new URLSearchParams();
            params.set("type", "candidate");
            if (jobTitle) params.set("query", jobTitle);
            if (location) params.set("location", location);
            if (candidate) params.set("role", candidate); // Assuming selection is role/category

            router.push(`/jobs/jobseeker?${params.toString()}`);
      };

      return (
            <form onSubmit={handleSearch} className="w-full max-w-[1080px]">
                  <div className="flex flex-col md:flex-row items-center gap-0 bg-white rounded-[14.22px] overflow-hidden shadow-lg">

                        {/* Candidate Dropdown */}
                        <div className="flex items-center justify-start h-10 px-4 border-r-0 sm:border-r border-[rgba(199,199,199,0.6)] min-w-[188px] flex-1 md:flex-none">
                              <Select
                                    value={candidate}
                                    onValueChange={setCandidate}
                              >
                                    <SelectTrigger className="border-0 rounded-none h-[71.11px] px-0 text-[14.22px] focus:ring-0 bg-transparent hover:bg-transparent text-[#8A8A8A] w-full">
                                          <SelectValue placeholder="Candidate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                          <SelectItem value="candidate1">Senior Developer</SelectItem>
                                          <SelectItem value="candidate2">Product Manager</SelectItem>
                                          <SelectItem value="candidate3">Designer</SelectItem>
                                    </SelectContent>
                              </Select>
                        </div>

                        {/* Job Title Input */}
                        <div className="flex-1 w-full lg:max-w-[250px] flex items-center h-10 px-4 border-r-0 sm:border-r border-[rgba(199,199,199,0.6)]">
                              <input
                                    type="text"
                                    placeholder="Job Title"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="w-full border-0 focus:outline-none focus:ring-0 bg-transparent text-[14.22px] placeholder:text-[#8A8A8A] text-[#1D2939] font-medium h-full py-4"
                              />
                        </div>

                        {/* Location Input */}
                        <div className="flex-1 border w-full flex items-center pl-4 relative">
                              <MapPin className="size-10 text-purple mr-2" />
                              <input
                                    type="text"
                                    placeholder="Enter Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full border-0 focus:outline-none focus:ring-0 bg-transparent text-[14.22px] placeholder:text-[#8A8A8A] text-[#1D2939] font-medium h-full py-4"
                              />
                              <Button
                                    icon={
                                          <Search className="w-5 h-5 -mr-2" />

                                    }
                                    iconPosition='center'
                                    type="submit"
                                    className="hidden md:flex bg-purple hover:bg-purple/90 text-white rounded-none w-full p-5 h-full"
                              >
                                    Search
                              </Button>
                        </div>

                        {/* Mobile Search Button */}
                        <Button
                              type="submit"
                              className="md:hidden w-full bg-purple hover:bg-purple/90 text-white rounded-none h-[60px]"
                              icon={<Search className="w-5 h-5 -mr-2" />}
                              iconPosition='center'
                        >
                              Search Candidate
                        </Button>

                  </div>
            </form>
      );
}

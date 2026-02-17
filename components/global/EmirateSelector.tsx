"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmirates } from "@/hooks/useLocations";
import { useLocale } from "@/hooks/useLocale";
import { LocalStorageService } from "@/services/local-storage";
import { cn } from "@/lib/utils";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { createUrlParamHandler } from "@/utils/url-params";
import { useQueryParam } from "@/hooks/useQueryParam";

interface EmirateSelectorProps {
  onEmirateChange?: (emirate: string) => void;
  className?: string;
  triggerClassName?: string;
}

export const EMIRATE_STORAGE_KEY = "selected_emirate";

const EmirateSelector = ({ 
  onEmirateChange, 
  className,
  triggerClassName 
}: EmirateSelectorProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: emirates, isLoading: isLoadingEmirates } = useEmirates();
  const { locale } = useLocale();
  const [selectedEmirate, setSelectedEmirate] = useState<string>("");

  // Initialize city from URL query parameter
  useQueryParam(searchParams, "emirate", (val) => {
    setSelectedEmirate(val);
    if (val) {
        LocalStorageService.set(EMIRATE_STORAGE_KEY, val);
    }
  });

  useEffect(() => {
    // If no emirate in URL, try to get from localStorage
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("emirate")) {
        const storedEmirate = LocalStorageService.get<string>(EMIRATE_STORAGE_KEY);
        if (storedEmirate) {
          setSelectedEmirate(storedEmirate);
        }
    }
  }, [searchParams]);

  // Update URL and state when city changes
  const handleCityChange = createUrlParamHandler(
    searchParams,
    pathname,
    router,
    "emirate",
    (val: string) => {
        setSelectedEmirate(val);
        if (val) {
            LocalStorageService.set(EMIRATE_STORAGE_KEY, val);
        } else {
            LocalStorageService.remove(EMIRATE_STORAGE_KEY);
        }
        if (onEmirateChange) {
            onEmirateChange(val);
        }
    }
  );

  const currentEmirateDisplay = () => {
    if (!selectedEmirate) return locale === "ar" ? "الإمارات" : "UAE";
    if (isLoadingEmirates || !emirates) return selectedEmirate;
    
    const emirate = emirates.find(e => e.emirate === selectedEmirate);
    if (emirate) {
        return locale === "ar" ? emirate.emirateAr : emirate.emirate;
    }
    return selectedEmirate;
  };

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            icon={<ChevronDown className="-ml-3" />}
            iconPosition="right"
            className={cn(
              "py-2 text-xs text-secondary-40 hover:text-purple transition-colors whitespace-nowrap border-0 px-0 shadow-none data-[state=open]:text-purple focus:outline-none focus:ring-0 hover:bg-transparent",
              triggerClassName
            )}
          >
            {currentEmirateDisplay()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-fit text-xs max-h-[300px] overflow-y-auto z-[60]"
          align="start"
        >
          <DropdownMenuItem onClick={() => handleCityChange("")} className="cursor-pointer">
            {locale === "ar" ? "كل المدن (الإمارات)" : "All Cities (UAE)"}
          </DropdownMenuItem>
          {isLoadingEmirates
            ? Array.from({ length: 5 }).map((_, i) => (
                <DropdownMenuItem key={i}>
                  <div className="animate-pulse bg-gray-300 h-5 w-40 rounded-sm"></div>
                </DropdownMenuItem>
              ))
            : emirates?.map((emirate) => {
                const displayName = locale === "ar" ? emirate.emirateAr : emirate.emirate;
                const value = emirate.emirate;

                return (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => handleCityChange(value)}
                    className={cn(
                      "cursor-pointer",
                      selectedEmirate === value ? "bg-purple/20 text-purple" : ""
                    )}
                  >
                    {displayName}
                  </DropdownMenuItem>
                );
              })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EmirateSelector;

"use client";

import React, { useMemo, useCallback } from "react";
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
import { cn } from "@/lib/utils";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useEmirateStore } from "@/stores/emirateStore";

interface EmirateSelectorProps {
  onEmirateChange?: (emirate: string) => void;
  className?: string;
  triggerClassName?: string;
}

const EmirateSelector = ({ 
  onEmirateChange, 
  className,
  triggerClassName 
}: EmirateSelectorProps) => {
  const { updateUrlParam, searchParams } = useUrlParams();
  const { data: emirates, isLoading: isLoadingEmirates } = useEmirates();
  const { locale } = useLocale();

  const selectedEmirate = useEmirateStore(state => state.selectedEmirate);
  const setSelectedEmirate = useEmirateStore(state => state.setSelectedEmirate);

  // Sync state when URL parameter changes
  const handleQueryParamSync = useCallback((val: string) => {
    if (val !== useEmirateStore.getState().selectedEmirate) {
      useEmirateStore.getState().setSelectedEmirate(val);
    }
  }, []);

  useQueryParam(searchParams, "emirate", handleQueryParamSync);

  // Handle city change using the optimized useUrlParams hook
  const handleCityChange = useCallback((value: string) => {
    // Update store state immediately for instant UI feedback
    setSelectedEmirate(value);

    // Update URL parameter
    updateUrlParam("emirate", value);

    // Trigger external callback if provided
    if (onEmirateChange) {
      onEmirateChange(value);
    }
  }, [setSelectedEmirate, updateUrlParam, onEmirateChange]);

  const currentEmirateDisplay = useMemo(() => {
    if (!selectedEmirate) return locale === "ar" ? "كل المدن" : "UAE";
    if (isLoadingEmirates || !emirates) return selectedEmirate;
    
    const emirate = emirates.find(e => e.emirate === selectedEmirate);
    if (emirate) {
        return locale === "ar" ? emirate.emirateAr : emirate.emirate;
    }
    return selectedEmirate;
  }, [selectedEmirate, locale, isLoadingEmirates, emirates]);

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            icon={<ChevronDown className="-ml-3" />}
            iconPosition="right"
            className={cn(
              "py-2 text-xs text-secondary-40 hover:text-purple transition-colors whitespace-nowrap border-0 px-0 shadow-none data-[state=open]:text-purple focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent",
              triggerClassName
            )}
          >
            {currentEmirateDisplay}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-fit text-xs max-h-[300px] overflow-y-auto z-[60]"
          align="start"
        >
          <DropdownMenuItem onClick={() => handleCityChange("")} className="cursor-pointer">
            {locale === "ar" ? "كل المدن" : "UAE"}
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

export default React.memo(EmirateSelector);

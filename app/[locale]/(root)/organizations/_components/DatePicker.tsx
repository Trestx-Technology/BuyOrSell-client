"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    if (value) {
      const parsedDate = new Date(value);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }
    return undefined;
  });

  // Sync date state with value prop when it changes
  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      } else {
        setDate(undefined);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDate(selectedDate);
    // Format as YYYY-MM-DD for the form
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    onChange(formattedDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          icon={<CalendarIcon className="text-purple" />}
          iconPosition="left"
          disabled={disabled}
          className={cn(
            "w-full h-11 px-3 py-2.5 border border-[#F5EBFF] dark:border-gray-700 rounded-lg text-xs font-medium text-[#8B31E1] dark:text-purple bg-white dark:bg-gray-800 justify-start text-left hover:bg-white dark:hover:bg-gray-800 focus-visible:border-[#F5EBFF] dark:focus-visible:border-gray-700 focus-visible:ring-2 focus-visible:ring-[#8B31E1]/20",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-lg border border-[#E2E2E2] dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
        align="start"
      >
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          defaultMonth={date}
          disabled={(date) => date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};


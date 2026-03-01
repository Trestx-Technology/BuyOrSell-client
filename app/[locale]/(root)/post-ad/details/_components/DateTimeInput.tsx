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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateTimeInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const DateTimeInput = ({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  className,
}: DateTimeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    if (value) {
      const parsedDate = new Date(value);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }
    return undefined;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        const hours = String(parsedDate.getHours()).padStart(2, "0");
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    }
    return null;
  });

  // Generate time slots (15-minute intervals from 9:00 to 18:00)
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        const hours = String(parsedDate.getHours()).padStart(2, "0");
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
        setSelectedTime(`${hours}:${minutes}`);
      }
    } else {
      setDate(undefined);
      setSelectedTime(null);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);

    // Combine date with time if time is already selected
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      selectedDate.setHours(parseInt(hours, 10));
      selectedDate.setMinutes(parseInt(minutes, 10));
      onChange(selectedDate.toISOString());
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);

    if (date) {
      const [hours, minutes] = time.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      onChange(newDate.toISOString());
    }
  };

  const displayValue = date
    ? `${format(date, "PPP")}${selectedTime ? ` ${selectedTime}` : ""}`
    : placeholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          disabled={disabled}
          //     icon={}
          //   iconPosition="right"

          className={cn(
            "w-full h-11 relative px-3 py-2.5 justify-start  text-left font-normal",
            "border border-[#F5EBFF] rounded-lg",
            "text-xs font-medium text-[#8B31E1]",
            "bg-white dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 hover:text-[#8B31E1]",
            "focus-visible:ring-2 focus-visible:ring-[#8B31E1]/20",
            !date && "text-[#8B31E1]",
            disabled && "bg-gray-100 cursor-not-allowed opacity-50",
            className,
          )}
        >
          {displayValue}
          <CalendarIcon className="absolute right-2 top-3 h-4 w-4 text-[#8B31E1]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-lg border border-[#E2E2E2] rounded-lg"
        align="start"
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <div className="relative flex flex-col md:flex-row">
            {/* Calendar Section */}
            <div className="p-6">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                defaultMonth={date}
                showOutsideDays={false}
                className="bg-transparent p-0 [--cell-size:--spacing(10)]"
                formatters={{
                  formatWeekdayName: (date) => {
                    return date.toLocaleString("en-US", { weekday: "short" });
                  },
                }}
              />
            </div>

            {/* Time Slot Selection */}
            <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#E2E2E2] md:w-48 max-md:w-full">
              <ScrollArea className="h-[300px] md:h-auto md:max-h-[400px]">
                <div className="flex flex-col gap-2 p-6">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "primary" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className="w-full shadow-none text-xs"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimeInput;

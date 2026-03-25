"use client";

import * as React from "react";
import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export interface NaturalLanguageCalendarProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function NaturalLanguageCalendar({
  label,
  value = "",
  onChange,
  placeholder = "Today or yesterday",
  className,
}: NaturalLanguageCalendarProps) {
  const [open, setOpen] = React.useState(false);

  // Parse initial value to date if it's a valid ISO string or date string
  const initialDate = React.useMemo(() => {
    if (!value) return undefined;
    const timestamp = Date.parse(value);
    if (isNaN(timestamp)) return undefined;
    const date = new Date(timestamp);
    // Don't allow future dates even from initial value
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    return date > todayEnd ? undefined : date;
  }, [value]);

  // Initial display value is formatted date if valid, otherwise empty
  // (input value is for user typing, so we don't force ISO string into it)
  const [inputValue, setInputValue] = React.useState(
    initialDate ? formatDate(initialDate) : "",
  );

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(
    initialDate || new Date(),
  );

  // Sync internal state if value prop changes externally (e.g. cleared form)
  React.useEffect(() => {
    // If value is empty, clear everything
    if (!value) {
      setInputValue("");
      setDate(undefined);
      return;
    }

    // If value is a valid new date that doesn't match current internal date, update
    const timestamp = Date.parse(value);
    if (!isNaN(timestamp)) {
      const newDate = new Date(timestamp);
      // Skip if future
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      if (newDate > todayEnd) return;

      if (date?.toISOString() !== newDate.toISOString()) {
        setDate(newDate);
        setMonth(newDate);
        setInputValue(formatDate(newDate));
      }
    }
  }, [value, date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Parse natural language
    const parsedDate = parseDate(newValue);

    if (parsedDate) {
      // Check if future
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      if (parsedDate > todayEnd) return;

      setDate(parsedDate);
      setMonth(parsedDate);
      // Send ISO string to parent
      onChange?.(parsedDate.toISOString());
    } else {
      // If invalid date/still typing, we don't update the parent with a date yet
      if (newValue === "") {
        setDate(undefined);
        onChange?.("");
      }
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Calendar component already disables future dates, but for safety:
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      if (selectedDate > todayEnd) return;

      setDate(selectedDate);
      const formatted = formatDate(selectedDate);
      setInputValue(formatted);
      onChange?.(selectedDate.toISOString());
      setOpen(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && <Label className="px-1 mb-2 block">{label}</Label>}
      <div className="w-full relative flex gap-2">
        <Input
          value={inputValue}
          placeholder={placeholder}
          className={cn(
            "h-11 font-semibold border text-gray-900 dark:text-gray-100 placeholder:text-muted-foreground shadow-sm",
            "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-purple/20",
          )}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size={"icon-sm"}
              className="size-6 absolute top-1/2 right-2 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-fit overflow-hidden p-0 border dark:border-gray-800"
            align="end"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

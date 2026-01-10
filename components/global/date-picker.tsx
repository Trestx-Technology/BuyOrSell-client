"use client";

import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateLocale } from "@/lib/date-utils";

interface DatePickerProps {
  label?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Tomorrow or next week",
  disabled,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value ? formatDateLocale(value) : ""
  );
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [month, setMonth] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    if (value) {
      setDate(value);
      setMonth(value);
      setInputValue(formatDateLocale(value));
    } else {
      setDate(undefined);
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const parsedDate = parseDate(newValue);
    if (parsedDate) {
      const parsed = new Date(parsedDate);
      if (!minDate || parsed >= minDate) {
        setDate(parsed);
        setMonth(parsed);
        onChange(parsed);
      }
    } else if (newValue === "") {
      setDate(undefined);
      onChange(undefined);
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setInputValue(formatDateLocale(selectedDate));
      onChange(selectedDate);
    } else {
      setInputValue("");
      onChange(undefined);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor="date-picker-input" className="text-slate-600 text-xs">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date-picker-input"
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10 text-xs cursor-pointer"
          readOnly
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              type="button"
              variant="ghost"
              className="-translate-y-1/2 absolute top-1/2 right-2 size-6"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

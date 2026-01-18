"use client"

import * as React from "react"
import { parseDate } from "chrono-node"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export interface NaturalLanguageCalendarProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function NaturalLanguageCalendar({
  label,
  value = "",
  onChange,
  placeholder = "Tomorrow or next week",
  className,
}: NaturalLanguageCalendarProps) {
  const [open, setOpen] = React.useState(false)

  // Parse initial value to date if it's a valid ISO string or date string
  const initialDate = React.useMemo(() => {
    if (!value) return undefined;
    const timestamp = Date.parse(value);
    return isNaN(timestamp) ? undefined : new Date(timestamp);
  }, [value]);

  // Initial display value is formatted date if valid, otherwise empty 
  // (input value is for user typing, so we don't force ISO string into it)
  const [inputValue, setInputValue] = React.useState(
    initialDate ? formatDate(initialDate) : ""
  )

  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [month, setMonth] = React.useState<Date | undefined>(initialDate || new Date())

  // Sync internal state if value prop changes externally (e.g. cleared form)
  React.useEffect(() => {
    // If value is empty, clear everything
    if (!value) {
      setInputValue("")
      setDate(undefined)
      return;
    }

    // If value is a valid new date that doesn't match current internal date, update
    const timestamp = Date.parse(value);
    if (!isNaN(timestamp)) {
      const newDate = new Date(timestamp);
      if (date?.toISOString() !== newDate.toISOString()) {
        setDate(newDate);
        setMonth(newDate);
        setInputValue(formatDate(newDate));
      }
    }
  }, [value, date])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Parse natural language
    const parsedDate = parseDate(newValue)

    if (parsedDate) {
      setDate(parsedDate)
      setMonth(parsedDate)
      // Send ISO string to parent
      onChange?.(parsedDate.toISOString())
    } else {
      // If invalid date/still typing, we don't update the parent with a date yet
      // OR we can choose to clear it? 
      // User requested "value should be in the ISO", so if invalid, we probably shouldn't emit an ISO string.
      // However, typical behavior is to clear the date if input is cleared.
      if (newValue === "") {
        setDate(undefined)
        onChange?.("")
      }
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const formatted = formatDate(selectedDate)
      setInputValue(formatted)
      onChange?.(selectedDate.toISOString())
      setOpen(false)
    }
  }

  return (
    <div className={cn("w-full",className)}>
      {label && <Label className="px-1 mb-2 block">{label}</Label>}
      <div className="w-fit relative flex gap-2">
        <Input
          value={inputValue}
          placeholder={placeholder}
          className="bg-secondary h-9 font-semibold text-grey-blue border-0"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
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
          <PopoverContent className="w-fit overflow-hidden p-0" align="end">
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
  )
}


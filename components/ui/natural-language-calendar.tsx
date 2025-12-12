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
  const [inputValue, setInputValue] = React.useState(value)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? parseDate(value) || undefined : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date || new Date())

  React.useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value)
      const parsedDate = value ? parseDate(value) : undefined
      if (parsedDate) {
        setDate(parsedDate)
        setMonth(parsedDate)
      }
    }
  }, [value, inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    const parsedDate = parseDate(newValue)
    if (parsedDate) {
      setDate(parsedDate)
      setMonth(parsedDate)
      const formatted = formatDate(parsedDate)
      onChange?.(formatted)
    } else {
      onChange?.(newValue)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const formatted = formatDate(selectedDate)
      setInputValue(formatted)
      onChange?.(formatted)
      setOpen(false)
    }
  }

  return (
    <div className={cn("w-full",className)}>
      {label && <Label className="px-1 mb-2 block">{label}</Label>}
      <div className="relative flex gap-2">
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
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
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


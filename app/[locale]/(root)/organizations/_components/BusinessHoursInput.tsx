"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectInput } from "@/app/[locale]/(root)/post-ad/details/_components/SelectInput";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";

export interface BusinessHour {
  day: number; // 1-7 (Monday-Sunday)
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed: boolean;
  allDay: boolean;
}

interface BusinessHoursInputProps {
  value?: BusinessHour[];
  onChange?: (hours: BusinessHour[]) => void;
  disabled?: boolean;
}

const DAY_OPTIONS = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
  { value: "7", label: "Sunday" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const time = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { value: time, label: time };
});

export function BusinessHoursInput({
  value = [],
  onChange,
  disabled = false,
}: BusinessHoursInputProps) {
  const [hours, setHours] = useState<BusinessHour[]>(value);

  // Sync state with value prop when it changes (e.g., after form reset)
  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(hours)) {
      setHours(value);
    }
  }, [value]);

  const updateHours = (newHours: BusinessHour[]) => {
    setHours(newHours);
    onChange?.(newHours);
  };

  const addHour = () => {
    const newHour: BusinessHour = {
      day: 1,
      open: "09:00",
      close: "18:00",
      closed: false,
      allDay: false,
    };
    updateHours([...hours, newHour]);
  };

  const removeHour = (index: number) => {
    updateHours(hours.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateHour = (index: number, field: keyof BusinessHour, newValue: any) => {
    const updated = hours.map((hour, i) =>
      i === index ? { ...hour, [field]: newValue } : hour
    );
    updateHours(updated);
  };

  return (
    <div className="space-y-4">
      {hours.map((hour, index) => (
        <div
          key={index}
          className="border border-[#E5E5E5] rounded-lg p-4 space-y-4 bg-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple" />
              <span className="text-sm font-medium text-[#1D2939]">
                Business Hours {index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHour(index)}
              disabled={disabled}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Day" htmlFor={`day-${index}`} required>
              <SelectInput
                value={hour.day.toString()}
                onChange={(val) => updateHour(index, "day", parseInt(val))}
                options={DAY_OPTIONS}
                placeholder="Select day"
                disabled={disabled}
              />
            </FormField>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={hour.closed}
                  onCheckedChange={(checked) =>
                    updateHour(index, "closed", checked === true)
                  }
                  disabled={disabled}
                />
                <span className="text-sm text-[#1D2939]">Closed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={hour.allDay}
                  onCheckedChange={(checked) =>
                    updateHour(index, "allDay", checked === true)
                  }
                  disabled={disabled}
                />
                <span className="text-sm text-[#1D2939]">All Day</span>
              </label>
            </div>
          </div>

          {!hour.closed && !hour.allDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Open Time" htmlFor={`open-${index}`} required>
                <SelectInput
                  value={hour.open}
                  onChange={(val) => updateHour(index, "open", val)}
                  options={TIME_OPTIONS}
                  placeholder="Select open time"
                  disabled={disabled}
                />
              </FormField>

              <FormField label="Close Time" htmlFor={`close-${index}`} required>
                <SelectInput
                  value={hour.close}
                  onChange={(val) => updateHour(index, "close", val)}
                  options={TIME_OPTIONS}
                  placeholder="Select close time"
                  disabled={disabled}
                />
              </FormField>
            </div>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addHour}
        disabled={disabled}
                    icon={
        <Plus className="w-4 h-4" />
              
                    }
        iconPosition="center"
        className="w-full"
      >
        Add Business Hours
      </Button>
    </div>
  );
}


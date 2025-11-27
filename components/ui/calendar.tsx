"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-purple/20 group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-7 h-7 w-7 bg-purple/20 hover:bg-purple/30 border-0 rounded-md p-0 select-none text-purple",
          "focus:border-purple focus:ring-purple/20 focus:outline-none focus-visible:border-purple focus-visible:ring-purple/20 focus-visible:ring-offset-0 focus-visible:outline-none",
          "[&>svg]:text-purple [&>svg]:fill-purple [&>svg]:stroke-purple",
          "[&:focus-visible]:ring-purple/20 [&:focus-visible]:ring-2 [&:focus-visible]:ring-offset-0",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-7 h-7 w-7 bg-purple/20 hover:bg-purple/30 border-0 rounded-md p-0 select-none text-purple",
          "focus:border-purple focus:ring-purple/20 focus:outline-none focus-visible:border-purple focus-visible:ring-purple/20 focus-visible:ring-offset-0 focus-visible:outline-none",
          "[&>svg]:text-purple [&>svg]:fill-purple [&>svg]:stroke-purple",
          "[&:focus-visible]:ring-purple/20 [&:focus-visible]:ring-2 [&:focus-visible]:ring-offset-0",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium text-purple",
          captionLayout === "label"
            ? "text-base"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-purple/70 [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-purple/70 rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-purple/20",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-purple/20", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-purple/20", defaultClassNames.range_end),
        today: cn(
          "bg-purple/20 text-purple font-medium rounded-md data-[selected=true]:rounded-none data-[selected=true]:bg-purple data-[selected=true]:text-white",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[#C1C1C1] opacity-50 aria-selected:text-[#C1C1C1] aria-selected:opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-[#C1C1C1] opacity-40 cursor-not-allowed line-through",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className,)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4 text-purple", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4 text-purple", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "text-purple hover:bg-purple/20 hover:text-purple rounded-md transition-colors",
        "data-[selected-single=true]:bg-purple/20 data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-purple data-[selected-single=true]:border-purple data-[selected-single=true]:ring-purple/20",
        "data-[range-middle=true]:bg-purple/20 data-[range-middle=true]:text-purple",
        "data-[range-start=true]:bg-purple data-[range-start=true]:text-white data-[range-start=true]:border-purple",
        "data-[range-end=true]:bg-purple data-[range-end=true]:text-white data-[range-end=true]:border-purple",
        "group-data-[focused=true]/day:border-purple group-data-[focused=true]/day:ring-purple/20 group-data-[focused=true]/day:outline-none",
        "focus:border-purple focus:ring-purple/20 focus:outline-none focus-visible:border-purple focus-visible:ring-purple/20 focus-visible:ring-offset-0 focus-visible:outline-none",
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-2",
        "data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md",
        "data-[range-middle=true]:rounded-none",
        "data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md",
        "[&>span]:text-xs [&>span]:opacity-70",
        "border-0 [&:focus]:border-purple [&:focus]:ring-2 [&:focus]:ring-purple/20 [&:focus]:outline-none [&:focus-visible]:ring-purple/20 [&:focus-visible]:ring-offset-0 [&:focus-visible]:ring-2",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };

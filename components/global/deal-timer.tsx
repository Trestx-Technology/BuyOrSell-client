"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

interface DealTimerProps {
      validThrough: string | null | Date;
      className?: string;
      showIcon?: boolean;
      variant?: "tag" | "plain";
      textColor?: string;
      iconColor?: string;
}

export function DealTimer({
      validThrough,
      className,
      showIcon = true,
      variant = "tag",
      textColor = "text-error-100",
      iconColor = "text-red-500",
}: DealTimerProps) {
      const [timeLeft, setTimeLeft] = useState("");

      useEffect(() => {
            if (!validThrough) {
                  setTimeLeft("");
                  return;
            }

            const updateTimer = () => {
                  const now = new Date().getTime();
                  const end = new Date(validThrough).getTime();
                  const distance = end - now;

                  if (distance > 0) {
                        const totalSeconds = Math.floor(distance / 1000);
                        const totalMinutes = Math.floor(totalSeconds / 60);
                        const totalHours = Math.floor(totalMinutes / 60);
                        const days = Math.floor(totalHours / 24);
                        const hours = totalHours % 24;
                        const minutes = totalMinutes % 60;
                        const seconds = totalSeconds % 60;

                        // Format based on remaining time for better readability
                        // Screenshot style: "00h : 59 m"
                        let timeString = "";
                        const pad = (n: number) => n.toString().padStart(2, "0");

                        if (days > 0) {
                              timeString = `${days}d ${pad(hours)}h : ${pad(minutes)}m`;
                        } else {
                              timeString = `${pad(hours)}h : ${pad(minutes)}m`;
                        }

                        setTimeLeft(timeString);
                  } else {
                        setTimeLeft("EXPIRED");
                  }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
      }, [validThrough, variant]);

      if (!timeLeft) return null;

      if (variant === "plain") {
            return (
                  <div className={cn("flex items-center gap-1", className)}>
                        {showIcon && <Clock className={cn("w-3 h-3", iconColor)} />}
                        <span className={cn(textColor)}>{timeLeft}</span>
                  </div>
            );
      }

      return (
            <div
                  className={cn(
                        "bg-white rounded px-2 py-1 flex items-center gap-1",
                        className
                  )}
            >
                  {showIcon && <Clock className={cn("w-4 h-4", iconColor)} />}
                  <Typography variant="xs-black-inter" className={cn("text-sm font-medium", textColor)}>
                        {timeLeft}
                  </Typography>
            </div>
      );
}

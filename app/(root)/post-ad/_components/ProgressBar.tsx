"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAdPosting } from "../_context/AdPostingContext";

interface ProgressBarProps {
  currentStep?: number;
  totalSteps: number;
  title?: string;
  showIcons?: boolean;
}

export default function ProgressBar({
  totalSteps,
  title = "Create Post for your ads",
  showIcons = true,
}: ProgressBarProps) {
  const {currentStep} = useAdPosting()
  const [robotPosition, setRobotPosition] = useState(0);

  const progressPercentage = (currentStep / totalSteps) * 100;
  const progressWidth = `${progressPercentage}%`;

  useEffect(() => {
    // Calculate robot position as percentage of container width
    const containerWidth = 880; // max-w-[880px]
    const robotWidth = 40; // w-10 = 40px
    const robotOffset = robotWidth / 2; // Center the robot on the progress line

    // Calculate position in pixels
    const progressInPixels = (progressPercentage / 100) * containerWidth;
    const newPosition = Math.max(
      0,
      Math.min(progressInPixels - robotOffset, containerWidth - robotWidth)
    );

    // Convert to percentage for CSS
    const positionPercentage = (newPosition / containerWidth) * 100;
    setRobotPosition(positionPercentage);
  }, [currentStep, totalSteps, progressPercentage]);

  return (
    <div className="max-w-[888px] mx-auto flex flex-col gap-4">
      {/* Title */}
      <h2 className="text-xs font-semibold text-[#1D2939] text-left">
        {title}
      </h2>

      {/* Progress Bar Container */}
      <div className="w-full max-w-[880px] relative">
        {/* Background Line */}
        <div className="w-full h-1 bg-[#EDEEF5] rounded-full"></div>

        {/* Progress Line */}
        <div
          className="absolute top-0 left-0 h-1 bg-[#8B31E1] rounded-full transition-all duration-700 ease-out"
          style={{ width: progressWidth }}
        ></div>

        {/* Robot Icon - positioned based on progress */}
        {showIcons && (
          <div
            className="absolute -top-[36px] w-10 h-10 transition-all duration-700 ease-out"
            style={{
              left: `${robotPosition}%`,
              transform: "translateX(0)",
            }}
          >
            <Image
              src="/images/category-icons/walking-robot.png"
              alt="Progress Robot"
              width={40}
              height={40}
              className="transition-all duration-500 ease-out"
            />
          </div>
        )}

        {/* Finish Line Icon */}
        {showIcons && (
          <div className="absolute -top-[46px] -right-2 w-[50px] h-[50px]">
            <Image
              src="/images/category-icons/finish-line.png"
              alt="Finish Line"
              width={50}
              height={50}
            />
          </div>
        )}
      </div>

      {/* Steps Text */}
      <p className="text-sm font-semibold text-center text-[#8B31E1] transition-all duration-500 ease-out">
        Steps {currentStep}/{totalSteps}
      </p>
    </div>
  );
}

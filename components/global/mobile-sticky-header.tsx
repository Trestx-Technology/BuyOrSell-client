"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useRouter } from "next/navigation";

interface MobileStickyHeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
}

export function MobileStickyHeader({
  title,
  onBack,
  className,
}: MobileStickyHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`flex justify-center sm:hidden border sticky top-0 bg-white dark:bg-gray-900 dark:border-gray-800 z-10 py-4 shadow-sm ${
        className || ""
      }`}
    >
      <Button
        variant={"ghost"}
        icon={<ChevronLeft className="h-4 w-4" />}
        iconPosition="center"
        size={"icon-sm"}
        className="absolute left-4 text-purple dark:text-purple-400 w-fit"
        onClick={handleBack}
      />
      <Typography variant="lg-semibold" className="text-dark-blue dark:text-white">
        {title}
      </Typography>
    </div>
  );
}

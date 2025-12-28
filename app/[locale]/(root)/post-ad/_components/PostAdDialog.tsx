"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, } from "lucide-react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { useLocale } from "@/hooks/useLocale";

interface PostAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostAdDialog({ isOpen, onClose }: PostAdDialogProps) {
  const router = useRouter();
  const { localePath } = useLocale();

  const handleAICreate = () => {
    onClose();
    // Navigate to AI-powered ad creation
    router.push(localePath("/ai-ad-post"));
  };

  const handleManualCreate = () => {
    onClose();
    // Navigate to manual ad creation
    router.push(localePath("/post-ad?mode=manual"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[528px] p-0 bg-[#F9F9F9] rounded-xl border-0">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 bg-[#F2F4F7] rounded-full hover:bg-gray-200"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Main Title */}
          <h2 className="text-sm sm:text-lg font-semibold text-[#1D2939] mb-8">
            Placing an Ad now become more easy
          </h2>

          {/* Ad Posting Illustration */}
          <div className="flex justify-center mb-8">
            <div className="w-[150px] h-[150px] bg-gray-100 rounded-lg flex items-center justify-center">
              <Image
                src={
                  "https://dev-buyorsell.s3.me-central-1.amazonaws.com/assets/Ads+Posting.png"
                }
                alt="Ads Posting"
                className="w-full h-full object-cover"
                width={150}
                height={150}
              />
            </div>
          </div>

          {/* Options Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            {/* AI Create Option */}
            <Button
              onClick={handleAICreate}
              icon={
                <Image
                  src={ICONS.ai.aiPurpleBg}
                  alt="AI Logo"
                  width={24}
                  height={24}
                />
              }
              iconPosition="right"
              className="flex w-full items-center gap-2 px-3 py-2.5 bg-[#8B31E1] text-white rounded-lg hover:bg-[#7B2AD1] transition-colors"
            >
              Create ads with AI
            </Button>

            {/* Or Divider */}
            <span className="text-xs font-medium text-[#1D2939]">Or</span>

            {/* Manual Create Option */}
            <Button
              onClick={handleManualCreate}
              variant="outline"
              className="flex items-center w-full gap-2 px-3 py-2.5 border-[#8B31E1] text-[#8B31E1] rounded-lg hover:bg-[#8B31E1] hover:text-white transition-colors"
            >
              Create ads manually
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

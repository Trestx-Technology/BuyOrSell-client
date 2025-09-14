"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Share2, Heart, ChevronLeft } from "lucide-react";

const Header: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Share clicked");
  };

  const handleSave = () => {
    // Implement save/favorite functionality
    console.log("Save clicked");
  };

  return (
    <div className="flex items-center justify-between py-3 sm:mt-4 px-4 xl:px-0 relative">
      {/* Left side - Back button */}
      <button
        onClick={handleBack}
        className="py-0 text-purple hover:font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Right side - Share and Save */}
      <div className="flex items-center gap-2 z-10 sm:gap-4 max-[620px]:absolute  -bottom-12 right-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium sm:block hidden">Share</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110"
        >
          <Heart className="h-5 w-5" />
          <span className="text-sm font-medium sm:block hidden">Save</span>
        </button>
      </div>
    </div>
  );
};

export default Header;

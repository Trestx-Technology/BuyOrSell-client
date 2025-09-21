"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Heart, ChevronLeft } from "lucide-react";
import AddToCollectionDialog from "@/app/(root)/favorites/_components/add-to-collection-dialog";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="hidden sm:flex items-center gap-2 z-10 sm:gap-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium sm:block hidden">Share</span>
        </button>

        <AddToCollectionDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          adId="123"
          adTitle="BMW 5 Series 2023"
          adImage="/car-image.jpg"
          onAddToCollection={(adId, collectionId) => {
            console.log(`Adding ${adId} to ${collectionId}`);
          }}
          onCreateNewCollection={() => {
            console.log("Create new collection");
          }}
        >
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110"
          >
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium sm:block hidden">Save</span>
          </button>
        </AddToCollectionDialog>
      </div>
    </div>
  );
};

export default Header;

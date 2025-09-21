"use client";

import React, { useState } from "react";
import DrawerWrapper from "../../../../components/global/drawer-wrapper";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { mockAds } from "@/constants/sample-listings";

export interface NewCollectionDrawerProps {
  trigger: React.ReactNode;
  className?: string;
}

const NewCollectionDrawer: React.FC<NewCollectionDrawerProps> = ({
  trigger,
  className,
}) => {
  const [collectionName, setCollectionName] = useState("");

  const handleCreateCollection = () => {
    console.log("Create Collection");
  };

  return (
    <DrawerWrapper
      title="New Collection"
      trigger={trigger}
      direction="bottom"
      className={className}
      showBackButton={true}
      showCloseButton={false}
    >
      <div className="space-y-4 p-4">
        <div className="max-w-xl">
          <div className="space-y-6">
            {/* Collection Preview Image */}
            <div className="w-full">
              <div className="mx-auto size-[100px] rounded border overflow-hidden">
                {typeof mockAds[0].images[0] === "string" && (
                  <img
                    src={mockAds[0].images[0]}
                    alt="Collection preview"
                    className="size-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Collection Name Input */}
            <Input
              type="text"
              placeholder="Enter list name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full h-12"
            />

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button
                onClick={handleCreateCollection}
                disabled={!collectionName.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Create List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DrawerWrapper>
  );
};

export default NewCollectionDrawer;

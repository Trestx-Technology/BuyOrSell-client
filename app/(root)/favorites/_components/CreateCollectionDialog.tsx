"use client";

import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAds } from "@/constants/sample-listings";

interface CreateCollectionDialogProps {
  children?: React.ReactNode;
}

export function CreateCollectionDialog({
  children,
}: CreateCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const handleCreateCollection = () => {
    if (collectionName.trim()) {
      // Here you would typically make an API call to create the collection
      console.log(`Creating collection: ${collectionName}`);
      setOpen(false);
      setCollectionName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent showCloseButton={false} className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="p-1"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Create List
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="p-1"
            >
              <X className="size-6" />
            </Button>
          </div>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, X, Loader2, ImageUpIcon, Camera } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateCollection } from "@/hooks/useCollections";
import { useUploadFile } from "@/hooks/useUploadFile";
import Image from "next/image";
import { Collection } from "@/interfaces/collections.types";

interface EditCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection | null;
  onCollectionUpdated?: () => void;
}

export function EditCollectionDialog({
  open,
  onOpenChange,
  collection,
  onCollectionUpdated,
}: EditCollectionDialogProps) {
  const [collectionName, setCollectionName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateCollectionMutation = useUpdateCollection();

  // Use upload file hook
  const {
    upload: uploadImage,
    isUploading,
    fileUrl: imageUrl,
    reset: resetUpload,
  } = useUploadFile({
    maxFileSize: 5,
    acceptedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    onSuccess: () => {
      // Clear preview after successful upload since we have the URL
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
        setImagePreview(null);
      }
    },
  });

  // Initialize form when collection changes or dialog opens
  useEffect(() => {
    if (collection && open) {
      setCollectionName(collection.name || "");

      // Check for imageURL first (from API), then images array
      const collectionData = collection as unknown as Record<string, unknown>;
      const imageURL = collectionData.imageURL as string | undefined;
      const existingImage = imageURL || collection.images?.[0] || null;

      setCurrentImageUrl(existingImage);
      setImagePreview(existingImage);
      resetUpload();
    }
  }, [collection, open, resetUpload]);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Create preview
      const preview = URL.createObjectURL(file);
      previewRef.current = preview;
      setImagePreview(preview);

      // Auto-upload the image
      uploadImage(file);
    },
    [uploadImage]
  );

  const handleRemoveImage = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setImagePreview(null);
    setCurrentImageUrl(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateCollection = async () => {
    if (collectionName.trim() && collection?._id) {
      try {
        const collectionData = collection as unknown as Record<string, unknown>;
        const existingImageURL = collectionData.imageURL as string | undefined;
        const existingImage = existingImageURL || collection.images?.[0];

        await updateCollectionMutation.mutateAsync({
          id: collection._id,
          data: {
            name: collectionName.trim(),
            imageURL: imageUrl || existingImage || undefined,
          },
        });
        onOpenChange(false);
        setCollectionName("");
        handleRemoveImage();
        onCollectionUpdated?.();
      } catch (error) {
        console.error("Error updating collection:", error);
      }
    }
  };

  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset form when dialog closes
      setCollectionName("");
      handleRemoveImage();
    }
  };

  const displayImage = imagePreview || imageUrl || currentImageUrl;
  const hasImage = !!displayImage;

  return (
    <ResponsiveModal open={open} onOpenChange={handleDialogClose}>
      <ResponsiveModalContent className="max-w-md">
        <ResponsiveModalHeader>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDialogClose(false)}
              className="p-1"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <ResponsiveModalTitle className="text-lg font-semibold text-gray-900">
              Edit List
            </ResponsiveModalTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDialogClose(false)}
              className="p-1"
            >
              <X className="size-6" />
            </Button>
          </div>
        </ResponsiveModalHeader>

        <div className="space-y-6 px-4 pb-4">
          {/* Collection Image Upload */}
          <div className="w-full">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="mx-auto size-[150px] rounded-2xl border overflow-hidden relative group">
              {hasImage ? (
                <>
                  <Image
                    src={displayImage}
                    alt="Collection preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    {!isUploading && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={handleChangeImage}
                          className="bg-white text-gray-900 rounded-full p-2 hover:bg-gray-100 transition-colors"
                          title="Change image"
                        >
                          <Camera className="size-4" />
                        </button>
                        <button
                          onClick={handleRemoveImage}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="size-6 animate-spin text-white" />
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleChangeImage}
                  disabled={isUploading}
                  className="w-full h-full flex rounded-2xl flex-col items-center justify-center bg-gray-50 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="size-6 animate-spin text-gray-400" />
                  ) : (
                    <>
                      <ImageUpIcon className="size-8 text-purple mb-1" />
                      <span className="text-sm text-purple">Upload Image</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {isUploading && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Uploading image...
              </p>
            )}
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
              onClick={handleUpdateCollection}
              disabled={
                !collectionName.trim() ||
                updateCollectionMutation.isPending ||
                isUploading
              }
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {updateCollectionMutation.isPending
                ? "Updating..."
                : "Update List"}
            </Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

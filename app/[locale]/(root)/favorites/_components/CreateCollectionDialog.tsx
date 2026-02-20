"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronLeft, X, ImageUpIcon, Loader2 } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCollection } from "@/hooks/useCollections";
import { useAuthStore } from "@/stores/authStore";
import { useUploadFile } from "@/hooks/useUploadFile";
import Image from "next/image";

interface CreateCollectionDialogProps {
  children?: React.ReactNode;
  onCollectionCreated?: () => void;
}

export function CreateCollectionDialog({
  children,
  onCollectionCreated,
}: CreateCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createCollectionMutation = useCreateCollection();
  const { session } = useAuthStore();
  const userId = session.user?._id;

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
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateCollection = async () => {
    if (collectionName.trim() && userId) {
      try {
        await createCollectionMutation.mutateAsync({
          name: collectionName.trim(),
          userId,
          imageURL: imageUrl || undefined,
        });
        setOpen(false);
        setCollectionName("");
        handleRemoveImage();
        onCollectionCreated?.();
      } catch (error) {
        console.error("Error creating collection:", error);
      }
    }
  };

  const handleDialogClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setCollectionName("");
      handleRemoveImage();
    }
  };

  // Wrap children with click handler to open dialog
  const triggerElement = children ? (
    <div onClick={() => setOpen(true)} className="cursor-pointer">
      {children}
    </div>
  ) : null;

  return (
    <>
      {triggerElement}
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
              <ResponsiveModalTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Create List
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
                {imagePreview || imageUrl ? (
                  <>
                    <Image
                      src={imagePreview || imageUrl || ""}
                      alt="Collection preview"
                      fill
                      className="object-cover"
                    />
                    {!isUploading && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                      className="w-full h-full flex rounded-2xl flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="size-6 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <ImageUpIcon className="size-8 text-purple mb-1" />
                        <span className="text-sm text-purple">
                          Upload Image
                        </span>
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
                onClick={handleCreateCollection}
                disabled={
                  !collectionName.trim() ||
                  createCollectionMutation.isPending ||
                  isUploading
                }
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {createCollectionMutation.isPending
                  ? "Creating..."
                  : "Create List"}
              </Button>
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
}

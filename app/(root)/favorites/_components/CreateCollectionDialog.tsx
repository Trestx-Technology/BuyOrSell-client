"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronLeft, X, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent showCloseButton={false} className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDialogClose(false)}
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
              onClick={() => handleDialogClose(false)}
              className="p-1"
            >
              <X className="size-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Collection Image Upload */}
          <div className="w-full">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="mx-auto size-[100px] rounded border overflow-hidden relative group">
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
                  className="w-full h-full flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="size-6 animate-spin text-gray-400" />
                  ) : (
                    <>
                      <Upload className="size-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload Image</span>
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
              {createCollectionMutation.isPending ? "Creating..." : "Create List"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

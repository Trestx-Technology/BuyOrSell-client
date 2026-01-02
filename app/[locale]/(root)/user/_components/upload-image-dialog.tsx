"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useUploadFile } from "@/hooks/useUploadFile";
import { toast } from "sonner";

interface UploadImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  title?: string;
  description?: string;
}

export default function UploadImageDialog({
  open,
  onOpenChange,
  currentImageUrl,
  onImageUploaded,
  title = "Upload Profile Picture",
  description = "Upload a new profile picture. Supported formats: JPG, PNG, GIF, WEBP (max 5MB)",
}: UploadImageDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    upload: uploadImage,
    isUploading,
    fileUrl: imageUrl,
    reset: resetUpload,
  } = useUploadFile({
    maxFileSize: 5,
    acceptedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    onSuccess: (uploadedUrl) => {
      // Clear preview after successful upload since we have the URL
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
        setImagePreview(null);
      }
      onImageUploaded(uploadedUrl);
      onOpenChange(false);
      toast.success("Profile picture updated successfully");
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

  const handleClose = () => {
    if (!isUploading) {
      handleRemoveImage();
      onOpenChange(false);
    }
  };

  const displayImage = imagePreview || imageUrl || currentImageUrl;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="mx-auto w-[200px] h-[200px] rounded-full border-4 border-purple-100 overflow-hidden relative group">
            {displayImage ? (
              <>
                <Image
                  src={displayImage}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
                {!isUploading && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-full flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                type="button"
              >
                {isUploading ? (
                  <Loader2 className="size-8 animate-spin text-gray-400" />
                ) : (
                  <>
                    <Upload className="size-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                  </>
                )}
              </button>
            )}
          </div>

          {isUploading && (
            <p className="text-sm text-center text-gray-500">
              Uploading image...
            </p>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

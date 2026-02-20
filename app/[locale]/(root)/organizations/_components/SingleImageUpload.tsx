"use client";

import type React from "react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadFile } from '@/app/api/media/media.services';
import { toast } from "sonner";
import { AxiosError } from "axios";

export interface SingleImageItem {
  id: string;
  url: string;
  file?: File;
  name?: string;
  presignedUrl?: string; // Final URL after upload
  uploading?: boolean; // Upload state
  uploadError?: string; // Error message if upload fails
}

export interface SingleImageUploadProps {
  image?: SingleImageItem | null;
  onImageChange?: (image: SingleImageItem | null) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  showUploadArea?: boolean;
  className?: string;
  uploadAreaClassName?: string;
  disabled?: boolean;
  label?: string;
}

export function SingleImageUpload({
  image = null,
  onImageChange,
  maxFileSize = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
  showUploadArea = true,
  className,
  uploadAreaClassName,
  disabled = false,
  label = "Upload Image",
}: SingleImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  // Upload a single image
  const uploadImage = useCallback(
    async (imageItem: SingleImageItem) => {
      if (!imageItem.file) return;

      // Mark as uploading
      const uploadingImage: SingleImageItem = {
        ...imageItem,
        uploading: true,
        uploadError: undefined,
      };
      onImageChange?.(uploadingImage);

      try {
        const response = await uploadFile(imageItem.file);
        
        // Update with presigned URL and remove file
        const finalImage: SingleImageItem = {
          ...imageItem,
          url: response.data.fileUrl,
          presignedUrl: response.data.fileUrl,
          uploading: false,
          file: undefined, // Remove file object
        };
        onImageChange?.(finalImage);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError?.response?.data?.message || "Failed to upload image";
        
        // Mark as error
        const errorImage: SingleImageItem = {
          ...imageItem,
          uploading: false,
          uploadError: errorMessage,
        };
        onImageChange?.(errorImage);
        toast.error(`Failed to upload ${imageItem.name}: ${errorMessage}`);
      }
    },
    [onImageChange]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const file = files[0];
      if (!file) return;

      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        toast.error(`File type ${file.type} not accepted. Please upload an image file.`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`File size exceeds ${maxFileSize}MB limit`);
        return;
      }

      const imageItem: SingleImageItem = {
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        name: file.name,
      };

      // Replace existing image
      onImageChange?.(imageItem);

      // Auto-upload new image
      uploadImage(imageItem);
    },
    [onImageChange, maxFileSize, acceptedFileTypes, disabled, uploadImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = useCallback(() => {
    if (disabled) return;
    // Clean up blob URL
    if (image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }
    onImageChange?.(null);
  }, [image, onImageChange, disabled]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileTypes.join(",");
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileSelect(target.files);
    };
    input.click();
  }, [acceptedFileTypes, handleFileSelect, disabled]);

  return (
    <div
      className={cn(
        "w-full",
        dragOver && "border-purple bg-purple/10",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Image Display */}
      {image && (
        <div className="relative rounded-lg overflow-hidden group border border-[#F5EBFF] dark:border-purple/20 border-dashed p-3">
          <div className="relative aspect-square w-full max-w-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {image.uploading ? (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : image.uploadError ? (
              <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <X className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-red-600 text-sm">{image.uploadError}</p>
                </div>
              </div>
            ) : (
              <Image
                src={image.presignedUrl || image.url}
                alt={image.name || "Uploaded image"}
                fill
                className="object-cover"
              />
            )}

            {/* Close button */}
            {!image.uploading && (
              <button
                type="button"
                onClick={removeImage}
                disabled={disabled}
                className="absolute top-2 right-2 size-8 cursor-pointer hover:scale-105 transition-all bg-[#FF0000] rounded-[6px] flex items-center justify-center opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="size-4 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Area - Show when no image or when drag over */}
      {showUploadArea && !image && (
        <div
          className={cn(
            "border-2 border-dashed border-purple bg-purple/5 dark:bg-purple/10 p-6 rounded-lg transition-all duration-200",
            dragOver && "border-purple bg-purple/20 scale-[1.01] shadow-md",
            !disabled &&
            "cursor-pointer hover:bg-purple/10 dark:hover:bg-purple/20 hover:border-purple/80",
            disabled && "cursor-not-allowed opacity-50",
            uploadAreaClassName
          )}
          onClick={!disabled ? openFileDialog : undefined}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple rounded-full flex-shrink-0">
              <Upload className="size-4 text-white" />
            </div>

            <div className="space-y-1.5 flex flex-col flex-1">
              <p className="text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                Drag & drop image or browse
              </p>
              <p className="text-left text-xs text-muted-foreground">
                Support {acceptedFileTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} max {maxFileSize}MB
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
                className="pz-2 bg-white dark:bg-gray-800 text-black dark:text-gray-100 border dark:border-gray-700 mr-auto hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


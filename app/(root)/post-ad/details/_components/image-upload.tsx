"use client";

import type React from "react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Plus, Upload, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/app/api/media";
import { toast } from "sonner";
import { AxiosError } from "axios";

export interface ImageItem {
  id: string;
  url: string;
  file?: File;
  name?: string;
  presignedUrl?: string; // Final URL after upload
  uploading?: boolean; // Upload state
  uploadError?: string; // Error message if upload fails
}

export interface ImageGalleryProps {
  images?: ImageItem[];
  onImagesChange?: (images: ImageItem[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  showUploadArea?: boolean;
  showDeleteAll?: boolean;
  className?: string;
  uploadAreaClassName?: string;
  disabled?: boolean;
  gridCols?: number;
}

export function ImageGallery({
  images = [],
  onImagesChange,
  maxImages = 10,
  maxFileSize = 100,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"],
  showUploadArea = true,
  showDeleteAll = true,
  className,
  uploadAreaClassName,
  disabled = false,
  gridCols = 0,
}: ImageGalleryProps) {
  const [dragOver, setDragOver] = useState(false);
  const [dragPreviewImages, setDragPreviewImages] = useState<ImageItem[]>([]);

  // Upload a single image
  const uploadImage = useCallback(
    async (imageItem: ImageItem, currentImages: ImageItem[]) => {
      if (!imageItem.file) return;

      // Mark as uploading
      const updatedImages = currentImages.map((img) =>
        img.id === imageItem.id
          ? { ...img, uploading: true, uploadError: undefined }
          : img
      );
      onImagesChange?.(updatedImages);

      try {
        const response = await uploadFile(imageItem.file);
        
        // Update with presigned URL and remove file
        const finalImages = updatedImages.map((img) =>
          img.id === imageItem.id
            ? {
                ...img,
                url: response.data.fileUrl,
                presignedUrl: response.data.fileUrl,
                uploading: false,
                file: undefined, // Remove file object
              }
            : img
        );
        onImagesChange?.(finalImages);
      } catch (error) {
        console.error("Upload error:", error);
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError?.response?.data?.message || "Failed to upload image";
        
        // Mark as error
        const errorImages = updatedImages.map((img) =>
          img.id === imageItem.id
            ? {
                ...img,
                uploading: false,
                uploadError: errorMessage,
              }
            : img
        );
        onImagesChange?.(errorImages);
        toast.error(`Failed to upload ${imageItem.name}: ${errorMessage}`);
      }
    },
    [onImagesChange]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const newImages: ImageItem[] = [];

      Array.from(files).forEach((file) => {
        // Check file type
        if (!acceptedFileTypes.includes(file.type)) {
          toast.error(`File type ${file.type} not accepted`);
          return;
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`File size exceeds ${maxFileSize}MB limit`);
          return;
        }

        // Check max images limit
        if (images.length + newImages.length >= maxImages) {
          toast.error(`Maximum ${maxImages} images allowed`);
          return;
        }

        const imageItem: ImageItem = {
          id: `${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
          file,
          name: file.name,
          uploading: false,
        };

        newImages.push(imageItem);
      });

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        onImagesChange?.(updatedImages);

        // Auto-upload new images
        newImages.forEach((imageItem) => {
          uploadImage(imageItem, updatedImages);
        });
      }
    },
    [
      images,
      onImagesChange,
      maxImages,
      maxFileSize,
      acceptedFileTypes,
      disabled,
      uploadImage,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      // Clear preview images
      dragPreviewImages.forEach((img) => {
        if (img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
      setDragPreviewImages([]);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect, dragPreviewImages]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);

      // Create previews of dragged files only if we don't have previews yet
      if (dragPreviewImages.length === 0 && e.dataTransfer.items) {
        const items = Array.from(e.dataTransfer.items);
        const imageItems = items.filter(
          (item) =>
            item.kind === "file" &&
            item.type.startsWith("image/") &&
            acceptedFileTypes.includes(item.type)
        );

        if (imageItems.length > 0) {
          const previews: ImageItem[] = [];
          imageItems.forEach((item, index) => {
            const file = item.getAsFile();
            if (file) {
              const previewItem: ImageItem = {
                id: `preview-${Date.now()}-${index}`,
                url: URL.createObjectURL(file),
                file,
                name: file.name,
              };
              previews.push(previewItem);
            }
          });
          setDragPreviewImages(previews);
        }
      }
    },
    [acceptedFileTypes, dragPreviewImages.length]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragOver to false if we're leaving the drop zone itself
    const target = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!target.contains(relatedTarget)) {
      setDragOver(false);
      // Clear preview images when leaving
      dragPreviewImages.forEach((img) => {
        if (img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
      setDragPreviewImages([]);
    }
  }, [dragPreviewImages]);

  const removeImage = useCallback(
    (id: string) => {
      if (disabled) return;
      const updatedImages = images.filter((img) => img.id !== id);
      onImagesChange?.(updatedImages);
    },
    [images, onImagesChange, disabled]
  );

  const removeAllImages = useCallback(() => {
    if (disabled) return;
    onImagesChange?.([]);
  }, [onImagesChange, disabled]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = acceptedFileTypes.join(",");
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileSelect(target.files);
    };
    input.click();
  }, [acceptedFileTypes, handleFileSelect, disabled]);

  const formatFileTypes = () => {
    return acceptedFileTypes.map((type) => type.split("/")[1]).join(", ");
  };

  return (
    <div
      className={cn(
        "w-full min-h-[176px] rounded-lg bg-white p-",
        dragOver && "border-purple bg-purple/10",
        disabled && "opacity-50 cursor-not-allowed",
        className,
        images.length > 0 && "border border-[#F5EBFF] border-dashed p-3 border-[#F5EBFF]"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Images Grid - Similar to MultipleImageInput */}
      <div
        className={cn(
          gridCols > 0
            ? "grid gap-2 items-start"
            : "flex flex-wrap gap-2 items-start"
        )}
        style={
          gridCols > 0
            ? {
                gridTemplateColumns: `repeat(${gridCols}, minmax(64px, 1fr))`,
              }
            : undefined
        }
      >
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "relative rounded-lg overflow-hidden group",
              gridCols > 0 ? "aspect-square w-full" : "w-16 h-16"
            )}
          >
            <Image
              src={image.url}
              alt={image.name || "Uploaded image"}
              fill
              className={cn(
                "object-cover rounded-lg",
                image.uploading && "opacity-50",
                image.uploadError && "opacity-30"
              )}
            />
            
            {/* Uploading overlay */}
            {image.uploading && (
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}

            {/* Error overlay */}
            {image.uploadError && (
              <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
            )}

            {/* Close button */}
            {!image.uploading && (
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                disabled={disabled}
                className="absolute top-1 right-1 size-5 cursor-pointer hover:scale-105 transition-all bg-[#FF0000] rounded-[6px] flex items-center justify-center opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="size-3 text-white" />
              </button>
            )}

            {/* Retry button for failed uploads */}
            {image.uploadError && image.file && (
              <button
                type="button"
                onClick={() => uploadImage(image, images)}
                disabled={disabled}
                className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retry upload"
              >
                <Upload className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}
        

        {/* Drag preview images */}
        {dragPreviewImages.map((previewImage) => (
          <div
            key={previewImage.id}
            className={cn(
              "relative rounded-lg overflow-hidden border-2 border-purple border-dashed opacity-60",
              gridCols > 0 ? "aspect-square w-full" : "w-16 h-16"
            )}
          >
            <Image
              src={previewImage.url}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}

      </div>

      <div className="flex items-center gap-2 mt-3">
        {/* Add button */}
        {images.length < maxImages && images.length > 0 && (
          <button
            type="button"
            onClick={openFileDialog}
            disabled={disabled}
            className={cn(
              "w-[34px] h-[34px] rounded-[25px] bg-[#8B31E1] flex items-center justify-center",
              "hover:bg-[#7A2BC8] transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20",
              disabled && "opacity-50 cursor-not-allowed",
              "cursor-pointer hover:scale-105 transition-all"
            )}
            aria-label="Add image"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Delete all button */}
        {showDeleteAll && images.length > 0 && (
          <button
            type="button"
            onClick={removeAllImages}
            disabled={disabled}
            className={cn(
              "ml-auto w-5 h-5 text-[#FF0000] hover:opacity-80 transition-opacity",
              "focus:outline-none focus:ring-2 focus:ring-[#FF0000]/20 rounded",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Delete all images"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Upload Area - Show when no images or when drag over */}
      {showUploadArea && !images.length && (
        <div
          className={cn(
            "mt-4 border-2 border-dashed border-purple bg-purple/5 p-6 rounded-lg transition-all duration-200",
            dragOver && "border-purple bg-purple/20 scale-[1.01] shadow-md",
            !disabled &&
              "cursor-pointer hover:bg-purple/10 hover:border-purple/80",
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
              <p className="text-left text-sm font-medium text-gray-900">
                Drag & drop file or browse your mobile or computer
              </p>
              <p className="text-left text-xs text-muted-foreground">
                You can add more than one
              </p>
              <p className="text-left text-xs text-muted-foreground">
                Support {formatFileTypes()} max {maxFileSize}MB
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
                className="pz-2 bg-white text-black border mr-auto hover:bg-gray-50"
              >
                Add Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


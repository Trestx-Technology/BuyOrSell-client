"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Plus, X, Trash2, Loader2, Upload } from "lucide-react";
import { uploadFile } from "@/app/api/media/media.services";
import { toast } from "sonner";
import { AxiosError } from "axios";

export interface ImageItem {
  id: string;
  url: string;
  file?: File;
  fileUrl?: string; // Final URL after upload
  uploading?: boolean; // Upload state
  uploadError?: string; // Error message if upload fails
}

interface MultipleImageInputProps {
  className?: string;
  value: ImageItem[];
  onChange: (value: ImageItem[]) => void;
  disabled?: boolean;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
}

export const MultipleImageInput = forwardRef<
  HTMLDivElement,
  MultipleImageInputProps
>(
  (
    {
      className,
      value = [],
      onChange,
      disabled = false,
      maxImages = 8,
      maxFileSize = 100,
      acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
    },
    ref,
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
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
            : img,
        );
        onChange(updatedImages);

        try {
          const response = await uploadFile(imageItem.file);

          // Update with fileUrl and remove file
          const finalImages = updatedImages.map((img) =>
            img.id === imageItem.id
              ? {
                  ...img,
                  url: response.data.fileUrl,
                  fileUrl: response.data.fileUrl,
                  uploading: false,
                  file: undefined, // Remove file object
                }
              : img,
          );
          onChange(finalImages);
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
              : img,
          );
          onChange(errorImages);
          toast.error(`Failed to upload image: ${errorMessage}`);
        }
      },
      [onChange],
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
          if (value.length + newImages.length >= maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
          }

          const imageItem: ImageItem = {
            id: `${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            file,
            uploading: false,
          };

          newImages.push(imageItem);
        });

        if (newImages.length > 0) {
          const updatedImages = [...value, ...newImages];
          onChange(updatedImages);

          // Auto-upload new images
          newImages.forEach((imageItem) => {
            uploadImage(imageItem, updatedImages);
          });
        }
      },
      [
        value,
        onChange,
        maxImages,
        maxFileSize,
        acceptedFileTypes,
        disabled,
        uploadImage,
      ],
    );

    const removeImage = useCallback(
      (id: string) => {
        if (disabled) return;
        const updatedImages = value.filter((img) => img.id !== id);
        onChange(updatedImages);
      },
      [value, onChange, disabled],
    );

    const handleAddClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    const handleDeleteAll = () => {
      if (disabled) return;
      onChange([]);
    };

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
      [handleFileSelect, dragPreviewImages],
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
              acceptedFileTypes.includes(item.type),
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
                };
                previews.push(previewItem);
              }
            });
            setDragPreviewImages(previews);
          }
        }
      },
      [acceptedFileTypes, dragPreviewImages.length],
    );

    const handleDragLeave = useCallback(
      (e: React.DragEvent) => {
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
      },
      [dragPreviewImages],
    );

    return (
      <div
        ref={ref}
        className={cn(
          "w-full min-h-[176px] border border-[#F5EBFF] dark:border-purple/30 border-dashed rounded-lg bg-white dark:bg-gray-900 p-3",
          disabled && "opacity-50 cursor-not-allowed",
          dragOver && "border-[#8B31E1] bg-[#F5EBFF]/20",
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {/* Images Grid */}
        <div className="flex flex-wrap gap-2 items-start">
          {value.map((image) => (
            <div
              key={image.id}
              className="relative w-16 h-16 rounded-lg overflow-hidden group"
            >
              <Image
                src={image.url}
                alt="Uploaded image"
                fill
                className={cn(
                  "object-cover rounded-lg",
                  image.uploading && "opacity-50",
                  image.uploadError && "opacity-30",
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
                  className="absolute top-1 right-1 size-5 cursor-pointer hover:scale-105 transition-all bg-[#FF0000] rounded-[6px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="size-3 text-white" />
                </button>
              )}

              {/* Retry button for failed uploads */}
              {image.uploadError && image.file && (
                <button
                  type="button"
                  onClick={() => uploadImage(image, value)}
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
              className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#8B31E1] border-dashed opacity-60"
            >
              <Image
                src={previewImage.url}
                alt="Drag preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}

          {/* Add button */}
          {value.length < maxImages && (
            <button
              type="button"
              onClick={handleAddClick}
              disabled={disabled}
              className={cn(
                "w-[34px] h-[34px] rounded-[25px] bg-[#8B31E1] flex items-center justify-center",
                "hover:bg-[#7A2BC8] transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20",
                disabled && "opacity-50 cursor-not-allowed",
                "cursor-pointer hover:scale-105 transition-all",
              )}
              aria-label="Add image"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Delete all button */}
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={disabled}
              className={cn(
                "ml-auto w-5 h-5 text-[#FF0000] hover:opacity-80 transition-opacity",
                "focus:outline-none focus:ring-2 focus:ring-[#FF0000]/20 rounded",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Delete all images"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

MultipleImageInput.displayName = "MultipleImageInput";

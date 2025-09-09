"use client";

import type React from "react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Plus, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageItem {
  id: string;
  url: string;
  file?: File;
  name?: string;
}

export interface ImageGalleryProps {
  images?: ImageItem[];
  onImagesChange?: (images: ImageItem[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  gridCols?: number;
  showUploadArea?: boolean;
  showDeleteAll?: boolean;
  className?: string;
  imageClassName?: string;
  uploadAreaClassName?: string;
  disabled?: boolean;
}

export function ImageGallery({
  images = [],
  onImagesChange,
  maxImages = 10,
  maxFileSize = 100,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"],
  gridCols = 4,
  showUploadArea = true,
  showDeleteAll = true,
  className,
  imageClassName,
  uploadAreaClassName,
  disabled = false,
}: ImageGalleryProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const newImages: ImageItem[] = [];

      Array.from(files).forEach((file) => {
        // Check file type
        if (!acceptedFileTypes.includes(file.type)) {
          console.warn(`File type ${file.type} not accepted`);
          return;
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          console.warn(`File size exceeds ${maxFileSize}MB limit`);
          return;
        }

        // Check max images limit
        if (images.length + newImages.length >= maxImages) {
          console.warn(`Maximum ${maxImages} images allowed`);
          return;
        }

        const imageItem: ImageItem = {
          id: `${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
          file,
          name: file.name,
        };

        newImages.push(imageItem);
      });

      if (newImages.length > 0) {
        onImagesChange?.([...images, ...newImages]);
      }
    },
    [
      images,
      onImagesChange,
      maxImages,
      maxFileSize,
      acceptedFileTypes,
      disabled,
    ]
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
    <div className={cn("space-y-4", className)}>
      {/* Header with delete all button */}
      {showDeleteAll && images.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={removeAllImages}
            disabled={disabled}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-4",
            gridCols === 1 && "grid-cols-1",
            gridCols === 2 && "grid-cols-2",
            gridCols === 3 && "grid-cols-3",
            gridCols === 4 && "grid-cols-4",
            gridCols === 5 && "grid-cols-5",
            gridCols === 6 && "grid-cols-6"
          )}
        >
          {images.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              onRemove={removeImage}
              className={imageClassName}
              disabled={disabled}
            />
          ))}

          {/* Add more button */}
          {images.length < maxImages && (
            <Card
              className={cn(
                "aspect-square flex items-center justify-center cursor-pointer border-2 border-dashed hover:border-primary transition-colors",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={openFileDialog}
            >
              <Plus className="h-8 w-8 text-muted-foreground" />
            </Card>
          )}
        </div>
      )}

      {/* Upload Area */}
      {showUploadArea && images.length < maxImages && (
        <Card
          className={cn(
            "border-2 border-dashed border-purple bg-purple/5 p-8 text-center transition-colors",
            dragOver && "border-primary bg-primary/5",
            disabled && "cursor-not-allowed opacity-50",
            uploadAreaClassName
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex items-start gap-6">
            <div className="p-2 bg-purple rounded-full">
              <Upload className="size-5 text-white" />
            </div>

            <div className="space-y-2 flex flex-col ">
              <p className="text-left text-sm font-medium">
                Drag & drop file or browse your mobile or computer
              </p>
              <p className="text-left text-xs text-muted-foreground">
                you can add more than one
              </p>
              <p className="text-left text-xs text-muted-foreground">
                Support {formatFileTypes()} max {maxFileSize}MB
              </p>
              <Button
                onClick={openFileDialog}
                // disabled={disabled}
                disabled
                className=" pz-2 bg-white text-black border mr-auto"
              >
                Add Image
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

interface ImageItemProps {
  image: ImageItem;
  onRemove: (id: string) => void;
  className?: string;
  disabled?: boolean;
}

function ImageItem({ image, onRemove, className, disabled }: ImageItemProps) {
  const isVideo =
    image.file?.type.startsWith("video/") || image.url.includes(".mp4");

  return (
    <Card
      className={cn("relative aspect-square overflow-hidden group", className)}
    >
      {isVideo ? (
        <video
          src={image.url}
          className="w-full h-full object-cover"
          controls={false}
          muted
        />
      ) : (
        <Image
          src={image.url || "/placeholder.svg"}
          alt={image.name || "Uploaded image"}
          fill
          className="object-cover"
        />
      )}

      {/* Delete button */}
      <Button
        size="sm"
        variant="danger"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(image.id)}
        disabled={disabled}
      >
        <X className="h-3 w-3" />
      </Button>
    </Card>
  );
}

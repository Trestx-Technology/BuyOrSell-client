"use client";

import { useCallback } from "react";
import Image from "next/image";
import { X, Plus, Loader2 } from "lucide-react";
import {
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useLocale } from "@/hooks/useLocale";
import { uploadFile } from "@/app/api/media/media.services";
import { toast } from "sonner";

export interface AIImageItem {
      id: string;
      url: string;
      uploading?: boolean;
}

interface ImageGridProps {
      images: AIImageItem[];
      setImages: (images: AIImageItem[] | ((prev: AIImageItem[]) => AIImageItem[])) => void;
      onRemove: (index: number) => void;
}

export function ImageGrid({ images, setImages, onRemove }: ImageGridProps) {
      const { t } = useLocale();

      const handleUpload = useCallback(async (file: File) => {
            const id = Math.random().toString(36).substring(7);
            const previewUrl = URL.createObjectURL(file);

            const newItem: AIImageItem = {
                  id,
                  url: previewUrl,
                  uploading: true,
            };

            setImages((prev) => [...prev, newItem]);

            try {
                  const response = await uploadFile(file);
                  const uploadedUrl = response.data.fileUrl;

                  setImages((prev) =>
                        prev.map((img) =>
                              img.id === id ? { ...img, url: uploadedUrl, uploading: false } : img
                        )
                  );
            } catch (error) {
                  console.error("Upload failed:", error);
                  toast.error("Failed to upload image. Please try again.");
                  setImages((prev) => prev.filter((img) => img.id !== id));
            }
      }, [setImages]);

      const handleAddImage = () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                        handleUpload(file);
                  }
            };
            input.click();
      };

      return (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {/* Existing Images */}
                  {images.map((image, index) => (
                        <HoverCard key={image.id} openDelay={50} closeDelay={25}>
                              <HoverCardTrigger asChild>
                                    <div className="relative group cursor-pointer flex-shrink-0">
                                          <div className="w-[54px] h-[54px] rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                                                <Image
                                                      src={image.url}
                                                      alt={`Uploaded image ${index + 1}`}
                                                      width={54}
                                                      height={54}
                                                      className={`w-full h-full object-cover transition-opacity ${image.uploading ? 'opacity-40' : 'opacity-100'}`}
                                                />
                                          </div>

                                          {image.uploading ? (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                      <Loader2 className="w-4 h-4 text-purple animate-spin" />
                                                </div>
                                          ) : (
                                                <button
                                                      onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemove(index);
                                                      }}
                                                      className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 shadow-sm"
                                                >
                                                      <X className="w-2.5 h-2.5 text-white" />
                                                </button>
                                          )}
                                    </div>
                              </HoverCardTrigger>
                              {!image.uploading && (
                                    <HoverCardContent className="w-72 p-0 border-none shadow-2xl" side="top">
                                          <div className="relative aspect-video">
                                                <Image
                                                      src={image.url}
                                                      alt={`Preview ${index + 1}`}
                                                      fill
                                                      className="w-full h-full object-cover rounded-lg"
                                                />
                                          </div>
                                    </HoverCardContent>
                              )}
                        </HoverCard>
                  ))}

                  {/* Add Image Button */}
                  <button
                        onClick={handleAddImage}
                        className="w-[54px] h-[54px] border-2 border-[#37E7B6] border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-[#37E7B6]/10 transition-colors cursor-pointer flex-shrink-0 group"
                  >
                        <Plus className="w-4 h-4 text-[#37E7B6] group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-[#37E7B6] font-medium mt-0.5">
                              {t.aiAdPost.addImage}
                        </span>
                  </button>
            </div>
      );
}

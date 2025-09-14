"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  ImageIcon,
  ImagePlusIcon,
} from "lucide-react";

interface ProductGalleryProps {
  adId: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ adId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - replace with actual API call
  const images = [
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1615141850218-9163d187fbda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="overflow-hidden sticky lg:relative z-10  top-0 left-0 w-full">
      {/* Main Image */}
      <div className="relative aspect-[16/9]">
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={`Product image ${currentImageIndex + 1}`}
              fill
              className="object-cover md:rounded-xl"
              unoptimized
            />

            {/* Premium Badge */}
            <div className="lg:block hidden absolute bottom-3 left-3">
              <Image
                src={"/premium.svg"}
                alt="Premium"
                width={31}
                height={31}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-8 lg:bottom-4 right-4">
              <button className="bg-white px-2 py-1 rounded-sm text-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-all">
                <ImagePlusIcon className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  {images.length} Photos
                </span>
              </button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handlePrevious}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="center"
                  className="size-8 rounded-full absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                />
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handleNext}
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="center"
                  className="size-8 rounded-full absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                />
              </>
            )}

            {/* Image Dots */}
            {images.length > 1 && (
              <div className="hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No images available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;

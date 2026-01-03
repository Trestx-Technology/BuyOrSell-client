"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Plus,
  ImageIcon,
  Edit,
  Trash2,
  Eye,
  ImageUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "nextjs-toploader/app";

export interface CollectionCardProps {
  id: string;
  name: string;
  count: number;
  images: string[];
  isCreateNew?: boolean;
  onMoreOptions?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  onCreateNew?: () => void;
  className?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  name,
  count,
  images,
  isCreateNew = false,
  onMoreOptions,
  onClick,
  onCreateNew,
  onEdit,
  onDelete,
  className,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();
  const handleCardClick = () => {
    if (isCreateNew) {
      onCreateNew?.();
    } else {
      onClick?.(id);
    }
  };

  const handleMoreOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreOptions?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    onDelete?.(id);
  };

  if (isCreateNew) {
    return (
      <div
        onClick={handleCardClick}
        className={`flex-shrink-0 w-full lg:max-w-64 hover:bg-purple/10 rounded-xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center sm:h-64 cursor-pointer hover:border-purple-400 transition-colors group ${className}`}
      >
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          <Plus className="h-5 w-5 text-white" />
        </div>
        <Typography
          variant="body-small"
          className="text-purple-600 font-medium"
        >
          Create new list
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={`flex-shrink-0 w-full lg:max-w-64 sm:p-4 sm:bg-white rounded-xl sm:border border-gray-200 sm:shadow-sm sm:hover:shadow-md transition-all duration-300 cursor-pointer group ${className}`}
    >
      {/* Image Grid Section */}
      <div className="relative h-48 rounded-t-xl rounded-b-xl overflow-hidden bg-gray-100">
        {/* Collection thumbnail grid - 2x2 layout */}
        <div className="flex gap-1 h-full">
          {/* Main image - takes left half */}
          <div className="relative bg-gray-200 flex items-center justify-center w-full">
            {images?.[0] ? (
              <Image
                src={images[0]}
                alt={`${name} - Main`}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <ImageUpIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Right side - split into two */}
          {images?.length > 1 && (
            <div className="grid grid-rows-2 gap-1 w-full">
              {/* Top right */}
              <div className="relative bg-gray-300 flex items-center justify-center">
                {images?.[1] ? (
                  <Image
                    src={images[1]}
                    alt={`${name} - Secondary`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Bottom right */}
              <div className="relative bg-gray-400 flex items-center justify-center">
                {count > 2 ? (
                  <div className="w-full h-full bg-black/60 flex items-center justify-center">
                    <Typography
                      variant="body-small"
                      className="text-white font-semibold"
                    >
                      +{count - 2}
                    </Typography>
                  </div>
                ) : images?.[2] ? (
                  <Image
                    src={images[2]}
                    alt={`${name} - Third`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Collection count overlay */}
        <div className="absolute bottom-2 left-2 bg-white rounded px-2 py-1">
          <Typography variant="xs-medium" className="text-black font-medium">
            {count} items
          </Typography>
        </div>
      </div>

      {/* Collection Info Section */}
      <div className="pt-2 sm:pt-4 flex justify-between">
        <Typography
          variant="sm-bold"
          className="font-medium text-gray-900 line-clamp-1"
        >
          {name}
        </Typography>

        {/* More options button with popover */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-40 p-1"
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              )}

              <button
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={handleCardClick}
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CollectionCard;

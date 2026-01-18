import React from "react";
import { Share2, Heart } from "lucide-react";
import { CollectionManager } from "@/components/global/collection-manager";
import { cn } from "@/lib/utils";

interface HotDealsActionsProps {
  id: string;
  title: string;
  image?: string;
  isSaved: boolean;
  handleShare: (e: React.MouseEvent) => void;
  onToggleSave: (isAdded: boolean) => void;
}

export const HotDealsActions: React.FC<HotDealsActionsProps> = ({
  id,
  title,
  image,
  isSaved,
  handleShare,
  onToggleSave,
}) => {
  return (
    <div className="hidden absolute top-3 right-3 sm:flex gap-0 z-20">
      <button
        className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full flex items-center justify-center"
        onClick={handleShare}
      >
        <Share2
          size={22}
          className="fill-white stroke-slate-400"
          strokeWidth={1}
        />
      </button>

      <CollectionManager
        itemId={id}
        itemTitle={title}
        itemImage={image || ""}
        onSuccess={onToggleSave}
      >
        <button
          className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart
            size={24}
            className={cn(
              "fill-white stroke-slate-400",
              isSaved && "fill-purple"
            )}
            strokeWidth={1}
          />
        </button>
      </CollectionManager>
    </div>
  );
};

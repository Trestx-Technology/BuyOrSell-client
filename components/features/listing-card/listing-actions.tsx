import React from "react";
import { Share2, Heart } from "lucide-react";
import { CollectionManager } from "@/components/global/collection-manager";
import { cn } from "@/lib/utils";

interface ListingActionsProps {
  id: string;
  title: string;
  image?: string;
  isExchange?: boolean;
  handleShare: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export const ListingActions: React.FC<ListingActionsProps> = ({
  id,
  title,
  image,
  isExchange,
  handleShare,
  isSaved,
}) => {
  return (
    <div className="hidden absolute top-3 right-3 sm:flex gap-2">
      {!isExchange && (
        <button
          className="h-8 w-8 opacity-100 hover:scale-125 transition-transform cursor-pointer rounded-full"
          onClick={handleShare}
          aria-label="Share listing"
        >
          <Share2
            size={22}
            className="mx-auto fill-white stroke-slate-400"
            strokeWidth={1}
          />
        </button>
      )}

      <CollectionManager
        itemId={id}
        itemTitle={title}
        itemImage={image || ""}
        initialIsSaved={isSaved}
      >
        {({ isSaved }) => (
          <button
            className="h-8 w-8 opacity-100 hover:scale-125 transition-transform cursor-pointer rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label={isSaved ? "Remove from collection" : "Add to collection"}
          >
            <Heart
              size={24}
              className={cn(
                "mx-auto fill-white stroke-slate-400",
                isSaved && "fill-purple"
              )}
              strokeWidth={1}
            />
          </button>
        )}
      </CollectionManager>
    </div>
  );
};

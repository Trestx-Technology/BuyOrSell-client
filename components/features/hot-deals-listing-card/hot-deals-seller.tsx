import React from "react";
import Image from "next/image";
import { CircleUser } from "lucide-react";
import { Typography } from "@/components/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HotDealsSellerProps {
  seller?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    type?: "Agent" | "Individual";
    isVerified?: boolean;
    image?: string | null;
  };
  showSeller: boolean;
}

export const HotDealsSeller: React.FC<HotDealsSellerProps> = ({
  seller,
  showSeller,
}) => {
  return (
    <div className="text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 flex items-start justify-between">
      {showSeller && seller && (
        <div className="flex items-center gap-2 cursor-pointer">
          {seller.image ? (
            <div className="relative border w-[22px] h-[22px] rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={seller.image}
                alt={seller.name || "Seller"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <CircleUser size={20} className="text-purple" />
          )}
          <div>
            <Typography
              variant="sm-black-inter"
              className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate"
            >
              {seller.name ||
                `${seller.firstName || ""} ${seller.lastName || ""
                  }`.trim() ||
                "Seller"}
              {seller.isVerified && (
                <Image
                  src={"/verified-seller.svg"}
                  alt="Verified"
                  width={16}
                  height={16}
                />
              )}
            </Typography>
            {seller.type && (
              <Typography
                variant="body-small"
                className="text-[10px] text-grey-blue"
              >
                By {seller.type}
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

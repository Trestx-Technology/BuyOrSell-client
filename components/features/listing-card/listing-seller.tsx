import React from "react";
import Image from "next/image";
import { CircleUser, Phone, MessageSquareText } from "lucide-react";
import { Typography } from "@/components/typography";
import { FaWhatsapp } from "react-icons/fa";

import { SafeImage } from "@/components/ui/safe-image";

interface ListingSellerProps {
  seller?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    type?: "Agent" | "Individual";
    isVerified?: boolean;
    image?: string | null;
  };
  sellerDisplayName: string;
  postedTime: string;
  showSocials?: boolean;
}

export const ListingSeller: React.FC<ListingSellerProps> = ({
  seller,
  sellerDisplayName,
  postedTime,
  showSocials,
}) => {
  return (
    <div className="text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 flex items-start justify-between mt-auto">
      {seller ? (
        <div className="flex items-center gap-2 cursor-pointer z-20 relative">
          {seller.image ? (
            <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden flex-shrink-0">
              <SafeImage
                src={seller.image}
                alt={sellerDisplayName}
                fill
                className="object-cover"
                iconClassName="w-4 h-4"
              />
            </div>
          ) : (
            <CircleUser size={22} className="text-purple flex-shrink-0" />
          )}
          <div className="min-w-0">
            <Typography
              variant="sm-black-inter"
              className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate"
            >
              {sellerDisplayName}
              {seller.isVerified && (
                <Image
                  src="/verified-seller.svg"
                  alt="Verified"
                  width={16}
                  height={16}
                />
              )}
            </Typography>
            {seller.type && (
              <Typography variant="body-small" className="text-xs text-grey-blue">
                By {seller.type}
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <span>{postedTime}</span>
      )}

      {showSocials && (
        <div className="flex items-center gap-2 sm:hidden z-20 relative">
          <Phone
            size={18}
            stroke="0"
            className="fill-purple hover:scale-110 transition-transform duration-300"
          />
          <MessageSquareText
            size={18}
            className="text-purple hover:scale-110 transition-transform duration-300"
          />
          <FaWhatsapp
            size={18}
            className="text-purple hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
    </div>
  );
};

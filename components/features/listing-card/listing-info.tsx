import React from "react";
import { H6, Typography } from "@/components/typography";
import { MapPin } from "lucide-react";
import { PriceDisplay } from "@/components/global/price-display";
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";

interface ListingInfoProps {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  location: string;
  specifications: Specification[];
}

export const ListingInfo: React.FC<ListingInfoProps> = ({
  title,
  price,
  originalPrice,
  discount,
  location,
  specifications,
}) => {
  return (
    <div className="py-2 space-y-3 flex-1 flex flex-col">
      {/* Price Section */}
      <div className="flex items-center gap-1 px-2.5">
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          discountPercentage={discount}
          currencyIconWidth={16}
          currencyIconHeight={16}
          className="gap-1"
          currentPriceClassName="text-sm font-bold text-purple"
          originalPriceClassName="text-xs text-grey-blue line-through text-sm"
          discountBadgeClassName="text-xs text-teal text-sm font-semibold"
        />
      </div>

      {/* Title */}
      <H6 className="font-semibold text-dark-blue leading-normal px-2.5 line-clamp-2">
        {title}
      </H6>

      {/* Location */}
      <div className="flex px-1 gap-1 items-center">
        <MapPin
          size={22}
          stroke="white"
          className="w-fit min-w-6 fill-dark-blue text-dark-blue flex-shrink-0"
        />
        <Typography
          variant="body-small"
          className="text-xs text-[#667085] truncate"
        >
          {location}
        </Typography>
      </div>

      {/* Dynamic Specs */}
      <div className="px-2.5">
        {specifications.length > 0 && (
          <SpecificationsDisplay
            specifications={specifications}
            maxVisible={4}
            showPopover={false}
            className="flex flex-wrap gap-2 truncate"
          />
        )}
      </div>
    </div>
  );
};

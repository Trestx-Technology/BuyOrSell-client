import React from "react";
import { Typography } from "@/components/typography";
import { MapPin } from "lucide-react";
import { PriceDisplay } from "@/components/global/price-display";
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";

interface HotDealsInfoProps {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  location: string;
  specifications: Specification[];
}

export const HotDealsInfo: React.FC<HotDealsInfoProps> = ({
  title,
  price,
  originalPrice,
  discount,
  location,
  specifications,
}) => {
  return (
    <div className="pt-2 space-y-3">
      {/* Price Section */}
      <div className="px-2.5">
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          discountPercentage={discount}
          currencyIconWidth={16}
          currencyIconHeight={16}
          className="gap-1"
          currentPriceClassName="text-sm font-bold text-purple"
          originalPriceClassName="text-xs text-grey-blue line-through text-id"
          discountBadgeClassName="text-xs text-teal text-sm font-semibold"
        />
      </div>

      {/* Title */}
      <Typography
        variant="h3"
        className="text-sm font-semibold text-dark-blue leading-tight px-2.5 line-clamp-1"
      >
        {title}
      </Typography>

      {/* Location */}
      <div className="flex px-1 gap-1 items-center">
        <MapPin
          size={22}
          stroke="white"
          className="w-fit min-w-6 fill-dark-blue text-dark-blue"
        />
        <Typography
          variant="body-small"
          className="text-xs text-[#667085] truncate"
        >
          {location}
        </Typography>
      </div>

      {/* Dynamic Specs */}
      {specifications.length > 0 && (
        <div className="px-2.5">
          <SpecificationsDisplay
            specifications={specifications}
            maxVisible={4}
            showPopover={false}
            truncate
            className="grid grid-cols-2 gap-2"
            itemClassName="text-[#667085]"
          />
        </div>
      )}
    </div>
  );
};

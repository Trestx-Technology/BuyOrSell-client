import React, { useMemo } from "react";
import { H3, H6, Typography } from "@/components/typography";
import { MapPin } from "lucide-react";
import { PriceDisplay } from "@/components/global/price-display";
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";
import { AdLocation } from "@/interfaces/ad";
import { useLocale } from "@/hooks/useLocale";
import { getLocationDisplay } from "@/utils/get-location-display";

interface HotDealsInfoProps {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  location: AdLocation;
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
  const { locale } = useLocale();

  const displayLocation = useMemo(
    () => getLocationDisplay(location, locale),
    [location, locale]
  );

  return (
    <div className="py-2 space-y-1 flex-1 flex flex-col">
      {/* Price Section */}
      <div className="px-2.5">
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          discountPercentage={discount}
          currencyIconWidth={16}
          currencyIconHeight={16}
          className="gap-1"
          currentPriceClassName="text-sm font-bold text-purple dark:text-purple-400"
          originalPriceClassName="text-xs text-grey-blue dark:text-gray-500 line-through text-id"
          discountBadgeClassName="text-xs text-teal dark:text-teal-400 text-sm font-semibold"
        />
      </div>

      {/* Title */}
      <H6 className="font-semibold text-dark-blue dark:text-gray-100 leading-normal px-2.5 line-clamp-2">
        {title}
      </H6>


      {/* Location */}
      <div className="flex px-1 gap-1 items-center">
        <MapPin
          size={22}
          stroke="white"
          className="w-fit min-w-6 fill-dark-blue text-dark-blue dark:fill-gray-700 dark:text-gray-700"
        />
        <Typography
          variant="body-small"
          className="text-xs text-[#667085] dark:text-gray-400 truncate"
        >
          {displayLocation}
        </Typography>
      </div>

      {/* Dynamic Specs */}
      <div className="px-2.5">
        {specifications.length > 0 && (
          <SpecificationsDisplay
            specifications={specifications}
            maxVisible={4}
            showPopover={false}
            className="flex flex-wrap gap-1 truncate"
          />
        )}
      </div>
    </div>
  );
};

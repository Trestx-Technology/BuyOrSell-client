import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ProductExtraFields } from "@/interfaces/ad";
import { useShare } from "@/hooks/useShare";
import { Specification } from "@/components/global/specifications-display";
import { getSpecifications } from "@/utils/normalize-extra-fields";

// Feature Components
import { HotDealsImageGallery } from "@/components/features/hot-deals-listing-card/hot-deals-image-gallery";
import { HotDealsInfo } from "@/components/features/hot-deals-listing-card/hot-deals-info";
import { HotDealsSeller } from "@/components/features/hot-deals-listing-card/hot-deals-seller";

export interface HotDealsListingCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: string;
  images: string[];
  extraFields: ProductExtraFields;
  isExchange?: boolean;
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  isAddedInCollection?: boolean;
  isSaved?: boolean;
  onClick?: (id: string) => void;
  className?: string;
  showSeller?: boolean;
  showSocials?: boolean;
  seller?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    type?: "Agent" | "Individual";
    isVerified?: boolean;
    image?: string | null;
  };
  // Hot deals specific props
  discountText?: string;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  showDiscountBadge?: boolean;
  showTimer?: boolean;
  timerBg?: string;
  timerTextColor?: string;
  dealValidThrough?: string | null; // ISO date string from ad data
}

const HotDealsListingCard: React.FC<HotDealsListingCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  location,
  images,
  extraFields,
  views,
  isPremium = false,
  isAddedInCollection,
  onClick,
  className,
  showSeller = false,
  seller,
  discountText,
  discountBadgeBg = "bg-[#FE9800]",
  discountBadgeTextColor = "text-white",
  showDiscountBadge = true,
  showTimer = true,
  timerBg = "bg-[#FF4D00]",
  timerTextColor = "text-white",
  dealValidThrough,
}) => {
  const { share } = useShare();
  // Use isAddedInCollection flag directly from ad data instead of making per-card API calls
  const [isSaved, setIsSaved] = useState(isAddedInCollection ?? false);

  useEffect(() => {
    setIsSaved(isAddedInCollection ?? false);
  }, [isAddedInCollection]);

  // Dynamically extract specifications from extraFields
  const specifications = useMemo((): Specification[] => {
    const specsFromFields = getSpecifications(extraFields, 4);
    return specsFromFields.map((spec) => ({
      name: spec.name,
      value: spec.value,
      icon: spec.icon,
    }));
  }, [extraFields]);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await share(id, title);
    },
    [id, title, share]
  );

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={`w-[220px] h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${className}`}
      onClick={handleCardClick}
    >
      <Link href={`/ad/${id}`} className="absolute inset-0 z-10"></Link>
      <div className="p-0 flex flex-col flex-1 h-full">
        {/* Image Section */}
        <HotDealsImageGallery
          id={id}
          title={title}
          images={images}
          isPremium={isPremium}
          views={views}
          discount={discount}
          handleShare={handleShare}
          onToggleSave={(isAdded) => setIsSaved(isAdded)}
          isSaved={isSaved}
          discountText={discountText}
          discountBadgeBg={discountBadgeBg}
          discountBadgeTextColor={discountBadgeTextColor}
          showDiscountBadge={showDiscountBadge}
          showTimer={showTimer}
          timerBg={timerBg}
          timerTextColor={timerTextColor}
          dealValidThrough={dealValidThrough}
        />

        {/* Content Section */}
          <HotDealsInfo
            title={title}
            price={price}
            originalPrice={originalPrice}
            discount={discount}
            location={location}
            specifications={specifications}
          />

        <HotDealsSeller seller={seller} showSeller={showSeller} />
      </div>
    </div>
  );
};

export default HotDealsListingCard;

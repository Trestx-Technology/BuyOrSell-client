import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ProductExtraFields } from "@/interfaces/ad";
import { useShare } from "@/hooks/useShare";
import { useGetCollectionsByAd } from "@/hooks/useCollections";
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
  currency = "AED",
  location,
  images,
  extraFields,
  isExchange = false,
  views,
  isPremium = false,
  isAddedInCollection,
  onClick,
  className,
  showSeller = false,
  seller,
  discountText,
  discountBadgeBg = "bg-white",
  discountBadgeTextColor = "text-black",
  showDiscountBadge = true,
  showTimer = true,
  timerBg = "bg-[#4A4A4A]",
  timerTextColor = "text-white",
  dealValidThrough,
}) => {
  const { share } = useShare();
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(
    isAddedInCollection === undefined ? id : ""
  );
  const apiIsAddedInCollection =
    collectionsByAdResponse?.data?.isAddedInCollection ?? false;
  const [isSaved, setIsSaved] = useState(
    isAddedInCollection ?? apiIsAddedInCollection
  );
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsSaved(isAddedInCollection ?? apiIsAddedInCollection);
  }, [isAddedInCollection, apiIsAddedInCollection]);

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
      className={`w-[220px] overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Link href={`/ad/${id}`} className="absolute inset-0 "></Link>
      <div className="p-0">
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
        <div className="pt-2 space-y-3">
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
    </div>
  );
};

export default HotDealsListingCard;

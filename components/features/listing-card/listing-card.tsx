import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductExtraFields } from "@/interfaces/ad";
import { useShare } from "@/hooks/useShare";
import { Specification } from "@/components/global/specifications-display";
import { getSpecifications } from "@/utils/normalize-extra-fields";

// Feature Components
import { ListingImageGallery } from "@/components/features/listing-card/listing-image-gallery";
import { ListingInfo } from "@/components/features/listing-card/listing-info";
import { ListingSeller } from "@/components/features/listing-card/listing-seller";

export interface ListingCardProps {
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
  className?: string;
  showSocials?: boolean;
  seller?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    type?: "Agent" | "Individual";
    isVerified?: boolean;
    image?: string | null;
    phoneNumber?: string;
    canCall?: boolean;
    canWhatsapp?: boolean;
  };
  isSaved?: boolean;
  isAddedInCollection?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  location,
  images,
  extraFields,
  isExchange = false,
  postedTime,
  views,
  isPremium = false,
  className,
  showSocials,
  seller,
  isSaved,
  isAddedInCollection,
}) => {
  const { share } = useShare();

  // Dynamically extract specifications from extraFields - memoized to prevent recalculation
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
      e.preventDefault();
      e.stopPropagation();
      await share(id, title);
    },
    [id, title, share]
  );

  // Memoize seller display name
  const sellerDisplayName = useMemo(() => {
    return (
      seller?.name ||
      `${seller?.firstName || ""} ${seller?.lastName || ""}`.trim() ||
      "Seller"
    );
  }, [seller]);

  return (
    <div
      className={cn(
        "w-[220px] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative flex flex-col",
        className
      )}
    >
      <Link href={`/ad/${id}`} className="absolute inset-0 z-10" />
      <div className="p-0 flex flex-col flex-1">
        {/* Image Section (Carousel, Badges, Actions) */}
        <ListingImageGallery
          id={id}
          title={title}
          images={images}
          isPremium={isPremium}
          isExchange={isExchange}
          views={views}
          handleShare={handleShare}
          isSaved={isSaved}
        />

        {/* Content Section */}
        <ListingInfo
          title={title}
          price={price}
          originalPrice={originalPrice}
          discount={discount}
          location={location}
          specifications={specifications}
        />


        {/* Footer/Seller Section */}
        <ListingSeller
          seller={seller}
          sellerDisplayName={sellerDisplayName}
          postedTime={postedTime}
          showSocials={showSocials}
        />
      </div>
    </div>
  );
};

export default ListingCard;
export { ListingCard };

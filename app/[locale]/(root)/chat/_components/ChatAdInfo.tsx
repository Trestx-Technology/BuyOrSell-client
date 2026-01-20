import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import type { AdDetails } from "./ChatSidebar";
import { useAdById } from "@/hooks/useAds";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatAdInfoProps {
  ad: AdDetails;
}

export function ChatAdInfo({ ad }: ChatAdInfoProps) {
  const { data: adData, isLoading } = useAdById(ad.adId);
  const fetchedAd = adData?.data; // Assuming response structure has data property

  // Format price helper
  const formatPrice = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "";
    return new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="sticky top-0 border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  const title = fetchedAd?.title || ad.adTitle;
  const image = fetchedAd?.images?.[0] || ad.adImage;
  const price = fetchedAd?.price !== undefined ? fetchedAd.price : ad.adPrice;

  return (
    <Link
      href={`/ad/${ad.adId}`}
      className="sticky top-0 border-b border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-4">
        {image && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={image}
              alt={title || "Ad image"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <Typography
              variant="body-small"
              className="font-semibold text-gray-900 mb-1 line-clamp-1"
            >
              {title}
            </Typography>
          )}
          {price !== undefined && (
            <div className="flex items-center gap-1">
              <Image
                src={ICONS.currency.aed}
                alt="AED"
                width={16}
                height={16}
              />
              <span className="text-sm font-bold text-purple-600">
                {formatPrice(price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

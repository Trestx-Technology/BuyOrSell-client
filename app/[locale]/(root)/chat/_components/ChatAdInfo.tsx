import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import type { AdDetails } from "./ChatSidebar";

interface ChatAdInfoProps {
  ad: AdDetails;
}

export function ChatAdInfo({ ad }: ChatAdInfoProps) {
  // Format price helper
  const formatPrice = (amount: number | undefined) => {
    if (!amount) return "";
    return new Intl.NumberFormat("ae-ar", {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link
      href={`/ad/${ad.adId}`}
      className="sticky top-0 border-b border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-4">
        {ad.adImage && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={ad.adImage}
              alt={ad.adTitle || "Ad image"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {ad.adTitle && (
            <Typography
              variant="body-small"
              className="font-semibold text-gray-900 mb-1 line-clamp-1"
            >
              {ad.adTitle}
            </Typography>
          )}
          {ad.adPrice !== undefined && (
            <div className="flex items-center gap-1">
              <Image
                src={ICONS.currency.aed}
                alt="AED"
                width={16}
                height={16}
              />
              <span className="text-sm font-bold text-purple-600">
                {formatPrice(ad.adPrice)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

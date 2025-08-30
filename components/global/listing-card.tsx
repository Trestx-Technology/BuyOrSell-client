import Image, { StaticImageData } from "next/image";
import {
  Heart,
  MapPin,
  Zap,
  Fuel,
  Gauge,
  Calendar,
  Clock,
  Bed,
  Bath,
  Square,
  Smartphone,
  Sofa,
  Building,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";

export interface ListingCardProps {
  id: string | number;
  image: string | StaticImageData | React.ReactNode;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  // Flexible specs - can be any combination
  specs?: {
    [key: string]: string;
  };
  // Category for determining which icons to show
  category?:
    | "car"
    | "property"
    | "electronics"
    | "furniture"
    | "appliances"
    | "fashion"
    | "jobs"
    | "business"
    | "other";
  year?: string;
  timeAgo: Date;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
  className?: string;
  href?: string;
  // Discount badge props
  showDiscountBadge?: boolean;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  discountText?: string;
  // Timer props
  showTimer?: boolean;
  timerBg?: string;
  timerTextColor?: string;
  endTime?: Date;
}

// Helper function to get icon for spec key
export function getSpecIcon(key: string) {
  const iconMap: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    // Car specs
    transmission: Zap,
    fuelType: Fuel,
    mileage: Gauge,

    // Property specs
    bedrooms: Bed,
    bathrooms: Bath,
    area: Square,

    // Electronics specs
    brand: Smartphone,
    model: Smartphone,
    condition: Smartphone,

    // Furniture specs
    material: Sofa,
    style: Sofa,
    dimensions: Square,

    // General specs
    year: Calendar,
  };

  return iconMap[key] || Building;
}

// Helper function to format spec value
export function formatSpecValue(key: string, value: string) {
  if (key === "area" && value.includes("sq ft")) {
    return value;
  }
  if (key === "mileage" && value.includes("KM")) {
    return value;
  }
  if (key === "year") {
    return value;
  }
  return value;
}

// Timer component for countdown
function CountdownTimer({
  endTime,
  bgColor = "bg-red-500",
  textColor = "text-white",
}: {
  endTime: Date;
  bgColor?: string;
  textColor?: string;
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Badge
      className={cn(
        `absolute bottom-0 truncate right-0 px-2 py-1 rounded-none rounded-tl-md text-xs font-medium flex items-center gap-1`,
        bgColor,
        textColor
      )}
    >
      <Clock className="w-3 h-3" />
      <span>
        {timeLeft.hours.toString().padStart(2, "0")}:
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </span>
    </Badge>
  );
}

export function ListingCard({
  id,
  image,
  title,
  location,
  currentPrice,
  originalPrice,
  discount,
  specs = {},
  timeAgo,
  isFavorite = false,
  onFavoriteToggle,
  className = "",
  href,
  // Discount badge props
  showDiscountBadge = false,
  discountBadgeBg = "bg-green-500",
  discountBadgeTextColor = "text-white",
  discountText,
  // Timer props
  showTimer = false,
  timerBg = "bg-red-500",
  timerTextColor = "text-white",
  endTime,
}: ListingCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  // Determine if we should show discount badge
  const shouldShowDiscountBadge =
    showDiscountBadge && (discountText || discount);

  // Determine if we should show timer
  const shouldShowTimer = showTimer && endTime;

  // Convert specs object to array for rendering
  const specsArray = Object.entries(specs);

  const CardContent = (
    <div
      className={`bg-white border border-grey-blue/20 rounded-lg overflow-hidden hover:shadow-lg shadow-purple/10 min-h-[290px] transition-all duration-300 hover:scale-105 ${className}`}
    >
      {/* Image */}
      <div className="relative w-full h-[118px] bg-gray-100">
        {typeof image === "string" ||
        (typeof image === "object" && image !== null && "src" in image) ? (
          <Image
            src={image as string | StaticImageData}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {image}
          </div>
        )}

        {/* Timer - positioned at bottom-left */}
        {shouldShowTimer && (
          <CountdownTimer
            endTime={endTime}
            bgColor={timerBg}
            textColor={timerTextColor}
          />
        )}

        {/* Discount Badge - positioned at top-left */}
        {shouldShowDiscountBadge && (
          <Badge
            className={cn(
              `absolute truncate max-w-[95%] top-0 left-0 px-2 py-1 rounded-none rounded-br-md text-xs font-medium`,
              discountBadgeBg,
              discountBadgeTextColor
            )}
          >
            {discountText || discount}
          </Badge>
        )}

        {/* Heart icon - positioned at top-right */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 size-8 p-1 rounded-full flex items-center justify-center hover:scale-110 hover:bg-purple/20 transition-transform cursor-pointer`}
        >
          <Heart
            className={`${isFavorite ? "fill-red-500 stroke-red-500" : "fill-white stroke-0"} transition-colors`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="pt-2 space-y-2">
        {/* Price Section */}
        <div className="flex items-center gap-1 px-2.5">
          <Image
            src={
              "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/AED.svg"
            }
            alt="AED"
            width={16}
            height={16}
          />
          <Typography
            variant="xs-black-inter"
            className="text-purple font-bold"
          >
            {currentPrice}
          </Typography>
          {originalPrice && (
            <Typography
              variant="xs-black-inter"
              className="text-grey-blue line-through text-sm"
            >
              {originalPrice}
            </Typography>
          )}
          {discount && (
            <Typography
              variant="xs-black-inter"
              className="text-grey-blue text-sm text-teal font-medium"
            >
              {discount}
            </Typography>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs font-semibold text-dark-blue leading-tight px-2.5 line-clamp-1">
          {title}
        </h3>

        {/* Dynamic Specs - First row (max 2 specs) */}
        {specsArray.length > 0 && (
          <div className="flex items-center gap-2 px-2.5">
            {specsArray.slice(0, 2).map(([key, value]) => {
              const Icon = getSpecIcon(key);
              return (
                <div key={key} className="flex items-center gap-1">
                  <Icon className="w-3 h-3 text-grey-500" />
                  <span className="text-xs text-grey-500 truncate">
                    {formatSpecValue(key, value)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Specs - Second row (max 2 specs) */}
        {specsArray.length > 2 && (
          <div className="space-y-1 px-2.5">
            <div className="flex items-center gap-2">
              {specsArray.slice(2, 4).map(([key, value]) => {
                const Icon = getSpecIcon(key);
                return (
                  <div key={key} className="flex items-center gap-1">
                    <Icon className="w-3 h-3 text-grey-500" />
                    <span className="text-xs text-grey-500 truncate">
                      {formatSpecValue(key, value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 px-2.5">
          <MapPin className="w-3 h-3 text-grey-500" />
          <span className="text-xs text-grey-500 truncate">{location}</span>
        </div>

        {/* Time ago */}
        {timeAgo && (
          <Typography
            variant="xs-black-inter"
            className="text-grey-blue text-xs font-regular px-2.5 border-t border-grey-blue/20 py-2.5"
          >
            {formatRelativeTime(timeAgo)}
          </Typography>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}

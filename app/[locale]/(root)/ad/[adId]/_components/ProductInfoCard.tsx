"use client";

import React, { useMemo, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Phone, Info } from "lucide-react";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { GoClockFill } from "react-icons/go";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { useRouter } from "nextjs-toploader/app";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import {
  getSpecifications,
  normalizeExtraFieldsToArray,
} from "@/utils/normalize-extra-fields";
import { useAuthStore } from "@/stores/authStore";
import { findOrCreateAdChat } from "@/lib/firebase/chat.utils";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductInfoCardProps {
  ad: AD;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ ad }) => {
  const router = useRouter();
  const { session, isAuthenticated } = useAuthStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user is the owner or organization owner
  const isOwner = useMemo(() => {
    if (!session.user?._id) return false;

    const currentUserId = session.user._id;
    const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;
    const orgOwnerId = ad.organization?.owner;

    return currentUserId === adOwnerId || currentUserId === orgOwnerId;
  }, [session.user?._id, ad.owner, ad.organization?.owner]);

  // Extract location
  const location =
    typeof ad.location === "string"
      ? ad.location
      : ad.location?.city || ad.address?.city || "Location not specified";

  // Format posted time
  const postedTime = formatDistanceToNow(new Date(ad.createdAt), {
    addSuffix: true,
  });

  // Extract extraFields for discount calculation
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);

  // Get specifications from extraFields using utility function
  const specifications = useMemo(() => {
    return getSpecifications(ad.extraFields);
  }, [ad.extraFields]);

  // Calculate discount and prices
  const getDiscountInfo = useMemo(() => {
    // Check for discount in extraFields (discountedPercent field)
    const discountPercentField = extraFields.find(
      (f: { name?: string; value: unknown }) =>
        f.name?.toLowerCase().includes("discountedpercent") ||
        f.name?.toLowerCase().includes("discount")
    );

    if (discountPercentField && ad.deal) {
      const discountPercentage = Number(discountPercentField.value) || 0;
      if (discountPercentage > 0 && ad.price) {
        const originalPrice = Math.round(
          ad.price / (1 - discountPercentage / 100)
        );
        return {
          currentPrice: ad.price,
          originalPrice: originalPrice,
          discountPercentage: Math.round(discountPercentage),
        };
      }
    }

    // No discount - show regular price
    return {
      currentPrice: ad.price,
      originalPrice: undefined,
      discountPercentage: undefined,
    };
  }, [ad.price, ad.deal, extraFields]);

  const handleCall = () => {
    if (ad.contactPhoneNumber) {
      window.location.href = `tel:${ad.contactPhoneNumber}`;
    } else {
      console.log("Phone number not available");
    }
  };

  const handleMessage = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !session.user) {
      toast.error("Please login to send a message");
      router.push("/login");
      return;
    }

    // Check if ad has an owner
    const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;
    if (!adOwnerId) {
      toast.error("Unable to find ad owner");
      return;
    }

    setIsLoading(true);
    try {
      // Find or create chat
      const chatId = await findOrCreateAdChat(ad, session.user);

      // Navigate to chat page with the chat ID
      router.push(`/chat?chatId=${chatId}&type=ad`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (ad.contactPhoneNumber) {
      const phoneNumber = ad.contactPhoneNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    } else {
      console.log("Phone number not available");
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Check if there's any content to render
  const hasTitle = !!ad.title;
  const hasSpecifications = specifications.length > 0;
  const hasPrice = !!getDiscountInfo.currentPrice;
  const hasDiscount = !!(
    getDiscountInfo.originalPrice && getDiscountInfo.discountPercentage
  );
  const hasLocation = !!location;
  const hasCreatedAt = !!ad.createdAt;
  const hasLocationOrTime = hasLocation || hasCreatedAt;
  const hasContactActions =
    !isOwner && (ad.contactPhoneNumber || ad.owner?._id);
  const hasAnyContent =
    hasTitle ||
    hasSpecifications ||
    hasPrice ||
    hasLocationOrTime ||
    hasContactActions;

  // Don't render if there's no content at all
  if (!hasAnyContent) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Title */}
      {hasTitle && (
        <div className="flex items-start gap-2 mb-4">
          <Typography
            variant="h2"
            className="text-lg font-semibold text-dark-blue line-clamp-2 flex-1"
          >
            {ad.title}
          </Typography>
          {ad.title.length > 50 && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-shrink-0 mt-1 p-1 rounded hover:bg-gray-100 transition-colors">
                  <Info className="h-4 w-4 text-grey-blue" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 max-h-96 overflow-y-auto"
                align="start"
              >
                <div className="space-y-2">
                  <Typography
                    variant="h3"
                    className="text-sm font-semibold text-dark-blue mb-2"
                  >
                    Full Title
                  </Typography>
                  <Typography
                    variant="body-small"
                    className="text-grey-blue whitespace-pre-wrap break-words"
                  >
                    {ad.title}
                  </Typography>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* Specifications */}
      {hasSpecifications && (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {/* Show first 4 specifications */}
          {specifications.slice(0, 4).map((spec) => (
            <div
              key={spec.name}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              {spec.icon ? (
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={spec.icon}
                    alt={spec.name}
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                  />
                </div>
              ) : null}
              <Typography variant="body-small" className="text-black text-xs">
                {spec.value}
              </Typography>
            </div>
          ))}

          {/* Show popover with remaining specifications if more than 4 */}
          {specifications.length > 4 && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 whitespace-nowrap text-xs text-purple-600 hover:text-purple-700 font-medium">
                  +{specifications.length - 4} more
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 max-h-96 overflow-y-auto"
                align="start"
              >
                <div className="space-y-2">
                  <Typography
                    variant="h3"
                    className="text-sm font-semibold text-dark-blue mb-3"
                  >
                    All Specifications
                  </Typography>
                  <div className="space-y-3">
                    {specifications.map((spec) => (
                      <div key={spec.name} className="flex items-center gap-2">
                        {spec.icon ? (
                          <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                            <Image
                              src={spec.icon}
                              alt={spec.name}
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                        ) : null}
                        <div className="flex-1">
                          <Typography
                            variant="body-small"
                            className="text-xs text-grey-blue"
                          >
                            {spec.name}
                          </Typography>
                          <Typography
                            variant="body-small"
                            className="text-sm text-dark-blue font-medium"
                          >
                            {spec.value}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* Price Section */}
      {hasPrice && (
        <div className="flex items-center justify-start gap-2 mb-6 flex-wrap">
          <div className="flex items-center gap-1">
            <Image src={ICONS.currency.aed} alt="AED" width={24} height={24} />
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(getDiscountInfo.currentPrice)}
            </span>
          </div>
          {hasDiscount && getDiscountInfo.originalPrice && (
            <>
              <span className="text-lg text-grey-blue line-through">
                {formatPrice(getDiscountInfo.originalPrice)}
              </span>
              {getDiscountInfo.discountPercentage && (
                <span className="text-sm font-semibold text-teal">
                  {getDiscountInfo.discountPercentage}% OFF
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Location and Time */}
      {hasLocationOrTime && (
        <div className="flex items-center justify-between mb-4">
          {hasLocation && (
            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="size-4" fill="#1D2939" stroke="1" />
              <Typography
                variant="body-small"
                className="text-grey-blue text-xs"
              >
                {location}
              </Typography>
            </div>
          )}
          {hasCreatedAt && (
            <div className="flex items-center gap-1.5">
              <GoClockFill className="size-4" fill="#1D2939" stroke="1" />
              <Typography
                variant="body-small"
                className="text-grey-blue text-xs"
              >
                {postedTime}
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Divider Line - Only show if there's content above and below */}
      {hasContactActions && (
        <div className="border-b border-dashed border-gray-300 mb-4"></div>
      )}

      {/* Contact Actions - Only show if user is not the owner */}
      {hasContactActions && (
        <div className="space-y-3">
          {/* Call Button */}
          {ad.contactPhoneNumber && (
            <Button
              onClick={handleCall}
              variant="primary"
              icon={<Phone className="h-5 w-5 -mr-2 fill-white" stroke="0" />}
              iconPosition="center"
              className="w-full h-12"
            >
              Call Seller
            </Button>
          )}

          {/* Message Button */}
          {ad.owner?._id && (
            <Button
              onClick={handleMessage}
              disabled={isLoading}
              variant="outline"
              icon={
                <MdMessage
                  className="h-5 w-5 -mr-2 fill-dark-blue"
                  stroke="white"
                />
              }
              iconPosition="center"
              className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Send Message"}
            </Button>
          )}

          {/* WhatsApp Button */}
          {ad.contactPhoneNumber && (
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              icon={
                <FaWhatsapp
                  className="h-5 w-5 -mr-2 fill-green-500"
                  stroke="0"
                />
              }
              iconPosition="center"
              className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-12"
            >
              WhatsApp
            </Button>
          )}

          {/* Show message if no contact options available */}
          {!ad.contactPhoneNumber && !ad.owner?._id && (
            <Typography
              variant="body-small"
              className="text-grey-blue text-center py-2"
            >
              Contact information not available
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfoCard;

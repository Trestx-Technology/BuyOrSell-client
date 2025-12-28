"use client";

import React, { useMemo, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { GoClockFill } from "react-icons/go";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { useRouter } from "nextjs-toploader/app";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { useAuthStore } from "@/stores/authStore";
import { findOrCreateAdChat } from "@/lib/firebase/chat.utils";
import { toast } from "sonner";

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

  // Extract extraFields for specifications
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);

  // Get specifications with single values only (not arrays) and filter out boolean fields
  const specifications = useMemo(() => {
    return extraFields
      .filter((field) => {
        // Only include fields with single values (not arrays)
        if (Array.isArray(field.value)) {
          return false;
        }
        // Filter out boolean fields
        if (field.type === "bool" || typeof field.value === "boolean") {
          return false;
        }
        // Filter out empty/null values
        if (
          field.value === null ||
          field.value === undefined ||
          field.value === ""
        ) {
          return false;
        }
        return true;
      })
      .map((field) => ({
        name: field.name,
        value: String(field.value),
        icon: field.icon,
      }));
  }, [extraFields]);

  // Calculate discount and prices
  const getDiscountInfo = useMemo(() => {
    // Check for discount in extraFields (discountedPercent field)
    const discountPercentField = extraFields.find(
      (f) =>
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
        <Typography
          variant="h2"
          className="text-lg font-semibold text-dark-blue mb-4"
        >
          {ad.title}
        </Typography>
      )}

      {/* Specifications */}
      {hasSpecifications && (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {specifications.map((spec) => (
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

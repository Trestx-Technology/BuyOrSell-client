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
import { PriceDisplay } from "@/components/global/price-display";
import { SpecificationsDisplay } from "@/components/global/specifications-display";
import { useAuthStore } from "@/stores/authStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { ChatInit } from "@/components/global/chat-init";

interface ProductInfoCardMobileProps {
  ad: AD;
}

const ProductInfoCardMobile: React.FC<ProductInfoCardMobileProps> = ({ ad }) => {
  const router = useRouter();
  const { session, isAuthenticated } = useAuthStore((state) => state);

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

  // Get specifications from extraFields using utility function
  const specifications = useMemo(() => {
    return getSpecifications(ad.extraFields);
  }, [ad.extraFields]);

  const handleCall = () => {
    if (ad.contactPhoneNumber) {
      window.location.href = `tel:${ad.contactPhoneNumber}`;
    } else {
      console.log("Phone number not available");
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

  // Check if there's any content to render
  const hasTitle = !!ad.title;
  const hasSpecifications = specifications.length > 0;
  const hasPrice = !!ad.price;
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
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
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
        <div className="mb-4">
          <SpecificationsDisplay
            specifications={specifications}
            maxVisible={4}
            showPopover={true}
          />
        </div>
      )}

      {/* Price Section */}
      {hasPrice && (
        <div className="mb-6">
          <PriceDisplay ad={ad} />
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
            <ChatInit ad={ad}>
              {({ isLoading, onClick }) => (
                <Button
                  onClick={onClick}
                  disabled={isLoading}
                  isLoading={isLoading}
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
                  Send Message
                </Button>
              )}
            </ChatInit>
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

export default ProductInfoCardMobile;

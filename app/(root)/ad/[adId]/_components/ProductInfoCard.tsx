"use client";

import React, { useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { GoClockFill } from "react-icons/go";
import { IoCalendarNumber } from "react-icons/io5";
import { PiGaugeFill } from "react-icons/pi";
import { BsFuelPumpFill } from "react-icons/bs";
import { IoIosFlash } from "react-icons/io";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { useRouter } from "nextjs-toploader/app";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { useAuthStore } from "@/stores/authStore";

interface ProductInfoCardProps {
  ad: AD;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ ad }) => {
  const router = useRouter();
  const { session } = useAuthStore((state) => state);
  
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
  const getFieldValue = (fieldName: string): string => {
    const field = extraFields.find(
      (f) => f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.join(", ");
      }
      return String(field.value || "");
    }
    return "";
  };

  const year = getFieldValue("year") || "";
  const mileage = getFieldValue("mileage") || getFieldValue("km") || "";
  const fuelType = getFieldValue("fuel") || getFieldValue("fuelType") || "";
  const transmission = getFieldValue("transmission") || "";

  const handleCall = () => {
    if (ad.contactPhoneNumber) {
      window.location.href = `tel:${ad.contactPhoneNumber}`;
    } else {
      console.log("Phone number not available");
    }
  };

  const handleMessage = () => {
    // TODO: Implement chat functionality
    router.push(`/chat/${ad.owner?._id || ad._id}`);
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Title */}
      {ad.title && (
        <Typography
          variant="h2"
          className="text-lg font-semibold text-dark-blue mb-4"
        >
          {ad.title}
        </Typography>
      )}

      {/* Specifications */}
      {(year || mileage || fuelType || transmission) && (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {year && (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <IoCalendarNumber />
              <Typography variant="body-small" className="text-black text-xs">
                {year}
              </Typography>
            </div>
          )}
          {mileage && (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <PiGaugeFill className="h-4 w-4 text-green-600" />
              <Typography variant="body-small" className="text-black text-xs">
                {mileage}
              </Typography>
            </div>
          )}
          {fuelType && (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <BsFuelPumpFill className="h-4 w-4 text-red-600" />
              <Typography variant="body-small" className="text-black text-xs">
                {fuelType}
              </Typography>
            </div>
          )}
          {transmission && (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <IoIosFlash className="h-4 w-4 text-yellow-600" />
              <Typography variant="body-small" className="text-black text-xs">
                {transmission}
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Price Section */}
      {ad.price && (
        <div className="flex items-center justify-start gap-2 mb-6">
          <div className="flex items-center gap-1">
            <Image src={ICONS.currency.aed} alt="AED" width={24} height={24} />
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(ad.price)}
            </span>
          </div>
        </div>
      )}

      {/* Location and Time */}
      <div className="flex items-center justify-between mb-4">
        {location && (
          <div className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="size-4" fill="#1D2939" stroke="1" />
            <Typography variant="body-small" className="text-grey-blue text-xs">
              {location}
            </Typography>
          </div>
        )}
        {ad.createdAt && (
          <div className="flex items-center gap-1.5">
            <GoClockFill className="size-4" fill="#1D2939" stroke="1" />
            <Typography variant="body-small" className="text-grey-blue text-xs">
              {postedTime}
            </Typography>
          </div>
        )}
      </div>

      {/* Divider Line */}
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

      {/* Contact Actions - Only show if user is not the owner */}
      {!isOwner && (
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
              variant="outline"
              icon={
                <MdMessage
                  className="h-5 w-5 -mr-2 fill-dark-blue"
                  stroke="white"
                />
              }
              iconPosition="center"
              className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-12"
            >
              Send Message
            </Button>
          )}

          {/* WhatsApp Button */}
          {ad.contactPhoneNumber && (
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              icon={
                <FaWhatsapp className="h-5 w-5 -mr-2 fill-green-500" stroke="0" />
              }
              iconPosition="center"
              className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-12"
            >
              WhatsApp
            </Button>
          )}

          {/* Show message if no contact options available */}
          {!ad.contactPhoneNumber && !ad.owner?._id && (
            <Typography variant="body-small" className="text-grey-blue text-center py-2">
              Contact information not available
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfoCard;


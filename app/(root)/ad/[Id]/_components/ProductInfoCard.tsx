"use client";

import React from "react";
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

interface ProductInfoCardProps {
  adId: string;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = () => {
  // Mock data - replace with actual API call
  const productData = {
    title: "BMW 2-Series M235i",
    price: 105452,
    originalPrice: 125000,
    discount: 12,
    currency: "AED",
    location: "Business Bay, Dubai",
    postedTime: "2 hours ago",
    specifications: {
      year: 2023,
      mileage: "35,000 KM",
      fuelType: "Petrol",
      transmission: "Automatic",
    },
  };

  const handleCall = () => {
    console.log("Call seller");
  };

  const handleMessage = () => {
    console.log("Send message");
  };

  const handleWhatsApp = () => {
    console.log("WhatsApp seller");
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Location and Time */}

      {/* Title */}
      <Typography
        variant="h2"
        className="text-lg font-semibold text-dark-blue mb-4"
      >
        {productData.title}
      </Typography>

      {/* Specifications */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <IoCalendarNumber />
          <Typography variant="body-small" className="text-black text-xs">
            {productData.specifications.year}
          </Typography>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <PiGaugeFill className="h-4 w-4 text-green-600" />
          <Typography variant="body-small" className="text-black text-xs">
            {productData.specifications.mileage}
          </Typography>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <BsFuelPumpFill className="h-4 w-4 text-red-600" />
          <Typography variant="body-small" className="text-black text-xs">
            {productData.specifications.fuelType}
          </Typography>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <IoIosFlash className="h-4 w-4 text-yellow-600" />
          <Typography variant="body-small" className="text-black text-xs">
            {productData.specifications.transmission}
          </Typography>
        </div>
      </div>

      {/* Price Section */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="flex items-center gap-1">
          <Image src={ICONS.currency.aed} alt="AED" width={24} height={24} />
          <span className="text-2xl font-bold text-purple-600">
            {formatPrice(productData.price)}
          </span>
        </div>
        {productData.originalPrice && (
          <span className="text-sm text-grey-blue line-through">
            {formatPrice(productData.originalPrice)}
          </span>
        )}
        {productData.discount && (
          <span className="text-teal text-sm font-semibold">
            {productData.discount}% OFF
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <FaMapMarkerAlt className="size-4" fill="#1D2939" stroke="1" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            {productData.location}
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <GoClockFill className="size-4" fill="#1D2939" stroke="1" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            {productData.postedTime}
          </Typography>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

      {/* Contact Actions */}
      <div className="space-y-3">
        {/* Call Button */}
        <Button
          onClick={handleCall}
          variant="primary"
          icon={<Phone className="h-5 w-5 -mr-2 fill-white" stroke="0" />}
          iconPosition="center"
          className="w-full h-12"
        >
          Call Seller
        </Button>

        {/* Message Button */}
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

        {/* WhatsApp Button */}
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
      </div>
    </div>
  );
};

export default ProductInfoCard;

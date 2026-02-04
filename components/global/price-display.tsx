"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { AD } from "@/interfaces/ad";
import { getDiscountInfo, DiscountInfo } from "@/utils/get-discount-info";
import { H4, H5 } from "../typography";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  // Option 1: Pass full AD object
  ad?: AD;
  // Option 2: Pass individual price props (when AD object is not available)
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  currencyIcon?: string;
  currencyIconWidth?: number;
  currencyIconHeight?: number;
  className?: string;
  currentPriceClassName?: string;
  originalPriceClassName?: string;
  discountBadgeClassName?: string;
  isCompact?: boolean;
}

/**
 * Formats a price number with locale-specific formatting
 */
const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a price number in a compact way (e.g. 1K, 1M)
 */
const formatCompactPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-AE", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount);
};

/**
 * Reusable component for displaying product price with discount information
 * Shows current price, original price (if discounted), and discount percentage badge
 * Automatically calculates discount from the AD object, or uses provided price props
 */
export function PriceDisplay({
  ad,
  price,
  originalPrice,
  discountPercentage: propDiscountPercentage,
  currencyIcon = ICONS.currency.aed,
  currencyIconWidth = 24,
  currencyIconHeight = 24,
  className = "",
  currentPriceClassName = "",
  originalPriceClassName = "",
  discountBadgeClassName = "",
  isCompact = true,
}: PriceDisplayProps) {
  // Calculate discount info from ad if provided, otherwise use individual props
  const discountInfo = useMemo((): DiscountInfo => {
    if (ad) {
      return getDiscountInfo(ad);
    }
    // Fallback to individual props
    if (price !== undefined) {
      // If we have originalPrice and discountPercentage, calculate currentPrice
      if (originalPrice && propDiscountPercentage) {
        return {
          currentPrice: Math.round(
            originalPrice * (1 - propDiscountPercentage / 100)
          ),
          originalPrice: originalPrice,
          discountPercentage: propDiscountPercentage,
        };
      }
      // If we have price and discountPercentage, calculate originalPrice
      if (propDiscountPercentage && !originalPrice) {
        const calculatedOriginal = Math.round(
          price / (1 - propDiscountPercentage / 100)
        );
        return {
          currentPrice: price,
          originalPrice: calculatedOriginal,
          discountPercentage: propDiscountPercentage,
        };
      }
      // If we have both price and originalPrice, use them directly
      if (originalPrice && originalPrice > price) {
        const calculatedDiscount = Math.round(
          ((originalPrice - price) / originalPrice) * 100
        );
        return {
          currentPrice: price,
          originalPrice: originalPrice,
          discountPercentage:
            calculatedDiscount > 0 ? calculatedDiscount : undefined,
        };
      }
      // Just price, no discount
      return {
        currentPrice: price,
        originalPrice: undefined,
        discountPercentage: undefined,
      };
    }
    return {
      currentPrice: 0,
      originalPrice: undefined,
      discountPercentage: undefined,
    };
  }, [ad, price, originalPrice, propDiscountPercentage]);

  const {
    currentPrice,
    originalPrice: discountOriginalPrice,
    discountPercentage,
  } = discountInfo;
  const hasDiscount = !!(discountOriginalPrice && discountPercentage);

  if (!currentPrice) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-start gap-2 flex-wrap ${className}`}
    >
      <div className="flex items-center gap-1">
        <Image
          src={currencyIcon}
          alt="Currency"
          width={currencyIconWidth}
          height={currencyIconHeight}
        />
        <H4
          className={`font-bold text-purple-600 ${currentPriceClassName}`}
        >
          {isCompact ? formatCompactPrice(currentPrice) : formatPrice(currentPrice)}
        </H4>
      </div>
      {hasDiscount && (
        <>
          <H5
            className={cn(discountBadgeClassName, "text-grey-blue line-through")}
          >
            {isCompact ? formatCompactPrice(discountOriginalPrice!) : formatPrice(discountOriginalPrice!)}
          </H5>
          {discountPercentage && (
            <H5
              className={cn(discountBadgeClassName, "font-semibold text-teal")}
            >
              {discountPercentage}%
            </H5>
          )}
        </>
      )}
    </div>
  );
}

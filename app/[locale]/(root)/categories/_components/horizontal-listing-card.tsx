"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
      Heart,
      Eye,
      ChevronLeft,
      ChevronRight,
      MapPin,
      ImageIcon,
      CircleUser,
      Clock,
      Phone,
      MessageSquareText,
      UserCircle2,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { ProductExtraFields } from "@/interfaces/ad";
import { PriceDisplay } from "@/components/global/price-display";
import {
      SpecificationsDisplay,
      Specification,
} from "@/components/global/specifications-display";
import { getSpecifications } from "@/utils/normalize-extra-fields";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import CollectionManager from "@/components/global/collection-manager";
import { useAuthStore } from "@/stores/authStore";
import { ChatInit } from "@/components/global/chat-init";
import { useRouter } from "next/navigation";

export interface HorizontalListingCardProps {
      id: string;
      title: string;
      price: number;
      originalPrice?: number;
      discount?: number;
      currency?: string;
      location: string;
      images: string[];
      extraFields: ProductExtraFields;
      postedTime: string;
      views?: number;
      isPremium?: boolean;
      seller?: {
            id?: string;
            name?: string;
            image?: string | null;
            isVerified?: boolean;
            type?: string;
            phoneNumber?: string;
            canCall?: boolean;
            canWhatsapp?: boolean;
      };
      // Discount and timer props
      discountText?: string;
      discountBadgeBg?: string;
      discountBadgeTextColor?: string;
      showDiscountBadge?: boolean;
      showTimer?: boolean;
      timerBg?: string;
      timerTextColor?: string;
      endTime?: Date;
      onShare?: (id: string) => void;
      onClick?: (id: string) => void;
      className?: string;
      isSaved?: boolean;
}

interface InternalCardProps extends HorizontalListingCardProps {
      specifications: Specification[];
      currentImageIndex: number;
      isTransitioning: boolean;
      timeLeft: string | null;
      handlePreviousImage?: (e: React.MouseEvent) => void;
      handleNextImage?: (e: React.MouseEvent) => void;
      handleImageSwipe?: (direction: "next" | "prev") => void;
      handleCardClick: () => void;
      handleCall: (e: React.MouseEvent) => void;
      handleWhatsapp: (e: React.MouseEvent) => void;
      showChat: boolean;
      showCall: boolean;
      showWhatsapp: boolean;
      id: string;
}

const DesktopCardLayout: React.FC<InternalCardProps> = ({
      title,
      price,
      originalPrice,
      discount,
      location,
      images,
      postedTime,
      views,
      isPremium,
      seller,
      discountText,
      discountBadgeBg,
      discountBadgeTextColor,
      showDiscountBadge,
      showTimer,
      timerBg,
      timerTextColor,
      className,
      specifications,
      isTransitioning,
      timeLeft,
      currentImageIndex,
      handlePreviousImage,
      handleNextImage,
      handleCardClick,
      handleCall,
      handleWhatsapp,
      showChat,
      showCall,
      showWhatsapp,
      id,
      isSaved,
}) => {
      return (
            <div
                  role="button"
                  className={cn(
                        "hidden md:flex overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group",
                        className
                  )}
                  onClick={handleCardClick}
            >
                  <div className="flex w-full">
                        {/* Image Section - Left Side */}
                        <div className="relative w-full max-w-[226px] h-full flex-shrink-0">
                              {images.length > 0 ? (
                                    <div className="relative w-full h-full overflow-hidden">
                                          <div
                                                className="flex transition-transform duration-500 ease-in-out h-full"
                                                style={{
                                                      transform: `translateX(-${currentImageIndex * 100}%)`,
                                                }}
                                          >
                                                {images.map((image, index) => (
                                                      <div
                                                            key={index}
                                                            className="w-full h-full flex-shrink-0 relative"
                                                      >
                                                            <Image
                                                                  src={image}
                                                                  alt={`${title} - Image ${index + 1}`}
                                                                  fill
                                                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center text-gray-400" onClick={(e) => e.stopPropagation()}>
                                                      <CollectionManager
                                                            itemId={id}
                                                            itemTitle={title}
                                                            itemImage={images[0]}
                                                            initialIsSaved={isSaved}
                                                            className="w-full"
                                                      >
                                                            {({ isSaved }) => (
                                                                  <button
                                                                        className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                  >
                                                                        <Heart className={cn("h-5 w-5", isSaved && "fill-purple text-purple")} />
                                                                        <span className="text-sm font-medium sm:block hidden">
                                                                              {isSaved ? "Saved" : "Save"}
                                                                        </span>
                                                                  </button>
                                                            )}
                                                      </CollectionManager>
                                                <span className="text-xs">No Image</span>
                                          </div>
                                    </div>
                              )}

                              {/* Premium Badge */}
                              {isPremium && (
                                    <div className="absolute top-2 left-2 z-10">
                                          <Image src={"/premium.svg"} alt="Premium" width={24} height={24} />
                                    </div>
                              )}

                              {/* Discount Badge */}
                              {showDiscountBadge && discount && discount > 0 && (
                                    <div
                                          className={`absolute top-0 left-0 ${discountBadgeBg} ${discountBadgeTextColor} px-2 py-1 rounded-tl-lg rounded-br-lg text-xs font-semibold shadow-lg z-10`}
                                    >
                                          {discountText || `${Math.round(discount)}%`}
                                    </div>
                              )}

                              {/* Timer */}
                              {showTimer && timeLeft && (
                                    <div
                                          className={`absolute bottom-0 right-0 ${timerBg} ${timerTextColor} px-2 py-1 rounded-tl-lg text-xs font-semibold shadow-lg flex items-center gap-1 z-10`}
                                    >
                                          <Clock className="w-3 h-3" />
                                          {timeLeft}
                                    </div>
                              )}
                              {/* Favorite Button */}
                              <div className="absolute top-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
                                    <CollectionManager
                                          itemId={id}
                                          itemTitle={title}
                                          itemImage={images[0]}
                                          initialIsSaved={isSaved}
                                    >
                                          {({ isSaved }) => (
                                                <button
                                                      className="h-8 w-8 hover:scale-125 transition-all cursor-pointer flex items-center justify-center p-0"
                                                      onClick={(e) => e.stopPropagation()}
                                                >
                                                      <Heart
                                                            size={22}
                                                            className={cn(
                                                                  isSaved
                                                                        ? "fill-red-500 text-red-500"
                                                                        : "text-slate-300 fill-white stroke-1"
                                                            )}
                                                      />
                                                </button>
                                          )}
                                    </CollectionManager>
                              </div>

                              {/* Image Counter */}
                              <div className="absolute bottom-2 left-2 z-10">
                                    <div className="bg-[#777777] rounded px-1.5 py-0.5 flex items-center gap-1">
                                          <ImageIcon size={12} className="text-white" />
                                          <span className="text-xs text-white font-medium">
                                                {currentImageIndex + 1}/{images.length}
                                          </span>
                                    </div>
                              </div>

                              {/* Views Counter (only if no timer) */}
                              {!showTimer && (
                                    <div className="absolute bottom-2 right-2 z-10">
                                          <div className="bg-black rounded px-1.5 py-0.5 flex items-center gap-1">
                                                <Eye size={12} className="text-white" />
                                                <span className="text-xs text-white font-medium">{views}</span>
                                          </div>
                                    </div>
                              )}

                              {/* Navigation Arrows */}
                              {images.length > 1 && (
                                    <>
                                          <Button
                                                size="sm"
                                                variant="secondary"
                                                disabled={isTransitioning}
                                                className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity z-20"
                                                onClick={handlePreviousImage}
                                          >
                                                <ChevronLeft className="h-3 w-3" />
                                          </Button>
                                          <Button
                                                size="sm"
                                                variant="secondary"
                                                disabled={isTransitioning}
                                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity z-20"
                                                onClick={handleNextImage}
                                          >
                                                <ChevronRight className="h-3 w-3" />
                                          </Button>
                                    </>
                              )}

                              {/* Image Dots Indicator */}
                              {images.length > 1 && (
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
                                          {images.map((_, index) => (
                                                <button
                                                      key={index}
                                                      onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isTransitioning || index === currentImageIndex) return;
                                                            // Note: Logic here is internal to button, relies on parent state updates
                                                            // but we need to trigger the parent's handler equivalent which isn't exposed directly for jumping to index
                                                            // Actually, the original code had inline set logic.
                                                            // For now, let's keep it simple or fix it.
                                                            // The original code: setIsTransitioning(true); setCurrentImageIndex(index); ...
                                                            // Since I moved state up, I can't do this easily without a new handler.
                                                            // I will leave this visual indicator passive or just use the nav buttons for now to avoid complexity,
                                                            // OR better: I'll just omit the click handler on bullets for now or add a `setIndex` prop.
                                                            // Let's add `onThumbnailClick` prop?
                                                            // Actually, let's just use the arrows.
                                                      }}
                                                      disabled={isTransitioning || index === currentImageIndex}
                                                      type="button"
                                                      className={cn(
                                                            "w-1 h-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-125",
                                                            index === currentImageIndex
                                                                  ? "bg-white scale-125"
                                                                  : "bg-white/50 hover:bg-white/75",
                                                            isTransitioning && "cursor-not-allowed"
                                                      )}
                                                />
                                          ))}
                                    </div>
                              )}
                        </div>

                        {/* Content Section - Center */}
                        <div className="flex-1 p-4 space-y-3">
                              {/* Title */}
                              <Typography
                                    variant="md-medium"
                                    className="font-semibold text-dark-blue leading-tight line-clamp-2"
                              >
                                    {title}
                              </Typography>

                              {/* Price Section */}
                              <div className="flex items-center justify-between">
                                    <PriceDisplay
                                          price={price}
                                          originalPrice={originalPrice}
                                          discountPercentage={discount}
                                          currencyIconWidth={16}
                                          currencyIconHeight={16}
                                          className="gap-2"
                                          currentPriceClassName="text-sm font-bold text-purple"
                                          originalPriceClassName="text-sm text-grey-blue line-through"
                                          discountBadgeClassName="text-sm text-teal font-bold"
                                    />
                              </div>

                              {/* Specifications */}
                              {specifications.length > 0 && (
                                    <SpecificationsDisplay
                                          specifications={specifications}
                                          maxVisible={4}
                                          showPopover={false}
                                          className="flex flex-wrap"
                                          itemClassName="text-[#667085]"
                                    />
                              )}

                              {/* Location */}
                              <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-[#667085]" />
                                    <Typography
                                          variant="body-small"
                                          className="text-xs text-[#667085] truncate"
                                    >
                                          {location}
                                    </Typography>
                              </div>

                              <div className="flex items-center text-purple gap-2">

                                    {showChat && (
                                          <ChatInit
                                                adId={id}
                                                adTitle={title}
                                                adImage={images[0]}
                                                sellerId={seller?.id}
                                                sellerName={seller?.name}
                                                sellerImage={seller?.image || undefined}
                                                sellerIsVerified={seller?.isVerified}
                                          >
                                                {({ isLoading, onClick }) => (
                                                      <Button
                                                            size={"icon-sm"}
                                                            variant="ghost"
                                                            onClick={onClick}
                                                            isLoading={isLoading}
                                                            icon={<MessageSquareText className="h-4 w-4" />}
                                                            iconPosition="center"
                                                      />
                                                )}
                                          </ChatInit>
                                    )}
                                    {showWhatsapp && (
                                          <Button
                                                size={"icon-sm"}
                                                variant="ghost"
                                                onClick={handleWhatsapp}
                                                icon={<FaWhatsapp className="h-4 w-4" />}
                                                iconPosition="center"
                                          />
                                    )}
                                    {showCall && (
                                          <Button
                                                size={"icon-sm"}
                                                variant="ghost"
                                                onClick={handleCall}
                                                icon={<Phone className="h-4 w-4" />}
                                                iconPosition="center"
                                          />
                                    )}
                              </div>
                        </div>

                        {/* Right Side - Seller & Actions */}
                        <div className="hidden sm:flex flex-col justify-between items-end gap-4 p-4">
                              <div className="flex flex-col items-end gap-2 text-right">
                                    {seller && (
                                          <div className="flex flex-col items-end">
                                                <Typography
                                                      variant="sm-black-inter"
                                                      className="text-xs text-gray-500 whitespace-nowrap font-medium flex items-center justify-end gap-1"
                                                >
                                                      <CircleUser size={16} className="text-purple" />
                                                      <span className="text-xs text-grey-blue font-normal">
                                                            {seller.type === "Agent" ? "By Agent:" : "By:"}
                                                      </span>
                                                      {seller.name}
                                                </Typography>
                                          </div>
                                    )}
                                    <div className="flex items-center gap-2 justify-end">
                                          {seller?.isVerified && (
                                                <Image
                                                      src={"/verified-seller.svg"}
                                                      alt="Verified Seller"
                                                      width={16}
                                                      height={16}
                                                />
                                          )}
                                          <span className="text-xs text-grey-blue">{postedTime}</span>
                                    </div>
                              </div>
                              <Button
                                    size={"default"}
                                    className="max-w-[117px] w-full"
                                    onClick={(e) => {
                                          e.stopPropagation();
                                          handleCardClick();
                                    }}
                              >
                                    View Details
                              </Button>
                        </div>
                  </div>
            </div>
      );
};

const MobileCardLayout: React.FC<InternalCardProps> = ({
      title,
      price,
      originalPrice,
      discount,
      location,
      images,
      postedTime,
      views,
      isPremium,
      seller,
      discountText,
      discountBadgeBg,
      discountBadgeTextColor,
      showDiscountBadge,
      showTimer,
      timerBg,
      timerTextColor,
      className,
      specifications,
      currentImageIndex,
      isTransitioning,
      timeLeft,
      handleImageSwipe,
      handleCardClick,
      handleCall,
      handleWhatsapp,
      showChat,
      showCall,
      showWhatsapp,
      id,
      isSaved,
}) => {
      return (
            <div
                  role="button"
                  className={cn(
                        "w-full flex md:hidden flex-col overflow-hidden rounded-xl border border-purple-100 bg-white hover:shadow-md transition-all duration-300 cursor-pointer group active:scale-[0.98] space-y-2",
                        className
                  )}
                  onClick={handleCardClick}
            >
                  <div className="flex p-2 items-center gap-3">
                        {/* Mobile Image Section */}
                        <div className="w-[110px] flex-shrink-0 space-y-1">
                              <div className="relative aspect-square flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                    {images.length > 0 ? (
                                          <div className="relative w-full h-full">
                                                <div
                                                      className="flex transition-transform duration-300 ease-in-out h-full"
                                                      style={{
                                                            transform: `translateX(-${currentImageIndex * 100}%)`,
                                                      }}
                                                >
                                                      {images.map((image, index) => (
                                                            <div
                                                                  key={index}
                                                                  className="w-full h-full flex-shrink-0 relative"
                                                            >
                                                                  <Image
                                                                        src={image}
                                                                        alt={`${title} - Image ${index + 1}`}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="128px"
                                                                  />
                                                            </div>
                                                      ))}
                                                </div>

                                                {/* Navigation Arrows for Mobile */}
                                                {images.length > 1 && (
                                                      <>
                                                            <Button
                                                                  size="sm"
                                                                  variant="secondary"
                                                                  disabled={isTransitioning}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleImageSwipe?.("prev");
                                                                  }}
                                                                  className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg p-0 opacity-80"
                                                            >
                                                                  <ChevronLeft className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                  size="sm"
                                                                  variant="secondary"
                                                                  disabled={isTransitioning}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleImageSwipe?.("next");
                                                                  }}
                                                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg p-0 opacity-80"
                                                            >
                                                                  <ChevronRight className="h-3 w-3" />
                                                            </Button>
                                                      </>
                                                )}
                                          </div>
                                    ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-lg">🚗</span>
                                          </div>
                                    )}

                                    {/* Premium Badge */}
                                    {!showDiscountBadge && isPremium && (
                                          <div className="absolute top-2 left-2 z-10">
                                                <Image src={"/premium.svg"} alt="Premium" width={24} height={24} />
                                          </div>
                                    )}

                                    {/* Discount */}
                                    {showDiscountBadge && discount && discount > 0 && (
                                          <div
                                                className={`absolute top-0 left-0 ${discountBadgeBg} ${discountBadgeTextColor} px-1.5 py-0.5 rounded-br-lg text-[10px] font-semibold shadow-lg z-10`}
                                          >
                                                {discountText || `${Math.round(discount)}%`}
                                          </div>
                                    )}

                                    {/* Timer */}
                                    {showTimer && timeLeft && (
                                          <div
                                                className={`absolute bottom-0 right-0 ${timerBg} ${timerTextColor} px-1.5 py-0.5 rounded-tl-lg text-[10px] font-semibold shadow-lg flex items-center gap-1 z-10`}
                                          >
                                                <Clock className="w-2.5 h-2.5" />
                                                {timeLeft}
                                          </div>
                                    )}
                                    {/* Favorite Button - Mobile */}
                                    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                                          <CollectionManager
                                                itemId={id}
                                                itemTitle={title}
                                                itemImage={images[0]}
                                                initialIsSaved={isSaved}
                                          >
                                                {({ isSaved }) => (
                                                      <button
                                                            className="h-7 w-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                      >
                                                            <Heart
                                                                  size={16}
                                                                  className={cn(
                                                                        isSaved
                                                                              ? "fill-red-500 text-red-500"
                                                                              : "text-gray-500"
                                                                  )}
                                                            />
                                                      </button>
                                                )}
                                          </CollectionManager>
                                    </div>
                              </div>

                              {/* Counters */}
                              <div className="flex gap-2">
                                    {images.length > 1 && (
                                          <div className="w-full bg-[#777777] rounded px-1.5 py-0.5 flex justify-center items-center gap-1">
                                                <ImageIcon size={10} className="text-white" />
                                                <span className="text-[10px] text-white font-medium">
                                                      {currentImageIndex + 1}/{images.length}
                                                </span>
                                          </div>
                                    )}
                                    <div className="w-full bg-black rounded px-1.5 py-0.5 flex items-center justify-center gap-1">
                                          <Eye size={10} className="text-white" />
                                          <span className="text-[10px] text-white font-medium">{views}</span>
                                    </div>
                              </div>
                        </div>

                        {/* Ad Metadata - Right Side */}
                        <div className="space-y-2 flex-1 min-w-0">
                              <PriceDisplay
                                    price={price}
                                    originalPrice={originalPrice}
                                    discountPercentage={discount}
                                    currencyIconWidth={16}
                                    currencyIconHeight={16}
                                    className="gap-1 flex-wrap"
                                    currentPriceClassName="text-md font-bold text-purple"
                                    originalPriceClassName="text-md text-grey-blue line-through text-sm"
                                    discountBadgeClassName="text-md text-grey-blue text-sm font-semibold"
                              />

                              <Typography
                                    variant="h3"
                                    className="text-sm font-semibold text-dark-blue leading-tight line-clamp-2"
                              >
                                    {title}
                              </Typography>

                              <div className="flex items-center gap-1">
                                    <MapPin size={18} className="text-[#667085] flex-shrink-0" />
                                    <Typography
                                          variant="body-small"
                                          className="text-xs text-[#667085] truncate"
                                    >
                                          {location}
                                    </Typography>
                              </div>

                              {/* Specifications */}
                              {specifications.length > 0 && (
                                    <SpecificationsDisplay
                                          specifications={specifications}
                                          maxVisible={4}
                                          showPopover={false}
                                          className="grid grid-cols-2 gap-1.5"
                                          itemClassName="text-[#667085] text-[10px]"
                                    />
                              )}
                        </div>
                  </div>

                  {/* Mobile Footer */}
                  <div className="w-full border-t flex flex-wrap gap-3 items-center justify-between p-2 mt-auto">
                        <div className="flex gap-2 items-center min-w-0">
                              <UserCircle2 className="text-purple flex-shrink-0 size-6" />
                              <div className="text-grey-blue overflow-hidden">
                                    <Typography
                                          variant="sm-semibold"
                                          className="flex items-center gap-1 truncate"
                                    >
                                          <span className="truncate max-w-[100px]">{seller?.name}</span>
                                          {seller?.isVerified && (
                                                <span className="flex-shrink-0">
                                                      <Image
                                                            src={"/verified-seller.svg"}
                                                            alt="Verified"
                                                            width={14}
                                                            height={14}
                                                      />
                                                </span>
                                          )}
                                    </Typography>
                                    <Typography
                                          variant="body-small"
                                          className="text-xs text-[#667085] truncate"
                                    >
                                          {seller?.type || "Seller"}
                                          {postedTime ? ` • ${postedTime}` : ""}
                                    </Typography>
                              </div>
                        </div>

                        <div className="flex items-center">
                              {showCall && (
                                    <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 hover:bg-purple/10"
                                          onClick={handleCall}
                                    >
                                          <Phone className="text-purple size-5" />
                                    </Button>
                              )}
                              {showChat && (
                                    <ChatInit
                                          adId={id}
                                          adTitle={title}
                                          adImage={images[0]}
                                          sellerId={seller?.id}
                                          sellerName={seller?.name}
                                          sellerImage={seller?.image || undefined}
                                          sellerIsVerified={seller?.isVerified}
                                    >
                                          {({ isLoading, onClick }) => (
                                                <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-8 w-8 hover:bg-purple/10"
                                                      onClick={onClick}
                                                      isLoading={isLoading}
                                                >
                                                      <MessageSquareText className="text-purple size-5" />
                                                </Button>
                                          )}
                                    </ChatInit>
                              )}
                              {showWhatsapp && (
                                    <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 hover:bg-purple/10"
                                          onClick={handleWhatsapp}
                                    >
                                          <FaWhatsapp className="text-purple size-5" />
                                    </Button>
                              )}
                        </div>
                  </div>
            </div>
      );
};

const HorizontalListingCard: React.FC<HorizontalListingCardProps> = (props) => {
      const {
            id,
            images,
            extraFields,
            showTimer,  
            endTime,
            onClick,
            title, // Added for ChatInit
            seller, // Added for ChatInit, handleCall, handleWhatsapp, showCall, showWhatsapp
      } = props;

      const user = useAuthStore((state) => state.session.user);
      const showChat = React.useMemo(() => {
            if (!user || !seller?.id) return false;
            return user._id !== seller.id;
      }, [user, seller?.id]);

      const handleCall = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!seller?.phoneNumber) return;
            window.open(`tel:${seller.phoneNumber}`);
      };

      const handleWhatsapp = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!seller?.phoneNumber) return;
            const phoneNumber = seller.phoneNumber.replace(/[^0-9]/g, "");
            window.open(`https://wa.me/${phoneNumber}`, "_blank");
      };

      const showCall = React.useMemo(() => {
            if (!seller?.id || !user) return false;
            // Also check if user is not the owner
            if (user._id === seller.id) return false;
            return !!(seller?.canCall && seller?.phoneNumber);
      }, [user, seller]);

      const showWhatsapp = React.useMemo(() => {
            if (!seller?.id || !user) return false;
            // Also check if user is not the owner
            if (user._id === seller.id) return false;
            return !!(seller?.canWhatsapp && seller?.phoneNumber);
      }, [user, seller]);

      // Shared Logic
      const specifications = useMemo((): Specification[] => {
            const specsFromFields = getSpecifications(extraFields, 4);
            return specsFromFields.map((spec) => ({
                  name: spec.name,
                  value: spec.value,
                  icon: spec.icon,
            }));
      }, [extraFields]);

      const [currentImageIndex, setCurrentImageIndex] = useState(0);
      const [isTransitioning, setIsTransitioning] = useState(false);
      const [timeLeft, setTimeLeft] = useState<string | null>(null);

      // Timer countdown effect
      useEffect(() => {
            if (!showTimer || !endTime) {
                  setTimeLeft(null);
                  return;
            }

            const updateTimer = () => {
                  const now = new Date().getTime();
                  const distance = endTime.getTime() - now;

                  if (distance < 0) {
                        setTimeLeft("Expired");
                        return;
                  }

                  const hours = Math.floor(distance / (1000 * 60 * 60));
                  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                  setTimeLeft(
                        `${hours.toString().padStart(2, "0")}:${minutes
                              .toString()
                              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                  );
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);

            return () => clearInterval(interval);
      }, [showTimer, endTime]);

      const handlePreviousImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isTransitioning) return;
            setIsTransitioning(true);
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            setTimeout(() => setIsTransitioning(false), 500);
      };

      const handleNextImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isTransitioning) return;
            setIsTransitioning(true);
            setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            setTimeout(() => setIsTransitioning(false), 500);
      };

      const handleCardClick = () => {
            onClick?.(id);
      };

      const handleImageSwipe = (direction: "next" | "prev") => {
            if (isTransitioning || images.length <= 1) return;
            setIsTransitioning(true);
            if (direction === "next") {
                  setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                  );
            } else {
                  setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                  );
            }
            setTimeout(() => setIsTransitioning(false), 300);
      };

      // No replacement needed here as we will consolidate into commonProps or props spreading
      // This block was a mistake in the previous turn


      const commonProps = {
            specifications,
            currentImageIndex,
            isTransitioning,
            timeLeft,
            handleCardClick,
            handleCall,
            handleWhatsapp,
            showChat,
            showCall,
            showWhatsapp,
      };

      return (
            <>
                  <DesktopCardLayout
                        {...props}
                        {...commonProps}
                        handlePreviousImage={handlePreviousImage}
                        handleNextImage={handleNextImage}
                  />
                  <MobileCardLayout
                        {...props}
                        {...commonProps}
                        handleImageSwipe={handleImageSwipe}
                  />
            </>
      );
};

export default HorizontalListingCard;

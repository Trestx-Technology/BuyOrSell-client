"use client";

import { Button } from "@/components/ui/button";
import HotDealsCarousel from "./_components/hot-deals-banners-carousel";
import { ChevronLeft, Search } from "lucide-react";
import { Typography } from "@/components/typography";
import { Input } from "@/components/ui/input";
import HotDealsListingCard from "@/components/global/hot-deals-listing-card";
import AdCard from "@/app/[locale]/(root)/categories/_components/AdCard";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { useAds } from "@/hooks/useAds";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { Container1280 } from "@/components/layouts/container-1280";

export default function HotDealsPage() {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery] = useState("");

  // Sort options with translations
  const sortOptions = useMemo(
    () => [
      { value: "default", label: t.deals.sortOptions.default },
      { value: "newest", label: t.deals.sortOptions.newest },
      { value: "oldest", label: t.deals.sortOptions.oldest },
      { value: "price-asc", label: t.deals.sortOptions.priceAsc },
      { value: "price-desc", label: t.deals.sortOptions.priceDesc },
    ],
    [t.deals.sortOptions]
  );

  // Fetch ads with deal filter
  const { data: adsResponse, isLoading } = useAds({
    deal: true,
    limit: 100, // Fetch more ads for sorting/filtering
  });

  // Extract ads from response
  const ads = useMemo(() => {
    if (!adsResponse?.data) return [];

    // Handle different response structures
    if (Array.isArray(adsResponse.data)) {
      return adsResponse.data;
    }
    if (adsResponse.data.ads && Array.isArray(adsResponse.data.ads)) {
      return adsResponse.data.ads;
    }
    if (adsResponse.data.adds && Array.isArray(adsResponse.data.adds)) {
      return adsResponse.data.adds;
    }
    return [];
  }, [adsResponse]);

  // Filter ads by search query
  const filteredAds = useMemo(() => {
    if (!searchQuery) return ads;

    return ads.filter((ad: AD) => {
      const title = ad.title?.toLowerCase() || "";
      const description = ad.description?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return title.includes(query) || description.includes(query);
    });
  }, [ads, searchQuery]);

  // Sort the filtered ads
  const sortedAds = useMemo(() => {
    const sorted = [...filteredAds];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
      case "price-asc":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return sorted;
    }
  }, [filteredAds, sortBy]);

  // Format posted time
  const formatPostedTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "";
    }
  };

  const handleBack = () => {
    router.push(localePath("/"));
  };

  const handleAdClick = (id: string) => {
    router.push(localePath(`/ad/${id}`));
  };

  return (
    <Container1280 className="flex flex-col">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
          onClick={handleBack}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          {t.deals.title}
        </Typography>
      </div>
      <div className="bg-purple block md:hidden p-4">
        <div className="flex items-center gap-4">
          <Input
            leftIcon={<Search className="h-4 w-4" />}
            placeholder={t.deals.searchPlaceholder}
            className="bg-white border-gray-200"
          />
        </div>
      </div>
      <HotDealsCarousel />

      <div className="w-full max-w-[1080px] mx-auto px-4 lg:px-0 mt-8">
        {/* <div className="mb-12 space-y-4">
          <Typography variant="md-medium" className="text-white">
            {t.deals.browseCategories}
          </Typography>
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <Button
              className="px-3"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
          </div>
        </div> */}

        {/* Favorites Section */}
        <div className=" rounded-xl md:p-0 shadow-sm md:shadow-none">
          <div className="flex items-center justify-end md:justify-between mb-6">
            <div className="hidden md:block">
              <Typography variant="3xl-semibold" className="text-white">
                {t.deals.title}
              </Typography>
              <Typography variant="sm-regular" className="text-white">
                {t.deals.subtitle}
              </Typography>
            </div>

            {/* Sort Dropdown */}
            <SortAndViewControls
              variant="dark"
              sortOptions={sortOptions}
              sortValue={sortBy}
              onSortChange={setSortBy}
              viewMode={view}
              onViewChange={setView}
              showViewToggle={true}
              showFilterButton={false}
              size="fit"
              className="flex justify-end mb-4"
            />
          </div>

          {/* Ads Grid */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : sortedAds.length === 0 ? (
              <div className="text-center py-12">
                <Typography variant="body" className="text-white">
                  No deals available at the moment
                </Typography>
              </div>
            ) : (
              <div
                className={cn(
                  `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
                  view === "list" && "flex flex-col"
                )}
              >
                {sortedAds.map((ad: AD, index: number) => {
                  // Insert AdCard at the 4th position (index 3)
                  if (index === 3) {
                    return (
                      <React.Fragment key={`ad-card-${index}`}>
                        {view === "grid" ? (
                          <AdCard className="min-h-[284px]" />
                        ) : (
                          <AdCard className="min-h-[120px]" />
                        )}
                      </React.Fragment>
                    );
                  }

                  // Transform extraFields
                  const extraFieldsArray = Array.isArray(ad.extraFields)
                    ? ad.extraFields
                    : ad.extraFields
                    ? Object.entries(ad.extraFields).map(([name, value]) => ({
                        name,
                        type: typeof value === "number" ? "number" : "string",
                        value: value as string | number,
                      }))
                    : [];

                  // Get location string
                  const locationString =
                    typeof ad.location === "string"
                      ? ad.location
                      : ad.location?.city ||
                        ad.address?.city ||
                        "Location not specified";

                  // Calculate discount info - prioritize discountedPrice, then discountedPercent from extraFields
                  const extraFieldsObj = Array.isArray(ad.extraFields)
                    ? ad.extraFields.reduce((acc, field) => {
                        if (
                          field &&
                          typeof field === "object" &&
                          "name" in field &&
                          "value" in field
                        ) {
                          acc[field.name] = field.value;
                        }
                        return acc;
                      }, {} as Record<string, any>)
                    : (ad.extraFields as Record<string, any>) || {};

                  // Use discountedPrice if available (this is the actual discounted price)
                  // If discountedPrice exists, price is the original price
                  let currentPrice = ad.price;
                  let originalPrice: number | undefined = undefined;
                  let discountPercentage: number | undefined = undefined;

                  if (
                    ad.discountedPrice !== null &&
                    ad.discountedPrice !== undefined &&
                    ad.discountedPrice < ad.price
                  ) {
                    // discountedPrice is available and is less than price
                    currentPrice = ad.discountedPrice;
                    originalPrice = ad.price;
                    // Calculate discount percentage
                    discountPercentage = Math.round(
                      ((ad.price - ad.discountedPrice) / ad.price) * 100
                    );
                  } else {
                    // Try to get discount from extraFields
                    const discountedPercent = extraFieldsObj.discountedPercent
                      ? Number(extraFieldsObj.discountedPercent)
                      : undefined;

                    if (
                      discountedPercent &&
                      discountedPercent > 0 &&
                      ad.price
                    ) {
                      // Calculate original price from discount percentage
                      originalPrice = Math.round(
                        ad.price / (1 - discountedPercent / 100)
                      );
                      currentPrice = ad.price; // price is already the discounted price
                      discountPercentage = Math.round(discountedPercent);
                    }
                  }

                  // Get seller info
                  const seller = ad.organization
                    ? {
                        name:
                          ad.organization.tradeName ||
                          ad.organization.legalName,
                        type: "Agent" as const,
                        isVerified: ad.organization.verified,
                        image: ad.organization.logoUrl || null,
                      }
                    : ad.owner
                    ? {
                        name:
                          ad.owner.firstName && ad.owner.lastName
                            ? `${ad.owner.firstName} ${ad.owner.lastName}`
                            : ad.owner.firstName || ad.owner.name,
                        firstName: ad.owner.firstName,
                        lastName: ad.owner.lastName,
                        type: "Individual" as const,
                        isVerified: (ad.owner as any).isVerified,
                        image: ad.owner.image || null,
                      }
                    : undefined;

                  return (
                    <HotDealsListingCard
                      key={ad._id}
                      id={ad._id}
                      title={ad.title}
                      price={currentPrice}
                      originalPrice={originalPrice}
                      discount={discountPercentage}
                      currency="AED"
                      location={locationString}
                      images={ad.images || []}
                      extraFields={extraFieldsArray}
                      isExchange={ad.upForExchange || ad.isExchangable}
                      postedTime={formatPostedTime(ad.createdAt)}
                      views={ad.views}
                      isPremium={ad.isFeatured}
                      isFavorite={ad.isAddedInCollection}
                      onFavorite={(id) => console.log("Favorited:", id)}
                      onShare={(id) => console.log("Shared:", id)}
                      onClick={handleAdClick}
                      className="border-none"
                      showSeller={true}
                      seller={seller}
                      showDiscountBadge={!!discountPercentage}
                      discountText={
                        discountPercentage
                          ? `FLAT ${discountPercentage}% OFF`
                          : undefined
                      }
                      showTimer={!!ad.dealValidThru}
                      dealValidThrough={ad.dealValidThru || null}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container1280>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/useUrlParams";
import { Typography } from "@/components/typography";
import { ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import SortAndViewControls, {
      ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import HorizontalListingCard from "../../categories/_components/horizontal-listing-card";
import HotDealsListingCard from "@/components/features/hot-deals-listing-card/hot-deals-listing-card";
import Pagination from "@/components/global/pagination";
import { useAds, useFilterAds } from "@/hooks/useAds";
import { transformAdToHotDealsCard } from "@/utils/transform-ad-to-listing";
import { AdFilters } from "@/interfaces/ad";
import { Container1080 } from "@/components/layouts/container-1080";
import { buildAdFilterPayload } from "@/utils/ad-payload";
import { buildAdQueryParams } from "@/utils/ad-query-params";
import ListingCardSkeleton from "@/components/global/listing-card-skeleton";
import { NoDataCard } from "@/components/global/fallback-cards";
import { LocalStorageService } from "@/services/local-storage";
import { EMIRATE_STORAGE_KEY } from "@/components/global/EmirateSelector";
import { useEmirates } from "@/hooks/useLocations";
import { PageBannerCarousel } from "@/components/global/page-banner-carousel";
import { BrowseByCategory } from "../_components/browse-by-category";
import { useBannersBySlug } from "@/hooks/useBanners";
import { SponsoredCarousel } from "@/components/global/banner-carousel";

const ITEMS_PER_PAGE = 12;

export default function HotDealsContent() {
      const { t, locale } = useLocale();
      const router = useRouter();
      const searchParams = useSearchParams();
      const { clearUrlQueries } = useUrlParams();

      const { data: sponsoredBannersData } = useBannersBySlug("explore-deals");
      const sponsoredBanners = sponsoredBannersData?.data?.banners || [];

      const [selectedCategory, setSelectedCategory] = useState("");
      const [searchQuery, setSearchQuery] = useState("");
      const [inputValue, setInputValue] = useDebouncedValue(
            searchQuery,
            setSearchQuery,
            500
      );

      const { data: emirates } = useEmirates();

      const selectedEmirate = useMemo(() => {
            const fromUrl = searchParams.get("emirate");
            if (fromUrl) return fromUrl;
            return LocalStorageService.get<string>(EMIRATE_STORAGE_KEY) || "";
      }, [searchParams]);

      const emirateDisplayName = useMemo(() => {
            if (!selectedEmirate) return locale === "ar" ? "كل المدن" : "All Cities";
            if (!emirates) return selectedEmirate;
            const emirate = emirates.find((e) => e.emirate === selectedEmirate);
            return emirate
                  ? locale === "ar"
                        ? emirate.emirateAr
                        : emirate.emirate
                  : selectedEmirate;
      }, [selectedEmirate, emirates, locale]);

      const [view, setView] = useState<ViewMode>("grid");
      const [sortBy, setSortBy] = useState("default");
      const [currentPage, setCurrentPage] = useState(1);


      const breadcrumbItems = [
            { id: "home", label: "Home", href: "/" },
            { id: "deals", label: t.deals.title, href: "/deals" },
      ];

      const apiFilters = useMemo<AdFilters>(() => {
            return buildAdQueryParams({
                  categoryName: selectedCategory || undefined,
                  currentPage,
                  itemsPerPage: ITEMS_PER_PAGE,
                  searchQuery,
                  locationQuery: selectedEmirate,
                  filters: {},
                  sortBy,
                  deal: true,
            });
      }, [selectedCategory, currentPage, searchQuery, selectedEmirate, sortBy]);

      const filterPayload = useMemo(() => {
            if (!selectedCategory) return null;
            return buildAdFilterPayload({
                  categoryName: selectedCategory || undefined,
                  searchQuery,
                  locationQuery: selectedEmirate,
                  filters: { deal: "true" },
                  extraFields: {},
            });
      }, [selectedCategory, searchQuery, selectedEmirate]);

      // Use filter API if dynamic filters are active, otherwise use regular ads API
      const { data: filterAdsResponse, isLoading: isFilterLoading } = useFilterAds(
            filterPayload as any,
            currentPage,
            ITEMS_PER_PAGE,
            !!filterPayload
      );

      const { data: adsResponse, isLoading: isAdsLoading } = useAds(
            apiFilters,
            { enabled: !filterPayload }
      );

      const currentResponse = filterPayload ? filterAdsResponse : adsResponse;
      const isLoading = filterPayload ? isFilterLoading : isAdsLoading;

      const ads = useMemo(() => {
            if (!currentResponse?.data) return [];
            const data = currentResponse.data;
            if (Array.isArray(data)) return data;
            return data.ads || data.adds || [];
      }, [currentResponse]);

      const totalAds = currentResponse?.data?.total || ads.length;
      const totalPages = Math.ceil(totalAds / ITEMS_PER_PAGE);

      const clearFilters = () => {
            setSelectedCategory("");
            setSearchQuery("");
            setCurrentPage(1);
            clearUrlQueries();
      };

      const handlePageChange = (page: number) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
      };

      return (
            <Container1080 className="min-h-[calc(100dvh)]">
                  {/* Mobile Header */}
                  <div className="w-full bg-purple sm:hidden p-4 space-y-4">
                        <div className="flex items-center justify-between">
                              <Button
                                    icon={<ChevronLeft />}
                                    iconPosition="left"
                                    className="bg-white text-purple w-8 rounded-full"
                                    size={"icon-sm"}
                                    onClick={() => router.back()}
                              />
                        </div>

                        {/* Search Bar */}
                        <Input
                              leftIcon={<Search className="h-4 w-4" />}
                              placeholder={t.categories.search}
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              className="pl-10 bg-gray-100 border-0"
                        />
                  </div>

                  <div className="max-w-7xl mx-auto py-6">
                        <PageBannerCarousel slug="deals-page" />

                        <div className="hidden px-4 sm:block mb-8 mt-6">
                              <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
                        </div>

                        {/* Browse by Category Section */}
                        <div className="mb-8 items-center bg-transparent">
                              <BrowseByCategory
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={(cat) => {
                                          setSelectedCategory(cat);
                                          setCurrentPage(1);
                                    }}
                                    totalAds={totalAds}
                                    mode="deals"
                              />
                        </div>

                        {/* Page Header */}
                        <div className="px-4 mb-6">
                              <div className="flex items-center justify-between">
                                    <div>
                                          <Typography variant="h3" className="text-white font-bold">
                                                Hot Deals
                                          </Typography>
                                          <Typography variant="body-small" className="text-white/60">
                                                Limited time offers you don&apos;t want to miss
                                          </Typography>
                                    </div>

                                    <SortAndViewControls
                                          sortValue={sortBy}
                                          onSortChange={setSortBy}
                                          viewMode={view}
                                          onViewChange={setView}
                                          showViewToggle={true}
                                          showFilterButton={false}
                                          size="fit"
                                          className="hidden sm:flex"
                                          variant="dark"
                                    />
                              </div>
                        </div>


                        <SortAndViewControls
                              sortValue={sortBy}
                              onSortChange={setSortBy}
                              viewMode={view}
                              onViewChange={setView}
                              showViewToggle={true}
                              showFilterButton={false}
                              size="fit"
                              className="px-4 flex justify-end mb-4 sm:hidden"
                              variant="dark"
                        />

                        {/* Main Content */}
                        <main className="flex-1">
                              {isLoading ? (
                                    <div className="px-4 sm:px-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                                <ListingCardSkeleton key={i} />
                                          ))}
                                    </div>
                              ) : ads.length > 0 ? (
                                    <div className="space-y-8">
                                          <div
                                                className={cn(
                                                      "px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5",
                                                      view === "list" && "flex flex-col"
                                                )}
                                          >
                                                      {ads.map((ad: any, index: number) => {
                                                      const cardProps = transformAdToHotDealsCard(ad, locale);
                                                      const handleCardClick = (id: string) => {
                                                            router.push(`/ad/${id}`);
                                                      };

                                                      const isGrid = view === "grid";
                                                      const showSponsored = isGrid && index > 0 && index % 6 === 0 && sponsoredBanners.length > 0;

                                                      return (
                                                            <React.Fragment key={ad._id}>
                                                                  {showSponsored && (
                                                                        <div className="col-span-2 sm:col-span-3 lg:col-span-4 my-4">
                                                                              <SponsoredCarousel
                                                                                    banners={sponsoredBanners}
                                                                                    className="max-w-full !max-h-[200px]"
                                                                                    height="h-[200px]"
                                                                              />
                                                                        </div>
                                                                  )}
                                                                  {isGrid ? (
                                                                        <HotDealsListingCard
                                                                              className="w-full border-0 shadow-lg"
                                                                              {...cardProps}
                                                                              showSeller={true}
                                                                              onClick={handleCardClick}
                                                                        />
                                                                  ) : (
                                                                        <HorizontalListingCard
                                                                                    {...transformAdToHotDealsCard(ad, locale)}
                                                                                    onClick={handleCardClick}
                                                                              />
                                                                  )}
                                                            </React.Fragment>
                                                      );
                                                })}
                                          </div>

                                          {totalPages > 1 && (
                                                <div className="mt-12 flex justify-center">
                                                      <Pagination
                                                            currentPage={currentPage}
                                                            totalPages={totalPages}
                                                            onPageChange={handlePageChange}
                                                            variant="dark"
                                                      />
                                                </div>
                                          )}
                                    </div>
                              ) : (
                                    <div className="py-20 text-center">
                                          <NoDataCard
                                                title={t.categories.noAdsFound}
                                                description={t.categories.clearFilters}
                                                action={
                                                      <Button onClick={clearFilters} variant="filled">
                                                            {t.categories.clearFilters}
                                                      </Button>
                                                }
                                          />
                                    </div>
                              )}
                        </main>
                  </div>
            </Container1080>
      );
}

"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import HorizontalListingCard from "../../../categories/_components/horizontal-listing-card";
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
import { unSlugify } from "@/utils/slug-utils";
import { BrowseByCategory } from "../../../deals/_components/browse-by-category";
import { PageBannerCarousel } from "@/components/global/page-banner-carousel";
import { useBannersBySlug } from "@/hooks/useBanners";
import { SponsoredCarousel } from "@/components/global/banner-carousel";

const ITEMS_PER_PAGE = 12;

export default function ExchangeAdsContent() {
      const { t, locale } = useLocale();
      const params = useParams();
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

      // Get category from URL params - use the last slug segment
      const slugSegments = Array.isArray(params.slug)
            ? params.slug
            : params.slug
                  ? [params.slug]
                  : [];
      const currentCategory = slugSegments[slugSegments.length - 1] || "";
      const categoryName = currentCategory
            ? unSlugify(decodeURIComponent(currentCategory))
            : "";

      const { data: emirates } = useEmirates();

      const selectedEmirate = useMemo(() => {
            const fromUrl = searchParams.get("emirate");
            if (fromUrl) return fromUrl;
            return LocalStorageService.get<string>(EMIRATE_STORAGE_KEY) || "";
      }, [searchParams]);

      const emirateDisplayName = useMemo(() => {
            if (!selectedEmirate) return locale === "ar" ? "الإمارات" : "UAE";
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


      const apiFilters = useMemo<AdFilters>(() => {
            return buildAdQueryParams({
                  categoryName: selectedCategory || categoryName || undefined,
                  currentPage,
                  itemsPerPage: ITEMS_PER_PAGE,
                  searchQuery,
                  locationQuery: selectedEmirate,
                  filters: {},
                  sortBy,
                  isExchangable: true,
            });
      }, [selectedCategory, categoryName, currentPage, searchQuery, selectedEmirate, sortBy]);

      const filterPayload = useMemo(() => {
            const finalCategory = selectedCategory || categoryName;
            if (!finalCategory) return null;
            return buildAdFilterPayload({
                  categoryName: finalCategory,
                  searchQuery,
                  locationQuery: selectedEmirate,
                  filters: { exchangable: "true" },
                  extraFields: {},
            });
      }, [selectedCategory, categoryName, searchQuery, selectedEmirate]);

      // Use filter API if dynamic filters are active, otherwise use regular ads API
      const { data: filterAdsResponse, isLoading: isFilterLoading } = useFilterAds(
            filterPayload as any,
            currentPage,
            ITEMS_PER_PAGE,
            !!filterPayload
      );

      const { data: adsResponse, isLoading: isAdsLoading } = useAds(apiFilters, {
            enabled: !filterPayload,
      });

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

      const breadcrumbItems = [
            { id: "home", label: "Home", href: "/" },
            { id: "exchange", label: t.exchange.title, href: "/exchange" },
      ];

      const handlePageChange = (page: number) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
      };

      return (
            <div className="w-full bg-[#020617] min-h-screen">
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
                              <PageBannerCarousel slug="exchange-page" />
                              <div className="hidden px-4 sm:block mb-8 mt-6">
                                    <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
                              </div>

                              {/* Browse by Category Section */}
                              <div className="mb-8 items-center bg-transparent">
                                    <BrowseByCategory
                                          selectedCategory={selectedCategory || categoryName}
                                          onCategoryChange={(cat) => {
                                                setSelectedCategory(cat);
                                                setCurrentPage(1);
                                          }}
                                          totalAds={totalAds}
                                          mode="exchange"
                                    />
                              </div>

                              {/* Page Header */}
                              <div className="px-4 mb-6">
                                    <div className="flex items-center justify-between">
                                          <div>
                                                <Typography variant="h3" className="text-white font-bold">
                                                      {t.exchange.title}
                                                </Typography>
                                                <Typography variant="body-small" className="text-white/60">
                                                      {t.categories.forSaleIn
                                                            .replace("{{category}}", selectedCategory || categoryName || t.exchange.title)
                                                            .replace("{{emirate}}", emirateDisplayName)
                                                            .replace("{{count}}", totalAds.toString())}
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
                                          <div className="px-4 sm:px-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                                      <ListingCardSkeleton key={i} />
                                                ))}
                                          </div>
                                    ) : ads.length > 0 ? (
                                          <div className="space-y-6">
                                                <div
                                                      className={cn(
                                                            "px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
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
                                          <div className="py-12">
                                                <NoDataCard
                                                      title={t.exchange.noAdsFound}
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
            </div>
      );
}

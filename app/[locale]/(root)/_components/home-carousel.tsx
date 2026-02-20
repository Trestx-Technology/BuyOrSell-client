import { BannerCarousel } from "@/components/global/banner-carousel";
import { useBannersBySlug } from "@/hooks/useBanners";

export function HomeCarousel() {
  const {
    data: bannersData,
    isLoading: isLoadingBanners,
    error: errorBanners,
  } = useBannersBySlug("home-page-carousel");

  const { data: exploreDealsBanners, isLoading: isLoadingExploreDeals } =
    useBannersBySlug("explore-deals");

  return (
    <div>
      <BannerCarousel
        banners={bannersData?.data?.banners || []}
        sponsoredBanners={exploreDealsBanners?.data?.banners || []}
        isLoading={isLoadingBanners || isLoadingExploreDeals}
        error={errorBanners}
        showSponsoredBanner={true}
        autoPlay={true}
        autoPlayInterval={5000}
        showDots={true}
        showNavigation={true}
      />
    </div>
  );
}

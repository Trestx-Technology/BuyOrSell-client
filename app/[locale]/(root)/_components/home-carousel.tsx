import { BannerCarousel } from "@/components/global/banner-carousel";
import { useBannersByLocation } from "@/hooks/useBanners";

export function HomeCarousel() {
  const {
    data: bannersData,
    isLoading: isLoadingBanners,
    error: errorBanners,
  } = useBannersByLocation("homepage-carousel");

  return (
    <div>
      <BannerCarousel
        banners={bannersData?.data?.banners || []}
        isLoading={isLoadingBanners}
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

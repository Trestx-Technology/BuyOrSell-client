"use client";

import CategoryNav from "@/app/(root)/_components/CategoryNav";
import { HomeCarousel } from "./home-carousel";
import CategoriesCarousel from "./categories-carousel";
import PopularCategories from "./popular-categories";
import RecentViews from "./recent-views";
import HostDeals from "./host-deals";
import TrendingCars from "./trending-cars";
import TrendingProperties from "./trending-properties";
import TrendingFurniture from "./trending-furniture";
import TrendingProducts from "./trending-products";
import PopularJobs from "./popular-jobs";
import PopularClassifieds from "./popular-classifieds";
import BusinessIndustries from "./business-industries";
import { MidBannerCarousel } from "./mid-banner-carousel";
import FloatingChatCTA from "@/components/global/flowting-ai-cta";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";
import ExchangeDeals from "./exchange-deals";
import { useHome } from "@/hooks/useHome";

export function HomeContent() {
  const { data: homeData, isLoading } = useHome();
  console.log("homeData: ", homeData?.data.adsByCategory);
  const banners = [
    {
      id: 1,
      image:
        "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png",
      callToAction: "Premium Properties",
    },
    {
      id: 2,
      image:
        "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/estate-banner.png",
      callToAction: "Luxury Real Estate",
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <CategoryNav />

      {/* Promotional Banners and Sponsored Banner */}
      <div className="max-w-[1280px] mx-auto">
        {/* Promotional Banners with Sponsored Banner */}
        <HomeCarousel />
      </div>
      <div className="max-w-[1280px] mx-auto relative">
        {/* Category Carousel */}
        <CategoriesCarousel
          categoryList={homeData?.data?.categoryList}
          isLoading={isLoading}
        />
        <PopularCategories
          popularCategories={homeData?.data?.popularCategories}
          isLoading={isLoading}
        />

        <div className="my-8 space-y-5">
        {/* Recent Views */}
        {homeData?.data?.recentlyViewed && homeData?.data?.recentlyViewed.length > 0 && <RecentViews />}          
          <HostDeals />
          <ExchangeDeals />
        </div>

        {/* PhonePe-Style Stacking Animation Container */}
        <div className="max-w-[1280px] mx-auto relative">
          <TrendingCars className="sticky top-0 z-10" />
          <TrendingProperties className="sticky top-[50px] z-20" />
          {/* New Components */}
          <TrendingFurniture className="sticky top-[150px] z-40" />
          <TrendingProducts className="sticky top-[200px] z-50" />
          <PopularJobs className="sticky top-[250px] z-60" />

          <PopularClassifieds className="sticky top-[300px] z-70" />
          <BusinessIndustries className="sticky top-[350px] z-80" />
          <MidBannerCarousel
            className="max-w-[1180px] mx-auto"
            containerClassName="sticky top-[400px] z-90"
            banners={banners}
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </div>

        {/* Footer */}
        <FloatingChatCTA />
      </div>
      <Footer />
    </main>
  );
}


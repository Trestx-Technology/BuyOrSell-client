import CategoryNav from "@/app/(root)/_components/CategoryNav";
import { HomeCarousel } from "./_components/home-carousel";
import CategoriesCarousel from "./_components/categories-carousel";
import PopularCategories from "./_components/popular-categories";
import RecentViews from "./_components/recent-views";
import HostDeals from "./_components/host-deals";
import TrendingCars from "./_components/trending-cars";
import TrendingProperties from "./_components/trending-properties";
import TrendingFurniture from "./_components/trending-furniture";
import TrendingProducts from "./_components/trending-products";
import PopularJobs from "./_components/popular-jobs";
import PopularClassifieds from "./_components/popular-classifieds";
import BusinessIndustries from "./_components/business-industries";
import { MidBannerCarousel } from "./_components/mid-banner-carousel";
import FloatingChatCTA from "@/components/global/flowting-ai-cta";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";

export default function Home() {
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
        <CategoriesCarousel />
        <PopularCategories />

        {/* Recent Views */}
        <RecentViews />
        <HostDeals />

        {/* PhonePe-Style Stacking Animation Container */}
        <div className="max-w-[1280px] mx-auto relative">
          <TrendingCars className="sticky top-0 z-10" />
          <TrendingProperties className="sticky top-[50px] z-20" />

          <MidBannerCarousel
            className="max-w-[1180px] mx-auto"
            containerClassName="sticky top-[100px] z-30"
            banners={banners}
            autoPlay={true}
            autoPlayInterval={5000}
          />
          {/* New Components */}
          <TrendingFurniture className="sticky top-[150px] z-40" />
          <TrendingProducts className="sticky top-[200px] z-50" />
          <PopularJobs className="sticky top-[250px] z-60" />

          <MidBannerCarousel
            className="max-w-[1180px] mx-auto"
            containerClassName="sticky top-[300px] z-70"
            banners={banners}
            autoPlay={true}
            autoPlayInterval={5000}
          />
          <PopularClassifieds className="sticky top-[350px] z-80" />
          <BusinessIndustries className="sticky top-[400px] z-90" />
        </div>

        {/* Footer */}
        <FloatingChatCTA />
        <Footer />
      </div>
    </main>
  );
}

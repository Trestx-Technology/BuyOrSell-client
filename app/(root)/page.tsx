import CategoryNav from "@/app/(root)/_components/CategoryNav";
import { HomeCarousel } from "./_components/home-carousel";
import { banners } from "@/constants/banners";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CategoriesCarousel from "./_components/categories-carousel";
import PopularCategories from "./_components/popular-categories";
import RecentViews from "./_components/recent-views";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CategoryNav />

      {/* Promotional Banners and Sponsored Banner */}
      <div className="max-w-[1280px] mx-auto">
        {/* Promotional Banners with Sponsored Banner */}
        <HomeCarousel banners={banners} />
      </div>

      {/* Category Carousel */}
      <CategoriesCarousel />
      <PopularCategories />

      {/* Recent Views */}
      <RecentViews />
    </main>
  );
}

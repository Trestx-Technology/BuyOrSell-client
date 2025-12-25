"use client";

import CategoryNav from "./CategoryNav";
import { HomeCarousel } from "./home-carousel";
import CategoriesCarousel from "./categories-carousel";
import PopularCategories from "./popular-categories";
import RecentViews from "./recent-views";
import HostDeals from "./host-deals";
import FloatingChatCTA from "@/components/global/flowting-ai-cta";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";
import ExchangeDeals from "./exchange-deals";
import { useHome } from "@/hooks/useHome";
import CategoryTabbedCarousel from "@/components/global/category-tabbed-carousel";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "nextjs-toploader/app";

export function HomeContent() {
  const { data: homeData, isLoading } = useHome();
  const { locale, t } = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();
  return (
    <main className="min-h-screen">
      <Navbar />
      <CategoryNav />

      <div className="max-w-[1280px] mx-auto">
        {/* Promotional Banners with Sponsored Banner */}
        <HomeCarousel />
      </div>
      <div className="max-w-[1280px] mx-auto relative">
        {/* Category Carousel */}
        {/* <CategoriesCarousel
          categoryList={homeData?.data?.categoryList}
          isLoading={isLoading}
        /> */}
        <PopularCategories
          popularCategories={homeData?.data?.popularCategories}
          isLoading={isLoading}
        />

        <div className="my-8 space-y-5">
          {/* Recent Views */}
          {homeData?.data?.recentlyViewed &&
            homeData?.data?.recentlyViewed.length > 0 && (
              <RecentViews
                recentlyViewedAds={homeData.data.recentlyViewed}
                isLoading={isLoading}
              />
            )}
          <HostDeals
            categoryTreeWithDealAds={homeData?.data?.categoryTreeWithDealAds}
            isLoading={isLoading}
          />
          <ExchangeDeals
            categoryTreeWithExchangeAds={
              homeData?.data?.categoryTreeWithExchangeAds
            }
            isLoading={isLoading}
          />
        </div>

        {/* PhonePe-Style Stacking Animation Container */}
        <div className="max-w-[1280px] mx-auto relative">
          {homeData?.data.subCategoryList?.map((category, i) => {
            // Calculate dynamic sticky positioning
            // Top pattern: 0, 50, 150, 200, 250, 300, 350, 400, 450...
            // - First: 0
            // - Second: 50
            // - Third and beyond: 50 + index * 50
            const calculateTop = (index: number): number => {
              if (index === 0) return 0;
              if (index === 1) return 50;
              // For index 2+: 50 + index * 50
              // index 2: 50 + 2 * 50 = 150 ✓
              // index 3: 50 + 3 * 50 = 200 ✓
              // index 4: 50 + 4 * 50 = 250 ✓
              return 50 + index * 50;
            };

            // Z-index pattern: 10, 20, 40, 50, 60, 70, 80, 90, 100...
            // - First: 10
            // - Second: 20
            // - Third: 40 (jump of 20)
            // - Fourth and beyond: 40 + (index - 2) * 10 = 50, 60, 70, 80, 90, 100...
            const calculateZIndex = (index: number): number => {
              if (index === 0) return 10;
              if (index === 1) return 20;
              if (index === 2) return 40;
              // For index 3+: 40 + (index - 2) * 10
              // index 3: 40 + 1 * 10 = 50 ✓
              // index 4: 40 + 2 * 10 = 60 ✓
              // index 5: 40 + 3 * 10 = 70 ✓
              return 40 + (index - 2) * 10;
            };

            const topValue = calculateTop(i);
            const zIndexValue = calculateZIndex(i);

            return (
              <div
                key={`trending-category-ads-${i}`}
                className="sticky"
                style={{
                  top: `${topValue}px`,
                  zIndex: zIndexValue,
                }}
              >
                <CategoryTabbedCarousel
                  categoryData={{
                    ...category,
                    category:
                      isArabic && category.categoryAr
                        ? category.categoryAr
                        : category.category,
                  }}
                  isLoading={isLoading}
                  showNavigation={false}
                  showViewAll={true}
                  viewAllText={t.common.viewAll}
                  onViewAll={(categoryName) =>
                    router.push(`/categories/${categoryName}`)
                  }
                  onTabChange={(tabId) => console.log("Tab changed to:", tabId)}
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <FloatingChatCTA />
      </div>
      <Footer />
    </main>
  );
}

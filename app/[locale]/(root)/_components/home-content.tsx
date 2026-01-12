"use client";

import { HomeCarousel } from "./home-carousel";
import CategoriesCarousel from "./categories-carousel";
import PopularCategories from "./popular-categories";
import RecentViews from "./recent-views";
import HostDeals from "./host-deals";
import FloatingChatCTA from "@/components/global/flowting-ai-cta";
import ExchangeDeals from "./exchange-deals";
import { useHome } from "@/hooks/useHome";
import CategoryTabbedCarousel from "@/components/global/category-tabbed-carousel";
import JobsTabbedCarousel from "@/components/global/jobs-tabbed-carousel";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "nextjs-toploader/app";

export function HomeContent() {
  const { data: homeData, isLoading } = useHome();
  const { locale, t, localePath } = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();
  return (
    <>
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

        {/* Recent Views */}
        {homeData?.data?.recentlyViewed &&
          homeData?.data?.recentlyViewed.length > 0 && (
            <RecentViews
              recentlyViewedAds={homeData.data.recentlyViewed}
              isLoading={isLoading}
            />
          )}

        {/* PhonePe-Style Stacking Animation Container */}
        {homeData?.data.subCategoryList?.map((category, i) => {
          // Check if category is "job" (case-insensitive)
          const isJobCategory =
            category.category?.toLowerCase() === "job" ||
            category.category?.toLowerCase() === "jobs" ||
            (isArabic &&
              (category.categoryAr?.toLowerCase() === "وظائف" ||
                category.categoryAr?.toLowerCase() === "وظيفة"));

          return (
            <div key={`trending-category-ads-${i}`}>
              {isJobCategory ? (
                <JobsTabbedCarousel
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
                    router.push(localePath("/jobs/listing"))
                  }
                  onTabChange={(tabId) => console.log("Tab changed to:", tabId)}
                />
              ) : (
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
              )}
            </div>
          );
        })}

        {/* Footer */}
        <FloatingChatCTA />
      </div>
    </>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useAds } from "@/hooks/useAds";
import { useJobSubcategories } from "@/hooks/useCategories";
import JobsTabbedCarousel from "@/components/global/jobs-tabbed-carousel";
import { CategoryWithSubCategories, HomeSubCategory } from "@/interfaces/home.types";
import { AD } from "@/interfaces/ad";
import { Container1080 } from "@/components/layouts/container-1080";
import { slugify } from "@/utils/slug-utils";

export default function JobsTabbedSection({ title, titleClassName }: { title?: string, titleClassName?: string }) {
      const router = useRouter();
      const { locale, localePath } = useLocale();
      const isArabic = locale === "ar";

      // Fetch job subcategories for tabs
      const { data: jobSubcategories, isLoading: isCategoriesLoading } = useJobSubcategories({
            adType: "job",
      });

      const [activeTabId, setActiveTabId] = useState<string | null>(null);
      const [adsMap, setAdsMap] = useState<Record<string, AD[]>>({});

      // Initialize active tab when categories are loaded
      useEffect(() => {
            if (jobSubcategories && jobSubcategories.length > 0 && !activeTabId) {
                  setActiveTabId(jobSubcategories[0]._id);
            }
      }, [jobSubcategories, activeTabId]);

      // Get active tab object
      const activeTab = useMemo(() => {
            return jobSubcategories?.find((tab) => tab._id === activeTabId);
      }, [jobSubcategories, activeTabId]);

      // Fetch ads for the active tab
      const { data: adsData, isLoading: isAdsLoading } = useAds({
            category: activeTab?.name,
            limit: 10,
            adType: "JOB",
      });

      // Update adsMap when ads are fetched
      useEffect(() => {
            if (activeTabId && adsData?.data?.adds) {
                  const ads = adsData.data.adds;
                  setAdsMap((prev) => ({
                        ...prev,
                        [activeTabId]: ads as AD[],
                  }));
            }
      }, [activeTabId, adsData]);

      // Construct categoryData for JobsTabbedCarousel
      const categoryData = useMemo((): CategoryWithSubCategories | null => {
            if (!jobSubcategories) return null;

            const subCategories: HomeSubCategory[] = jobSubcategories.map((tab) => ({
                  _id: tab._id,
                  name: tab.name,
                  nameAr: tab.nameAr,
                  icon: tab.icon || null,
                  image: tab.image || null,
                  banner: null,
                  desc: tab.desc,
                  descAr: tab.descAr,
                  fieldsCount: 0,
                  ads: adsMap[tab._id] || [],
            }));

            return {
                  category: "Jobs",
                  categoryAr: "وظائف",
                  subCategory: subCategories,
            };
      }, [jobSubcategories, adsMap]);

      if (!categoryData || jobSubcategories?.length === 0) return null;

      return (
            <Container1080>
                  <JobsTabbedCarousel
                        categoryData={categoryData}
                        titleClassName={titleClassName}
                        isLoading={isCategoriesLoading || (isAdsLoading && !adsMap[activeTabId || ""])}
                        showNavigation={false}
                        showViewAll={true}
                        title={title}
                        viewAllText={locale === "ar" ? "عرض الكل" : "View all"}
                        onViewAll={(categoryName) =>
                              router.push(localePath(`/jobs/listing/Jobs/${slugify(categoryName)}`))
                        }
                        onTabChange={(tabId) => setActiveTabId(tabId)}
                  />
            </Container1080>
      );
}

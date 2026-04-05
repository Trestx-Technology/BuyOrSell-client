"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useAds } from "@/hooks/useAds";
import { AD } from "@/interfaces/ad";
import { Container1080 } from "@/components/layouts/container-1080";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { CardsCarousel } from "@/components/global/cards-carousel";
import JobCard from "@/app/[locale]/(root)/jobs/my-profile/_components/job-card";
import ListingCardSkeleton from "@/components/global/listing-card-skeleton";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/utils/animation-variants";

interface LatestJobsCarouselProps {
  title?: string;
  titleClassName?: string;
}

export default function LatestJobsCarousel({
  title,
  titleClassName,
}: LatestJobsCarouselProps) {
  const router = useRouter();
  const { locale, localePath } = useLocale();

  // Fetch latest jobs
  const { data: adsData, isLoading } = useAds({
    adType: "JOB",
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const jobs = useMemo(() => {
    // According to the screenshot, the structure is response.data.adds
    // and useAds returns response.data (the body)
    // If the body itself has a 'data' key, we access that.
    const raw = adsData as any;
    const items =
      raw?.data?.adds || raw?.adds || raw?.data?.ads || raw?.ads || [];
    return (Array.isArray(items) ? items : []) as AD[];
  }, [adsData]);

  return (
    <Container1080>
      <section className="py-12">
        <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
          <Typography
            variant="lg-black-inter"
            className={`text-2xl sm:text-3xl font-bold text-dark-blue dark:text-white ${titleClassName}`}
          >
            {title || (locale === "ar" ? "أحدث الوظائف" : "Latest Jobs")}
          </Typography>
          <Button
            variant="ghost"
            className="text-purple font-semibold hover:underline bg-transparent"
            size={"sm"}
            onClick={() => router.push(localePath("/jobs/listing/Jobs"))}
          >
            {locale === "ar" ? "عرض الكل" : "View all"}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden pt-4 px-4 sm:px-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-[0_0_280px] sm:flex-[0_0_260px] min-w-0">
                <ListingCardSkeleton />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CardsCarousel
              showNavigation={true}
              breakpoints={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
                wide: 4,
              }}
              className="lg:px-0"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={itemVariants}
                  className="flex-[0_0_280px] sm:flex-[0_0_260px] min-w-0 py-2"
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </CardsCarousel>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
            <Typography className="text-gray-500">
              {locale === "ar"
                ? "لا توجد وظائف متاحة حالياً"
                : "No jobs available at the moment."}
            </Typography>
          </div>
        )}
      </section>
    </Container1080>
  );
}

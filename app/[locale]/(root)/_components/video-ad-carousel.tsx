"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useAds } from "@/hooks/useAds";
import { Video, VideoCard } from "./video-card";
import { useLocale } from "@/hooks/useLocale";
import { Container1280 } from "@/components/layouts/container-1280";

export function VideoAdCarousel() {
      const { data: adsData, isLoading } = useAds({ hasVideo: true, limit: 10 });

      const [emblaRef, emblaApi] = useEmblaCarousel({
            slidesToScroll: 1,
            containScroll: "trimSnaps",
            align: "start",
            loop: false,
      });

      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
            if (!emblaApi) return;

            const onSelect = () => {
                  setCanScrollPrev(emblaApi.canScrollPrev());
                  setCanScrollNext(emblaApi.canScrollNext());
            };

            onSelect();
            emblaApi.on("select", onSelect);
            emblaApi.on("reInit", onSelect);

            return () => {
                  emblaApi.off("select", onSelect);
                  emblaApi.off("reInit", onSelect);
            };
      }, [emblaApi]);

      const scrollPrev = React.useCallback(() => {
            if (emblaApi) emblaApi.scrollPrev();
      }, [emblaApi]);

      const scrollNext = React.useCallback(() => {
            if (emblaApi) emblaApi.scrollNext();
      }, [emblaApi]);

      const ads = adsData?.data?.adds || adsData?.ads || [];

      // Map AD to Video interface
      const videoAds: Video[] = ads.map((ad) => ({
            id: ad._id,
            title: ad.title,
            description: ad.description,
            thumbnail: ad.images[0] || "",
            videoUrl: ad.videoUrl || "",
            views: ad.views?.toString() || "0",
      }));

      if (!isLoading && videoAds.length === 0) return null;

      return (
            <section className="max-w-[1180px] mx-auto w-full py-8">
                  <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-purple fill-current" />
                              </div>
                              <div>
                                    <h2 className="text-2xl font-bold text-foreground">Featured Video Ads</h2>
                                    <p className="text-sm text-muted-foreground">Watch and discover great deals</p>
                              </div>
                        </div>

                        <div className="flex gap-2">

                        </div>
                  </div>

                  <div className="relative">
                        <Button
                              variant="outline"
                              size="icon"
                              onClick={scrollPrev}
                              disabled={!canScrollPrev}
                              className="rounded-full z-10 px-2 hidden left-0 absolute top-1/2 -translate-y-1/2 sm:flex"
                              icon={<ChevronLeft />}
                              iconPosition="center"
                        >
                        </Button>

                        <div className="overflow-hidden px-4" ref={emblaRef}>
                              <div className="flex gap-4">
                                    {isLoading
                                          ? Array.from({ length: 4 }).map((_, i) => (
                                                <div
                                                      key={i}
                                                      className="flex-shrink-0 w-72 sm:w-80 aspect-4/3 rounded-xl bg-muted animate-pulse"
                                                />
                                          ))
                                          : videoAds.map((video, index) => (
                                                <VideoCard key={video.id} video={video} index={index} />
                                          ))}
                              </div>
                        </div>
                        <Button
                              variant="outline"
                              size="icon"
                              onClick={scrollNext}
                              disabled={!canScrollNext}
                              className="rounded-full z-10 px-2 hidden right-0 absolute top-1/2 -translate-y-1/2 sm:flex"
                              icon={<ChevronRight />}
                              iconPosition="center"
                        >
                        </Button>
                  </div>
            </section>
      );
}

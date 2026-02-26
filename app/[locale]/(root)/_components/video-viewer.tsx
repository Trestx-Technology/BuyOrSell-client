"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
      ArrowLeft,
      Volume2,
      VolumeX,
      ChevronUp,
      ChevronDown,
      Play,
      Pause,
      Heart,
      Share2,
      MoreVertical,
      User,
} from "lucide-react";
import { useInfiniteAds, useAdById } from "@/hooks/useAds";
import { Video } from "./video-card";
import { InfiniteScrollContainer } from "@/components/global/infinite-scroll-container";
import { useGetMainCategories } from "@/hooks/useCategories";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CollectionManager } from "@/components/global/collection-manager";
import { NoDataCard } from "@/components/global/fallback-cards";
import { useQueryClient } from "@tanstack/react-query";
import { adQueries } from "@/app/api/ad/index";
import { Skeleton } from "@/components/ui/skeleton";

function VideoViewerSkeleton() {
      return (
            <div className="h-full w-full snap-center relative flex-shrink-0">
                  <div className="relative w-full h-full sm:h-[90%] sm:max-w-md sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4">
                        <Skeleton className="w-full h-full sm:aspect-[9/16] sm:rounded-2xl bg-zinc-900" />

                        {/* Video Info Skeleton */}
                        <div className="absolute bottom-10 left-8 right-20 z-20 space-y-2 pointer-events-none">
                              <Skeleton className="h-6 w-3/4 bg-white/10" />
                              <Skeleton className="h-4 w-1/2 bg-white/10" />
                              <div className="flex gap-2">
                                    <Skeleton className="h-4 w-16 rounded-full bg-white/10" />
                                    <Skeleton className="h-4 w-16 bg-white/10" />
                              </div>
                        </div>

                        {/* Sidebar Actions Skeleton */}
                        <div className="absolute right-4 bottom-20 flex flex-col gap-6 z-40 sm:right-[-40px] sm:bottom-0">
                              {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                          <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
                                          <Skeleton className="h-2 w-8 bg-white/10" />
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
}

export function VideoViewer() {
      const router = useRouter();
      const searchParams = useSearchParams();
      const queryClient = useQueryClient();
      const containerRef = useRef<HTMLDivElement>(null);
      const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

      const adId = searchParams.get("adId");
      const [initialAdId] = useState(() => searchParams.get("adId"));
      const isInitialSeekDone = useRef(false);
      const [selectedCategory, setSelectedCategory] = useState<string>("all");
      const {
            data: categoriesData,
            isLoading: isCategoriesLoading
      } = useGetMainCategories();

      const {
            data: adsData,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
      } = useInfiniteAds({
            hasVideo: true,
            limit: 10,
            category: selectedCategory === "all" ? undefined : selectedCategory
      });

      const { data: targetAdData } = useAdById(initialAdId || "");

      const videos: Video[] = useMemo(() => {
            const rawVideos = adsData?.pages.flatMap((page) => {
                  const ads = page.data?.adds || page.ads || [];
                  return ads.map((ad: any) => ({
                        id: ad._id,
                        title: ad.title,
                        description: ad.description,
                        thumbnail: ad.images?.[0] || "",
                        videoUrl: ad.videoUrl || "",
                        views: ad.views?.toString() || "0",
                        owner: ad.owner,
                        isSaved: ad.isSaved || false,
                  }));
            }) || [];

            // Case 1: No specific adId requested
            if (!initialAdId) return rawVideos;

            // Case 2: Specific adId requested. We MUST keep it at index 0 consistently.
            const targetInRaw = rawVideos.find(v => v.id === initialAdId);
            const targetInData = targetAdData?.data;

            let firstVideo: Video | null = null;
            if (targetInRaw) {
                  firstVideo = targetInRaw;
            } else if (targetInData) {
                  firstVideo = {
                        id: targetInData._id,
                        title: targetInData.title,
                        description: targetInData.description,
                        thumbnail: targetInData.images?.[0] || "",
                        videoUrl: targetInData.videoUrl || "",
                        views: targetInData.views?.toString() || "0",
                        owner: targetInData.owner,
                        isSaved: targetInData.isSaved || false,
                  };
            }

            const otherVideos = rawVideos.filter(v => v.id !== initialAdId);

            // If we have the target OR if we have raw ads and need to reserve the first slot
            if (firstVideo) {
                  return [firstVideo, ...otherVideos];
            } else if (rawVideos.length > 0) {
                  // Reserve slot with a placeholder to prevent list shifting later
                  return [{ id: initialAdId, videoUrl: "", isPlaceholder: true } as any, ...otherVideos];
            }

            return rawVideos;
      }, [adsData, targetAdData, initialAdId]);

      const [currentIndex, setCurrentIndex] = useState(0);
      const [isMuted, setIsMuted] = useState(true);
      const [isPlaying, setIsPlaying] = useState(true);
      const [isTransitioning, setIsTransitioning] = useState(false);
      const [durations, setDurations] = useState<Record<string, string>>({});
      const [progress, setProgress] = useState(0);
      const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});
      const isAutoScrollingRef = useRef(false);
      const lastScrolledIndex = useRef(0);

      const formatTime = (time: number) => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };

      const handleTimeUpdate = useCallback(
            (id: string, e: React.SyntheticEvent<HTMLVideoElement>) => {
                  const video = e.currentTarget;
                  if (video.duration) {
                        const currentProgress = (video.currentTime / video.duration) * 100;
                        setProgress(currentProgress);
                        setCurrentTimes((prev) => ({
                              ...prev,
                              [id]: formatTime(video.currentTime),
                        }));
                  }
            },
            []
      );

      const handleSeek = useCallback(
            (
                  index: number,
                  e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
            ) => {
                  e.stopPropagation();
                  const video = videoRefs.current[index];
                  if (!video) return;

                  const rect = e.currentTarget.getBoundingClientRect();
                  let clickX;
                  if ("touches" in e) {
                        clickX = e.touches[0].clientX - rect.left;
                  } else {
                        clickX = e.clientX - rect.left;
                  }

                  const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                  video.currentTime = percentage * video.duration;
                  setProgress(percentage * 100);
            },
            []
      );

      const handleLoadedMetadata = useCallback(
            (id: string, e: React.SyntheticEvent<HTMLVideoElement>) => {
                  const video = e.currentTarget;
                  const duration = video.duration;
                  if (duration && !isNaN(duration)) {
                        const minutes = Math.floor(duration / 60);
                        const seconds = Math.floor(duration % 60);
                        const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
                        setDurations((prev) => ({ ...prev, [id]: formatted }));
                  }
            },
            []
      );

      // Set initial index based on initialAdId once
      useEffect(() => {
            if (initialAdId && videos.length > 0 && !isInitialSeekDone.current) {
                  const index = videos.findIndex((v) => v.id === initialAdId);
                  if (index !== -1) {
                        setCurrentIndex(index);
                        isInitialSeekDone.current = true;
                  }
            }
      }, [initialAdId, videos]);

      // Navigate to video
      const goToVideo = useCallback(
            (index: number) => {
                  if (index < 0 || index >= videos.length || isTransitioning) return;

                  setIsTransitioning(true);
                  setCurrentIndex(index);

                  // Update URL
                  const params = new URLSearchParams(window.location.search);
                  params.set("adId", videos[index].id);
                  window.history.replaceState(null, "", `?${params.toString()}`);

                  // Scroll will be handled by the currentIndex useEffect
                  // Reset transitioning after a delay
                  setTimeout(() => setIsTransitioning(false), 800);
            },
            [isTransitioning, videos]
      );

      // Use IntersectionObserver to track the current visible video
      useEffect(() => {
            const container = containerRef.current;
            if (!container || videos.length === 0) return;

            const observerOptions = {
                  root: container,
                  threshold: 0.5,
            };

            const observerCallback = (entries: IntersectionObserverEntry[]) => {
                  if (isAutoScrollingRef.current) return;

                  // Find the entry that is most visible
                  const visibleEntry = entries.find(e => e.isIntersecting);
                  if (visibleEntry) {
                        const index = parseInt(visibleEntry.target.getAttribute("data-index") || "0");
                        if (index !== currentIndex) {
                              // If we are performing initial seek, ignore observer triggers for index 0
                              if (index === 0 && !isInitialSeekDone.current) return;

                              setCurrentIndex(index);

                              // Update URL silently
                              const params = new URLSearchParams(window.location.search);
                              if (params.get("adId") !== videos[index]?.id) {
                                    params.set("adId", videos[index].id);
                                    window.history.replaceState(null, "", `?${params.toString()}`);
                              }
                        }
                  }
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            const elements = container.querySelectorAll("[data-video-container]");
            elements.forEach((el) => observer.observe(el));

            return () => {
                  observer.disconnect();
            };
      }, [videos, currentIndex]);

      // Handle programmatic scroll to current index
      useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const itemHeight = container.clientHeight;
            if (itemHeight === 0) return;

            const targetScrollTop = currentIndex * itemHeight;

            // Only scroll if we're not already there (within a small threshold)
            if (Math.abs(container.scrollTop - targetScrollTop) > 10) {
                  isAutoScrollingRef.current = true;

                  container.scrollTo({
                        top: targetScrollTop,
                        behavior: "smooth",
                  });

                  // Reset auto-scrolling flag after transition
                  const timer = setTimeout(() => {
                        isAutoScrollingRef.current = false;
                  }, 800);

                  return () => clearTimeout(timer);
            }
      }, [currentIndex]);

      const togglePlay = useCallback(() => {
            setIsPlaying((prev) => !prev);
      }, []);

      // Auto-play when switching videos
      useEffect(() => {
            setIsPlaying(true);
            setProgress(0);
            setCurrentTimes({});
      }, [currentIndex]);

      // Video playback control
      useEffect(() => {
            videoRefs.current.forEach((video, index) => {
                  if (!video) return;

                  if (index === currentIndex) {
                        if (isPlaying) {
                              video.play().catch(() => { });
                        } else {
                              video.pause();
                        }
                        video.muted = isMuted;
                  } else {
                        video.pause();
                        video.currentTime = 0;
                  }
            });
      }, [currentIndex, isMuted, isPlaying, videos]);

      // Keyboard navigation
      useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.key === "ArrowDown" || e.key === "j") {
                        goToVideo(currentIndex + 1);
                  } else if (e.key === "ArrowUp" || e.key === "k") {
                        goToVideo(currentIndex - 1);
                  } else if (e.key === "Escape") {
                        router.back();
                  } else if (e.key === "m") {
                        setIsMuted((prev) => !prev);
                  } else if (e.key === " ") {
                        e.preventDefault();
                        togglePlay();
                  }
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
      }, [currentIndex, goToVideo, router, togglePlay]);
      const handleShare = (video: Video) => {
            if (navigator.share) {
                  navigator.share({
                        title: video.title,
                        text: video.description,
                        url: window.location.href,
                  }).catch(() => { });
            } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
            }
      };



      return (
            <div className="fixed flex flex-col h-dvh inset-0 bg-black z-50 overflow-hidden hide-scrollbar">
                  {/* Header Controls */}
                  <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                        <button
                              onClick={() => router.back()}
                              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                              <ArrowLeft className="w-6 h-6" />
                              <span className="text-sm font-medium hidden sm:inline">Back</span>
                        </button>

                        <div className="flex-1 max-w-[200px] mx-4">
                              <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                              >
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-md h-9">
                                          <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                          <SelectItem value="all">All Categories</SelectItem>
                                          {categoriesData?.map((category) => (
                                                <SelectItem key={category._id} value={category.name}>
                                                      {category.name}
                                                </SelectItem>
                                          ))}
                                    </SelectContent>
                              </Select>
                        </div>

                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white sm:hidden">
                              <MoreVertical className="w-5 h-5" />
                        </button>
                  </div>

                  {/* Content Area */}
                  {isLoading ? (
                        <div className="h-full w-full flex flex-col overflow-hidden">
                              <VideoViewerSkeleton />
                        </div>
                  ) : videos.length > 0 ? (
                        <InfiniteScrollContainer
                        ref={containerRef}
                        onLoadMore={async () => {
                              if (hasNextPage && !isFetchingNextPage) {
                                    await fetchNextPage();
                              }
                        }}
                        isLoading={isFetchingNextPage}
                        hasMore={hasNextPage}
                                    className="h-full w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar overscroll-none"
                                    style={{
                                          scrollSnapType: "y mandatory",
                                          WebkitOverflowScrolling: "touch",
                                    }}
                  >
                        {videos.map((video, index) => (
                              <div
                                    key={`${video.id}-${index}`}
                                    data-video-container
                                    data-index={index}
                                    className="h-full w-full snap-center snap-always relative flex-shrink-0 transform-gpu"
                              >
                                    {/* Mobile: Full screen cover | Desktop: Centered with aspect ratio */}
                                    <div className="relative w-full h-full sm:h-[90%] sm:max-w-md sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4">
                                          {/* Video Content Wrapper */}
                                          <div
                                                className="relative w-full h-full sm:aspect-[9/16] sm:rounded-2xl overflow-hidden sm:shadow-2xl bg-black cursor-pointer"
                                                onClick={togglePlay}
                                          >
                                                <video
                                                      ref={(el) => {
                                                            videoRefs.current[index] = el;
                                                      }}
                                                      src={video.videoUrl}
                                                      poster={video.thumbnail}
                                                      loop
                                                      playsInline
                                                      muted={isMuted}
                                                      preload={Math.abs(index - currentIndex) <= 1 ? "auto" : "none"}
                                                      onLoadedMetadata={(e) => handleLoadedMetadata(video.id, e)}
                                                      onTimeUpdate={(e) => handleTimeUpdate(video.id, e)}
                                                      className={cn(
                                                            "w-full h-full object-cover",
                                                            !video.videoUrl && "opacity-0"
                                                      )}
                                                />

                                                {/* Play/Pause Indicator Overlay */}
                                                {!isPlaying && index === currentIndex && (
                                                      <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
                                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-in zoom-in duration-200">
                                                                  <Play className="w-8 h-8 text-white fill-white" />
                                                            </div>
                                                      </div>
                                                )}

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                                                {/* Video Info (Left Bottom) */}
                                                <div className="absolute bottom-4 left-4 right-16 z-20 pointer-events-none">
                                                      <h2 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-lg">
                                                            {video.title}
                                                      </h2>
                                                      <p className="text-white/80 text-sm line-clamp-2 drop-shadow-md">
                                                            {video.description}
                                                      </p>
                                                      <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                                  {video.views} views
                                                            </span>
                                                            {durations[video.id] && (
                                                                  <span className="text-xs text-white/40">
                                                                        {currentTimes[video.id] || "0:00"} / {durations[video.id]}
                                                                  </span>
                                                            )}
                                                      </div>
                                                </div>

                                                {/* Progress Bar Container */}
                                                <div
                                                      className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 cursor-pointer z-30"
                                                      onClick={(e) => handleSeek(index, e)}
                                                >
                                                      <div
                                                            className="h-full bg-purple"
                                                            style={{ width: `${index === currentIndex ? progress : 0}%` }}
                                                      />
                                                </div>
                                          </div>

                                          {/* Sidebar Toolbar (Right Side) */}
                                          <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 z-40 sm:right-[-48px] sm:bottom-0">
                                                {/* Profile Circle */}
                                                <div className="flex flex-col items-center gap-1 group">
                                                      <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800 flex items-center justify-center transition-transform active:scale-90">
                                                            {video.owner?.image ? (
                                                                  <img src={video.owner.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                  <User className="w-6 h-6 text-white/50" />
                                                            )}
                                                      </div>
                                                </div>

                                                {/* Like/Save */}
                                                <div className="flex flex-col items-center gap-1">
                                                      <CollectionManager
                                                            itemId={video.id}
                                                            itemTitle={video.title}
                                                            itemImage={video.thumbnail}
                                                            onSuccess={() => {
                                                                  queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
                                                            }}
                                                      >
                                                            <button
                                                                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
                                                            >
                                                                  <Heart className={cn("w-6 h-6", video.isSaved && "fill-red-500 text-red-500")} />
                                                            </button>
                                                      </CollectionManager>
                                                      <span className="text-[10px] font-medium text-white drop-shadow-sm uppercase">Save</span>
                                                </div>

                                                {/* Play/Pause */}
                                                <div className="flex flex-col items-center gap-1">
                                                      <button
                                                            onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  togglePlay();
                                                            }}
                                                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
                                                      >
                                                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                                                      </button>
                                                      <span className="text-[10px] font-medium text-white drop-shadow-sm uppercase">
                                                            {isPlaying ? "Pause" : "Play"}
                                                      </span>
                                                </div>

                                                {/* Mute/Unmute */}
                                                <div className="flex flex-col items-center gap-1">
                                                      <button
                                                            onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  setIsMuted(!isMuted);
                                                            }}
                                                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
                                                      >
                                                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                                      </button>
                                                      <span className="text-[10px] font-medium text-white drop-shadow-sm uppercase">
                                                            {isMuted ? "Mute" : "Unmute"}
                                                      </span>
                                                </div>

                                                {/* Share */}
                                                <div className="flex flex-col items-center gap-1">
                                                      <button
                                                            onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  handleShare(video);
                                                            }}
                                                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
                                                      >
                                                            <Share2 className="w-6 h-6" />
                                                      </button>
                                                      <span className="text-[10px] font-medium text-white drop-shadow-sm uppercase">Share</span>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        ))}
                              </InfiniteScrollContainer>
                  ) : !isLoading && (
                        <div className="flex-1 flex items-center justify-center p-6 text-center">
                              <NoDataCard
                                    title="No Videos Found"
                                    description={`We couldn't find any video ads in the ${selectedCategory === "all" ? "selected" : `"${selectedCategory}"`} category. Try another one!`}
                                    className="text-white [&_h1]:text-white [&_p]:text-white/60"
                              />
                        </div>
                  )}

                  {/* Desktop Navigation Indicators */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-40">
                        <button
                              onClick={() => goToVideo(currentIndex - 1)}
                              disabled={currentIndex === 0}
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 disabled:opacity-20 hover:bg-white/20 transition-all"
                        >
                              <ChevronUp className="w-6 h-6 text-white" />
                        </button>

                        <div className="flex flex-col gap-2 py-4">
                              {videos.map((_, index) => {
                                    // Only show up to 10 dots centered around current index
                                    const shouldShow = Math.abs(index - currentIndex) <= 5;
                                    if (!shouldShow) return null;

                                    return (
                                          <button
                                                key={index}
                                                onClick={() => goToVideo(index)}
                                                className={cn(
                                                      "w-1 rounded-full transition-all duration-300",
                                                      index === currentIndex ? "bg-purple h-8" : "bg-white/20 hover:bg-white/40 h-1.5"
                                                )}
                                          />
                                     );
                               })}
                        </div>

                        <button
                              onClick={() => goToVideo(currentIndex + 1)}
                              disabled={currentIndex === videos.length - 1}
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 disabled:opacity-20 hover:bg-white/20 transition-all"
                        >
                              <ChevronDown className="w-6 h-6 text-white" />
                        </button>
                  </div>
            </div>
      );
}

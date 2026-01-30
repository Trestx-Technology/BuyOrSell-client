"use client";

import { useRef, useEffect, useState, useCallback, TouchEvent, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Volume2, VolumeX, ChevronUp, ChevronDown, Play, Pause } from "lucide-react";
import { useInfiniteAds } from "@/hooks/useAds";
import { Video } from "./video-card";
import { InfiniteScrollContainer } from "@/components/global/infinite-scroll-container";

export function VideoViewer() {
      const router = useRouter();
      const searchParams = useSearchParams();
      const containerRef = useRef<HTMLDivElement>(null);
      const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

      const {
            data: adsData,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading
      } = useInfiniteAds({ hasVideo: true, limit: 10 });

      // Map AD to Video interface
      const videos: Video[] = useMemo(() => {
            return adsData?.pages.flatMap((page) => {
                  const ads = page.data?.adds || page.ads || [];
                  return ads.map((ad: any) => ({
                        id: ad._id,
                        title: ad.title,
                        description: ad.description,
                        thumbnail: ad.images[0] || "",
                        videoUrl: ad.videoUrl || "",
                        views: ad.views?.toString() || "0",
                  }));
            }) || [];
      }, [adsData]);

      const adId = searchParams.get("adId");
      const [currentIndex, setCurrentIndex] = useState(0);
      const [isMuted, setIsMuted] = useState(true);
      const [isPlaying, setIsPlaying] = useState(true);
      const [isTransitioning, setIsTransitioning] = useState(false);
      const [durations, setDurations] = useState<Record<number, string>>({});
      const [progress, setProgress] = useState(0);
      const [currentTimes, setCurrentTimes] = useState<Record<number, string>>({});

      const formatTime = (time: number) => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };

      const handleTimeUpdate = useCallback((index: number, e: React.SyntheticEvent<HTMLVideoElement>) => {
            const video = e.currentTarget;
            if (video.duration) {
                  const currentProgress = (video.currentTime / video.duration) * 100;
                  setProgress(currentProgress);
                  setCurrentTimes(prev => ({ ...prev, [index]: formatTime(video.currentTime) }));
            }
      }, []);

      const handleSeek = useCallback((index: number, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            e.stopPropagation();
            const video = videoRefs.current[index];
            if (!video) return;

            const rect = e.currentTarget.getBoundingClientRect();
            let clickX;
            if ('touches' in e) {
                  clickX = e.touches[0].clientX - rect.left;
            } else {
                  clickX = e.clientX - rect.left;
            }

            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            video.currentTime = percentage * video.duration;
            setProgress(percentage * 100);
      }, []);

      const handleLoadedMetadata = useCallback((index: number, e: React.SyntheticEvent<HTMLVideoElement>) => {
            const video = e.currentTarget;
            const duration = video.duration;
            if (duration && !isNaN(duration)) {
                  const minutes = Math.floor(duration / 60);
                  const seconds = Math.floor(duration % 60);
                  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
                  setDurations(prev => ({ ...prev, [index]: formatted }));
            }
      }, []);

      // Touch handling
      const touchStartY = useRef(0);
      const touchEndY = useRef(0);

      // Set initial index based on adId
      useEffect(() => {
            if (adId && videos.length > 0) {
                  const index = videos.findIndex(v => v.id === adId);
                  if (index !== -1 && index !== currentIndex) {
                        setCurrentIndex(index);
                  }
            }
      }, [adId, videos]);

      // Navigate to video
      const goToVideo = useCallback((index: number) => {
            if (index < 0 || index >= videos.length || isTransitioning) return;

            setIsTransitioning(true);
            setCurrentIndex(index);

            // Update URL without full reload
            const params = new URLSearchParams(window.location.search);
            params.set("adId", videos[index].id);
            window.history.replaceState(null, "", `?${params.toString()}`);

            setTimeout(() => setIsTransitioning(false), 400);
      }, [isTransitioning, videos]);

      // Scroll snap handling
      useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const handleScroll = () => {
                  const scrollTop = container.scrollTop;
                  const itemHeight = container.clientHeight;
                  if (itemHeight === 0) return;
                  const newIndex = Math.round(scrollTop / itemHeight);

                  if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
                        setCurrentIndex(newIndex);
                        const params = new URLSearchParams(window.location.search);
                        params.set("adId", videos[newIndex].id);
                        window.history.replaceState(null, "", `?${params.toString()}`);
                  }
            };

            container.addEventListener("scroll", handleScroll, { passive: true });
            return () => container.removeEventListener("scroll", handleScroll);
      }, [currentIndex, videos.length, videos]);

      // Auto-scroll to current video on mount or when currentIndex changes
      useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            container.scrollTo({
                  top: currentIndex * container.clientHeight,
                  behavior: "smooth",
            });
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
      }, [currentIndex, isMuted, isPlaying]);

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

      // Lock body scroll
      useEffect(() => {
            document.body.style.overflow = "hidden";
            return () => {
                  document.body.style.overflow = "unset";
            };
      }, []);

      // Touch handlers
      const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
      };

      const handleTouchMove = (e: TouchEvent) => {
            touchEndY.current = e.touches[0].clientY;
      };

      const handleTouchEnd = () => {
            const diff = touchStartY.current - touchEndY.current;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                  if (diff > 0) {
                        // Swipe up - next video
                        goToVideo(currentIndex + 1);
                  } else {
                        // Swipe down - previous video
                        goToVideo(currentIndex - 1);
                  }
            }
      };

      // Wheel handler for trackpad
      const wheelTimeout = useRef<any>(null);
      const handleWheel = useCallback((e: React.WheelEvent) => {
            if (wheelTimeout.current) return;

            wheelTimeout.current = setTimeout(() => {
                  wheelTimeout.current = null;
            }, 500);

            if (e.deltaY > 30) {
                  goToVideo(currentIndex + 1);
            } else if (e.deltaY < -30) {
                  goToVideo(currentIndex - 1);
            }
      }, [currentIndex, goToVideo]);

      if (isLoading && videos.length === 0) {
            return (
                  <div className="fixed inset-0 bg-background flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
            );
      }

      return (
            <div className="fixed flex flex-col h-dvh inset-0 bg-black z-50 overflow-hidden hide-scrollbar">
                  {/* Header Controls */}
                  <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                        <button
                              onClick={() => router.back()}
                              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                              <ArrowLeft className="w-6 h-6" />
                              <span className="text-sm font-medium">Back</span>
                        </button>

                        <div className="flex items-center gap-3">
                              <button
                                    onClick={(e) => {
                                          e.stopPropagation();
                                          togglePlay();
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                              >
                                    {isPlaying ? (
                                          <Pause className="w-5 h-5 text-white" />
                                    ) : (
                                          <Play className="w-5 h-5 text-white fill-current" />
                                    )}
                              </button>
                              <button
                                    onClick={(e) => {
                                          e.stopPropagation();
                                          setIsMuted((prev) => !prev);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                              >
                                    {isMuted ? (
                                          <VolumeX className="w-5 h-5 text-white" />
                                    ) : (
                                          <Volume2 className="w-5 h-5 text-white" />
                                    )}
                              </button>
                        </div>
                  </div>

                  {/* Video Container */}
                  <InfiniteScrollContainer
                        ref={containerRef}
                        onLoadMore={async () => {
                              if (hasNextPage && !isFetchingNextPage) {
                                    await fetchNextPage();
                              }
                        }}
                        isLoading={isFetchingNextPage}
                        hasMore={hasNextPage}
                        className="h-full w-full overflow-y-auto snap-mandatory hide-scrollbar"
                        style={{ scrollSnapType: "y mandatory" }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onWheel={handleWheel}
                  >
                        {videos.map((video, index) => (
                              <div
                                    key={`${video.id}-${index}`}
                                    className="h-full w-full snap-center relative flex-shrink-0"
                              >
                                    {/* Mobile: Full screen cover | Desktop: Centered with aspect ratio */}
                                    <div className="relative w-full h-full sm:h-auto sm:max-w-md sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4">
                                          {/* Video Container */}
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
                                                      // Preload current, previous, and next videos
                                                      preload={Math.abs(index - currentIndex) <= 1 ? "auto" : "none"}
                                                      onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                                                      onTimeUpdate={(e) => handleTimeUpdate(index, e)}
                                                      className="w-full h-full object-cover"
                                                />

                                                {/* Play/Pause Indicator Overlay */}
                                                {!isPlaying && index === currentIndex && (
                                                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-in zoom-in duration-200">
                                                                  <Play className="w-10 h-10 text-white fill-purple" />
                                                            </div>
                                                      </div>
                                                )}

                                                {/* Gradient Overlay for text readability */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />

                                                {/* Progress Bar Container */}
                                                <div
                                                      className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 cursor-pointer group/progress z-30"
                                                      onClick={(e) => handleSeek(index, e)}
                                                >
                                                      <div
                                                            className="h-full bg-purple transition-all duration-100 relative"
                                                            style={{ width: `${index === currentIndex ? progress : 0}%` }}
                                                      >
                                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                                                      </div>
                                                </div>

                                                {/* Mobile Video Info Overlay - Positioned at bottom */}
                                                <div className="absolute bottom-1.5 left-0 right-0 p-4 pb-12 sm:hidden z-10">
                                                      <h2 className="text-xl font-bold text-white drop-shadow-lg">{video.title}</h2>
                                                      <p className="text-sm text-white/90 mt-2 line-clamp-2 drop-shadow-md">{video.description}</p>
                                                      <div className="flex items-center gap-3 mt-3">
                                                            <span className="text-xs text-white/70">{video.views} views</span>
                                                            {durations[index] && (
                                                                  <span className="text-xs text-white/70">
                                                                        • {currentTimes[index] || "0:00"} / {durations[index]}
                                                                  </span>
                                                            )}
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Desktop Video Info - Below video */}
                                          <div className="hidden sm:block mt-4 animate-fade-in text-white">
                                                <h2 className="text-xl font-bold">{video.title}</h2>
                                                <p className="text-sm text-white/70 mt-1 line-clamp-2">{video.description}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                      <span className="text-xs text-white/50">{video.views} views</span>
                                                      {durations[index] && (
                                                            <span className="text-xs text-white/50">
                                                                  • {currentTimes[index] || "0:00"} / {durations[index]}
                                                            </span>
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </InfiniteScrollContainer>

                  {/* Navigation Indicators - Hidden on mobile for cleaner view */}
                  <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:gap-4 z-20">
                        <button
                              onClick={() => goToVideo(currentIndex - 1)}
                              disabled={currentIndex === 0}
                              className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                        >
                              <ChevronUp className="w-5 h-5 text-white" />
                        </button>

                        <div className="flex flex-col gap-2 py-2">
                              {videos.map((_, index) => (
                                    <button
                                          key={index}
                                          onClick={() => goToVideo(index)}
                                          className={`w-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                                ? "bg-accent h-6"
                                                : "bg-white/30 hover:bg-white/50 h-1.5"
                                                }`}
                                    />
                              ))}
                        </div>

                        <button
                              onClick={() => goToVideo(currentIndex + 1)}
                              disabled={currentIndex === videos.length - 1}
                              className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                        >
                              <ChevronDown className="w-5 h-5 text-white" />
                        </button>
                  </div>

                  {/* Swipe Hint (only on first video, mobile only) */}
                  {currentIndex === 0 && (
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 animate-pulse z-20 sm:hidden">
                              <ChevronUp className="w-5 h-5" />
                              <span className="text-xs">Swipe up</span>
                        </div>
                  )}
            </div>
      );
}

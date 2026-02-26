import { Play } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";

export interface Video {
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      videoUrl: string;
      duration?: string;
      views: string;
      owner?: any;
      isSaved?: boolean;
}

export const videos: Video[] = [];

interface VideoCardProps {
      video: Video;
      index: number;
}

export function VideoCard({ video }: VideoCardProps) {
      return (
            <Link
                  href={`/watch?adId=${video.id}`}
                  className="group relative flex-shrink-0 w-52 cursor-pointer"
            >
                  {/* Card Container */}
                  <div className="relative overflow-hidden rounded-xl video-card-gradient border border-border/50 transition-all duration-300 group-hover:border-accent/50 group-hover:glow-effect group-hover:scale-[1.02]">
                        {/* Thumbnail */}
                        <div className="relative aspect-4/3 overflow-hidden">
                              <SafeImage
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                              {/* Play Button */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                          <Play className="w-6 h-6 text-accent-foreground fill-current ml-1" />
                                    </div>
                              </div>

                              {/* Duration Badge */}
                              {video.duration && (
                                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                                          {video.duration}
                                    </div>
                              )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                              <h3 className="font-semibold text-foreground truncate group-hover:text-purple transition-colors duration-200">
                                    {video.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {video.description}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                    <span className="text-xs text-muted-foreground">{video.views} views</span>
                              </div>
                        </div>
                  </div>
            </Link>
      );
}

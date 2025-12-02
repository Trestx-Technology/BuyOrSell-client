"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadFileWithProgress } from '@/app/api/media/media.services';
import { toast } from "sonner";
import { AxiosError } from "axios";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { CircularProgress } from "./CircularProgress";
import { useMutation } from "@tanstack/react-query";
import type { UploadFileResponse } from '@/interfaces/media.types';

export interface VideoItem {
  id: string;
  url: string;
  file?: File;
  name?: string;
  presignedUrl?: string; // Final URL after upload
  uploadError?: string; // Error message if upload fails
  duration?: number; // Video duration in seconds
  uploadProgress?: number; // Upload progress percentage (0-100)
}

export interface VideoUploadProps {
  video?: VideoItem | null;
  onVideoChange?: (video: VideoItem | null) => void;
  maxFileSize?: number; // in MB
  maxDuration?: number; // in seconds
  acceptedFileTypes?: string[];
  showUploadArea?: boolean;
  className?: string;
  uploadAreaClassName?: string;
  disabled?: boolean;
}

// Helper function to get video duration
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

export function VideoUpload({
  video = null,
  onVideoChange,
  maxFileSize = 100,
  maxDuration = 30,
  acceptedFileTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
  showUploadArea = true,
  className,
  uploadAreaClassName,
  disabled = false,
}: VideoUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [dragPreviewVideo, setDragPreviewVideo] = useState<VideoItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  // Upload mutation with progress tracking
  const uploadMutation = useMutation<UploadFileResponse, AxiosError<{ message?: string }>, { file: File; videoItem: VideoItem }>({
    mutationFn: async ({ file, videoItem }) => {
      return new Promise<UploadFileResponse>((resolve, reject) => {
        uploadFileWithProgress(
          file,
          (progress) => {
            // Update progress state
            setUploadProgress(progress);
            // Update video state with progress
            const progressVideo: VideoItem = {
              ...videoItem,
              uploadError: undefined,
              uploadProgress: progress,
            };
            onVideoChange?.(progressVideo);
          }
        )
          .then((response) => {
            setUploadProgress(100);
            resolve(response);
          })
          .catch(reject);
      });
    },
    onSuccess: (response, variables) => {
      // Update with fileUrl from response (S3 URL)
      const finalVideo: VideoItem = {
        ...variables.videoItem,
        url: response.data.fileUrl, // Use fileUrl from API response
        presignedUrl: response.data.fileUrl, // Use fileUrl as the final URL
        uploadProgress: 100,
        file: undefined, // Remove file object
        uploadError: undefined,
      };
      onVideoChange?.(finalVideo);
      setUploadProgress(0); // Reset progress
    },
    onError: (error, variables) => {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to upload video";
      
      // Mark as error
      const errorVideo: VideoItem = {
        ...variables.videoItem,
        uploadError: errorMessage,
        uploadProgress: 0,
      };
      onVideoChange?.(errorVideo);
      toast.error(`Failed to upload ${variables.videoItem.name}: ${errorMessage}`);
      setUploadProgress(0); // Reset progress
    },
  });

  // Initialize Video.js player
  useEffect(() => {
    if (videoRef.current && video?.presignedUrl && !uploadMutation.isPending && !video.uploadError) {
      // Initialize player
      if (!playerRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          responsive: false,
          fluid: false,
          width: '100%',
          height: '100%',
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          sources: [{
            src: video.presignedUrl,
            type: 'video/mp4',
          }],
        });
      } else {
        // Update source if URL changes
        playerRef.current.src({
          src: video.presignedUrl,
          type: 'video/mp4',
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [video?.presignedUrl, uploadMutation.isPending, video?.uploadError]);

  // Upload a single video using mutation
  const uploadVideo = useCallback(
    (videoItem: VideoItem) => {
      if (!videoItem.file) return;

      // Initialize progress
      setUploadProgress(0);
      const initialVideo: VideoItem = {
        ...videoItem,
        uploadError: undefined,
        uploadProgress: 0,
      };
      onVideoChange?.(initialVideo);

      // Start mutation
      uploadMutation.mutate({ file: videoItem.file, videoItem });
    },
    [onVideoChange, uploadMutation]
  );

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || disabled) return;

      const file = files[0]; // Only take first file since we only allow one video

      if (!file) return;

      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        toast.error(`File type ${file.type} not accepted. Please upload a video file.`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`File size exceeds ${maxFileSize}MB limit`);
        return;
      }

      // Check video duration
      try {
        const duration = await getVideoDuration(file);
        if (duration > maxDuration) {
          toast.error(`Video duration exceeds ${maxDuration} seconds limit`);
          return;
        }

        const videoItem: VideoItem = {
          id: `${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
          file,
          name: file.name,
          duration: Math.round(duration),
        };

        // Replace existing video if any
        onVideoChange?.(videoItem);

        // Auto-upload new video
        uploadVideo(videoItem);
      } catch (error) {
        console.error("Error getting video duration:", error);
        toast.error("Failed to read video file. Please try another file.");
      }
    },
    [
      onVideoChange,
      maxFileSize,
      maxDuration,
      acceptedFileTypes,
      disabled,
      uploadVideo,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      // Clear preview video
      if (dragPreviewVideo?.url.startsWith("blob:")) {
        URL.revokeObjectURL(dragPreviewVideo.url);
      }
      setDragPreviewVideo(null);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect, dragPreviewVideo]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);

      // Create preview of dragged file only if we don't have preview yet
      if (!dragPreviewVideo && e.dataTransfer.items) {
        const items = Array.from(e.dataTransfer.items);
        const videoItem = items.find(
          (item) =>
            item.kind === "file" &&
            item.type.startsWith("video/") &&
            acceptedFileTypes.includes(item.type)
        );

        if (videoItem) {
          const file = videoItem.getAsFile();
          if (file) {
            const previewItem: VideoItem = {
              id: `preview-${Date.now()}`,
              url: URL.createObjectURL(file),
              file,
              name: file.name,
            };
            setDragPreviewVideo(previewItem);
          }
        }
      }
    },
    [acceptedFileTypes, dragPreviewVideo]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragOver to false if we're leaving the drop zone itself
    const target = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!target.contains(relatedTarget)) {
      setDragOver(false);
      // Clear preview video when leaving
      if (dragPreviewVideo?.url.startsWith("blob:")) {
        URL.revokeObjectURL(dragPreviewVideo.url);
      }
      setDragPreviewVideo(null);
    }
  }, [dragPreviewVideo]);

  const removeVideo = useCallback(() => {
    if (disabled) return;
    // Clean up blob URL
    if (video?.url.startsWith("blob:")) {
      URL.revokeObjectURL(video.url);
    }
    onVideoChange?.(null);
  }, [video, onVideoChange, disabled]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileTypes.join(",");
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileSelect(target.files);
    };
    input.click();
  }, [acceptedFileTypes, handleFileSelect, disabled]);

  const formatFileTypes = () => {
    return acceptedFileTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        "w-full min-h-[176px] rounded-lg bg-white",
        dragOver && "border-purple bg-purple/10",
        disabled && "opacity-50 cursor-not-allowed",
        className,
        video && "border border-[#F5EBFF] border-dashed"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Video Display */}
      {video && (
        <div className="relative rounded-lg overflow-hidden group">
          <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
            {/* Show Video.js player only after upload is complete with fileUrl from response */}
            {video.presignedUrl && !uploadMutation.isPending && !video.uploadError ? (
              <div data-vjs-player className="absolute inset-0 w-full h-full">
                <video
                  ref={videoRef}
                  className="video-js vjs-default-skin"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  playsInline
                />
              </div>
            ) : (
              /* Show upload progress overlay during upload - no preview */
              uploadMutation.isPending && (
                <div className="absolute inset-0 bg-black/90 rounded-lg flex flex-col items-center justify-center p-4 z-10">
                  {uploadProgress > 0 ? (
                    <>
                      <CircularProgress
                        value={uploadProgress}
                        size={100}
                        strokeWidth={8}
                        className="mb-4"
                      />
                      <p className="text-white text-sm font-medium mb-2">Uploading video...</p>
                      <p className="text-white/70 text-xs text-center">
                        Please wait while your video is being uploaded
                      </p>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                      <p className="text-white text-sm font-medium mb-3">Preparing upload...</p>
                    </>
                  )}
                </div>
              )
            )}

            {/* Error overlay */}
            {video.uploadError && (
              <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <X className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-red-600 text-sm">{video.uploadError}</p>
                </div>
              </div>
            )}

            {/* Video info overlay */}
            {!uploadMutation.isPending && !video.uploadError && (
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {video.duration ? formatDuration(video.duration) : 'Video'}
              </div>
            )}

            {/* Close button */}
            {!uploadMutation.isPending && (
              <button
                type="button"
                onClick={removeVideo}
                disabled={disabled}
                className="absolute top-2 right-2 size-8 cursor-pointer hover:scale-105 transition-all bg-[#FF0000] rounded-[6px] flex items-center justify-center opacity-0 group-hover:opacity-100"
                aria-label="Remove video"
              >
                <X className="size-4 text-white" />
              </button>
            )}

            {/* Retry button for failed uploads */}
            {video.uploadError && video.file && (
              <button
                type="button"
                onClick={() => uploadVideo(video)}
                disabled={disabled}
                className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retry upload"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drag preview video */}
      {dragPreviewVideo && !video && (
        <div className="relative rounded-lg overflow-hidden border-2 border-purple border-dashed opacity-60">
          <div className="relative aspect-video w-full bg-black">
            <video
              src={dragPreviewVideo.url}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Area - Show when no video or when drag over */}
      {showUploadArea && !video && (
        <div
          className={cn(
            "mt-4 border-2 border-dashed border-purple bg-purple/5 p-6 rounded-lg transition-all duration-200",
            dragOver && "border-purple bg-purple/20 scale-[1.01] shadow-md",
            !disabled &&
              "cursor-pointer hover:bg-purple/10 hover:border-purple/80",
            disabled && "cursor-not-allowed opacity-50",
            uploadAreaClassName
          )}
          onClick={!disabled ? openFileDialog : undefined}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple rounded-full flex-shrink-0">
              <Upload className="size-4 text-white" />
            </div>

            <div className="space-y-1.5 flex flex-col flex-1">
              <p className="text-left text-sm font-medium text-gray-900">
                Drag & drop video or browse your mobile or computer
              </p>
              <p className="text-left text-xs text-muted-foreground">
                Only one video allowed (max {maxDuration} seconds)
              </p>
              <p className="text-left text-xs text-muted-foreground">
                Support {formatFileTypes()} max {maxFileSize}MB
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
                className="pz-2 bg-white text-black border mr-auto hover:bg-gray-50"
              >
                Add Video
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ApplicantsPreviewProps {
  avatars?: string[];
  count?: number;
  onViewClick?: () => void;
}

const ApplicantsPreview = ({
  avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
  ],
  count,
  onViewClick,
}: ApplicantsPreviewProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {avatars.slice(0, 3).map((src, index) => (
          <Avatar
            key={index}
            className="w-8 h-8 border-2 border-background -ml-3 first:ml-0 ring-0"
          >
            <AvatarImage
              src={src}
              alt={`Applicant ${index + 1}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-purple/20 text-grey-blue text-sm">
              {String.fromCharCode(65 + index)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {Boolean(count) && count !== 0 ? (
        <span className="text-grey-blue text-xs font-medium">+{count}</span>
      ) : null}

      {Boolean(count) && (
        <button
          onClick={onViewClick}
          className="text-purple text-xs font-semibold hover:text-purple/80 transition-colors cursor-pointer"
        >
          View Applicants
        </button>
      )}
    </div>
  );
};

export default ApplicantsPreview;

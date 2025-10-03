import { Button } from "@/components/ui/button";
import { EditIcon, StarIcon } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  rating: number;
  totalRatings?: number;
  joinDate: string;
  avatarUrl?: string;
  isVerified?: boolean;
  onEdit?: () => void;
}

export default function ProfileCard({
  name,
  rating,
  totalRatings = 5,
  joinDate,
  avatarUrl = "/images/ai-prompt/add-image.png",
  isVerified = true,
  onEdit,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 relative shadow-sm border border-gray-100">
      {/* Edit Button */}
      <Button
        variant={"ghost"}
        onClick={onEdit}
        icon={<EditIcon className="-mr-2" />}
        className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors text-sm font-medium"
        size={"icon-sm"}
        iconPosition="left"
      >
        Edit
      </Button>

      {/* Profile Content */}
      <div className="flex flex-col items-center space-y-2">
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-purple-100 overflow-hidden">
            <Image
              src={avatarUrl}
              alt={`${name}'s profile picture`}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name and Verification */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-poppins font-semibold text-gray-900">
            {name}
          </h2>
          {isVerified && (
            <Image
              src={"/verified-seller.svg"}
              alt="verified"
              width={16}
              height={16}
            />
          )}
        </div>

        {/* Join Date */}
        <p className="text-xs text-gray-500 text-center -mt-2">
          Joined on {joinDate}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900">
            {rating}/{totalRatings}
          </span>
        </div>
      </div>
    </div>
  );
}

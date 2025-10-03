import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface AddressCardProps {
  id: string;
  label: string;
  address: string;
  isPrimary?: boolean;
  onEdit?: (id: string) => void;
}

export default function AddressCard({
  id,
  label,
  address,
  isPrimary = false,
  onEdit,
}: AddressCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 relative flex gap-3 items-center">
      {/* Primary Tag */}

      {/* Edit Button */}
      <Button
        variant="ghost"
        size="small"
        onClick={() => onEdit?.(id)}
        icon={<Edit className="w-4 h-4 -mr-2" />}
        iconPosition="center"
        className="absolute top-4 right-6 p-2 h-8 w-8 text-purple hover:text-purple-600 hover:bg-purple-50"
      >
        Edit
      </Button>
      <RadioGroupItem value="home" id="home" />
      <Label htmlFor="home">
        {/* Address Content */}
        <div className="space-y-1">
          {/* Icon */}

          {/* Address Details */}
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          <p className="text-sm font-medium text-gray-400 leading-relaxed break-words">
            {address}
          </p>

          {isPrimary && (
            <Badge className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
              Primary
            </Badge>
          )}
        </div>
      </Label>
    </div>
  );
}

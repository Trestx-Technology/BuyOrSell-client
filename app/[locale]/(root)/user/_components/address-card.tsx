import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useLocale } from "@/hooks/useLocale";

interface AddressCardProps {
  id: string;
  label: string;
  address: string;
  isPrimary?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AddressCard({
  id,
  label,
  address,
  isPrimary = false,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const { t } = useLocale();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 relative flex gap-3 items-center">
      <div className="absolute top-4 right-6 flex gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => onEdit(id)}
            icon={<Edit className="w-4 h-4 -mr-2" />}
            iconPosition="center"
            className="p-2 w-fit text-purple hover:text-purple-600 hover:bg-purple-50"
          >
            <span className="hidden md:block">{t.user.address.edit}</span>
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => onDelete(id)}
            icon={<Trash2 className="w-4 h-4 -mr-2" />}
            iconPosition="center"
            className="p-2 w-fit text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <span className="hidden md:block">{t.user.address.delete}</span>
          </Button>
        )}
      </div>
      <RadioGroupItem value="home" id="home" />
      <Label htmlFor="home">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h3>
          <p className="text-sm font-medium text-gray-400 leading-relaxed break-words">
            {address}
          </p>

          {isPrimary && (
            <Badge className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
              {t.user.address.primary}
            </Badge>
          )}
        </div>
      </Label>
    </div>
  );
}

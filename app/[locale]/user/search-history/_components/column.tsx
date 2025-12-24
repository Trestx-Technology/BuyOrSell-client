import { ColumnDef } from "@tanstack/react-table";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import type { SearchHistoryItem } from "@/interfaces/search-history.types";

interface UseSearchHistoryColumnsProps {
  onDeleteSearch: (id: string) => void;
  isDeleting: boolean;
}

export function useSearchHistoryColumns({
  onDeleteSearch,
  isDeleting,
}: UseSearchHistoryColumnsProps): ColumnDef<SearchHistoryItem>[] {
  return [
    {
      accessorKey: "searchTerm",
      header: "Search Term",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Date & Time",
      cell: ({ getValue }) => (
        <span className="text-gray-600">
          {formatDate(getValue() as string)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteSearch(row.original._id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];
}

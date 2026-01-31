import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/lib/firebase/tickets/types";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const statusColorMap: Record<TicketStatus, string> = {
  open: "bg-blue-500 hover:bg-blue-600",
  in_progress: "bg-yellow-500 hover:bg-yellow-600",
  waiting_for_user: "bg-orange-500 hover:bg-orange-600",
  resolved: "bg-green-500 hover:bg-green-600",
  closed: "bg-gray-500 hover:bg-gray-600",
};

const statusLabelMap: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_for_user: "Waiting for Reply",
  resolved: "Resolved",
  closed: "Closed",
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  return (
    <Badge className={`${statusColorMap[status] || "bg-gray-500"} text-white border-none`}>
      {statusLabelMap[status] || status}
    </Badge>
  );
}

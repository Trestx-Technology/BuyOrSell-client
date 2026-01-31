import Link from "next/link";
import { Ticket } from "@/lib/firebase/tickets/types";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { Card } from "@/components/ui/card";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  // Handle various timestamp formats (Date, Timestamp, string, number)
  const getDate = (dateVal: any): Date => {
      if (!dateVal) return new Date();
      if (dateVal instanceof Date) return dateVal;
      if (typeof dateVal.toDate === 'function') return dateVal.toDate(); // Firestore Timestamp
      return new Date(dateVal);
  };
  
  const date = getDate(ticket.createdAt);

  return (
    <Link href={`/help-centre/ticket/${ticket.id}`} className="block group">
      <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 group-hover:border-purple-200">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate max-w-[250px] sm:max-w-md">{ticket.subject}</h3>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{ticket.message}</p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
             {date.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">ID: {ticket.id.slice(0, 8)}</span>
          <span className="capitalize bg-purple-50 text-purple-700 px-2 py-1 rounded">{ticket.queryType.replace(/_/g, ' ')}</span>
        </div>
      </Card>
    </Link>
  );
}

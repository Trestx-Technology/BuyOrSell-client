import { Ticket } from "@/lib/firebase/tickets/types";
import { TicketCard } from "./TicketCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TicketsListProps {
  tickets: Ticket[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function TicketsList({ tickets, isLoading, emptyMessage = "You haven't created any support tickets yet." }: TicketsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
           <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
        <p className="text-gray-500 mt-1">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

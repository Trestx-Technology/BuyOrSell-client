"use client";

import { useUserTickets } from "@/hooks/useTickets";
import { TicketsList } from "@/components/help-center/TicketsList";
import { Container1080 } from "@/components/layouts/container-1080";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { TicketStatus, QueryType } from "@/lib/firebase/tickets/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryTypeSelector } from "@/components/help-center/QueryTypeSelector";
import { useRouter } from "next/navigation";

export default function MyTicketsPage() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  // Safely access ID, handling potentially different session shapes
  const userId = session?.user?._id || (session?.user as any)?.id;
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [queryTypeFilter, setQueryTypeFilter] = useState<QueryType | 'all'>('all');

  const filters = {
    ...(statusFilter !== 'all' && { status: [statusFilter] }),
    ...(queryTypeFilter !== 'all' && { queryType: [queryTypeFilter] })
  };

  const { tickets, isLoading } = useUserTickets(userId || "", filters);

  return (
    <Container1080 className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/help-centre")}
            className="shrink-0 -ml-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Support Tickets</h1>
            <p className="text-gray-500 dark:text-gray-400">View and manage your support requests</p>
          </div>
        </div>
        <Link href="/help-centre/new">
          <Button icon={
            <Plus className="w-4 h-4 -mr-2" />
          }
            iconPosition="center"
            className="bg-purple-600 hover:bg-purple-700">
            Create Ticket
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs defaultValue="all" value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)} className="w-full sm:w-auto">
          <TabsList className="bg-gray-100 dark:bg-gray-800 w-full sm:w-auto overflow-x-auto justify-start border border-transparent dark:border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:dark:bg-gray-700">All</TabsTrigger>
            <TabsTrigger value="open" className="data-[state=active]:dark:bg-gray-700">Open</TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:dark:bg-gray-700">In Progress</TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:dark:bg-gray-700">Resolved</TabsTrigger>
            <TabsTrigger value="closed" className="data-[state=active]:dark:bg-gray-700">Closed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full sm:w-48">
          <QueryTypeSelector
            value={queryTypeFilter === 'all' ? '' : queryTypeFilter}
            onChange={(val) => setQueryTypeFilter(val || 'all')}
            placeholder="Filter by Type"
          />
        </div>
      </div>

      <TicketsList tickets={tickets} isLoading={isLoading} />
    </Container1080>
  );
}

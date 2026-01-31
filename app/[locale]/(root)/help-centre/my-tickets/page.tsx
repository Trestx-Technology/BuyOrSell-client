"use client";

import { useUserTickets } from "@/hooks/useTickets";
import { TicketsList } from "@/components/help-center/TicketsList";
import { Container1080 } from "@/components/layouts/container-1080";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TicketStatus, QueryType } from "@/lib/firebase/tickets/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryTypeSelector } from "@/components/help-center/QueryTypeSelector";

export default function MyTicketsPage() {
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-gray-500">View and manage your support requests</p>
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
          <TabsList className="bg-gray-100 w-full sm:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
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

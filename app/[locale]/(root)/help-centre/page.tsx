"use client";

import { useTicketStats, useUserTickets } from "@/hooks/useTickets";
import { Container1080 } from "@/components/layouts/container-1080";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Ticket as TicketIcon } from "lucide-react";
import { TicketsList } from "@/components/help-center/TicketsList";
import { useAuthStore } from "@/stores/authStore";
import React from "react";
import { H2, H5 } from "@/components/typography";

export default function HelpCenterDashboard() {
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?._id || (session?.user as any)?.id;

  const stats = useTicketStats(userId || "");
  const { tickets, isLoading } = useUserTickets(userId || "");
  console.log(tickets);
  return (
    <Container1080 className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-500 mt-1">Manage your support tickets and get help.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/help-centre/messages">
            <Button variant="outline">Messages</Button>
          </Link>
          <Link href="/help-centre/my-tickets">
            <Button variant="outline">My Tickets</Button>
          </Link>
          <Link href="/help-centre/new">
            <Button
              icon={
                <Plus className="w-4 h-4 -mr-2" />
              }
              iconPosition="center"
              className="bg-purple-600 hover:bg-purple-700">
              New Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tickets" value={stats.total} icon={<TicketIcon className="w-5 h-5 text-purple-600" />} />
        <StatCard label="Open" value={stats.open} icon={<div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-100" />} />
        <StatCard label="In Progress" value={stats.inProgress} icon={<div className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-100" />} />
        <StatCard label="Resolved" value={stats.resolved} icon={<div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-100" />} />
      </div>

      {/* Recent Tickets */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
          <Link href="/help-centre/my-tickets" className="text-purple-600 text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <TicketsList tickets={tickets.slice(0, 5)} isLoading={isLoading} emptyMessage="No recent support tickets." />
      </div>

      {/* Help Resources / FAQ Section (Placeholder) */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Account Settings', 'Billing & Payments', 'Security & Privacy'].map((topic) => (
            <Card key={topic} className="p-4 hover:shadow-sm cursor-pointer border-gray-200">
              <h3 className="font-medium text-gray-800">{topic}</h3>
              <p className="text-sm text-gray-500 mt-1">Learn more about {topic.toLowerCase()}</p>
            </Card>
          ))}
          </div>
      </div>
    </Container1080>
  );
}

function StatCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="p-4 flex items-center justify-between border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <H5 className="font-bold">{label}</H5>
      </div>
      <H5 className="text-2xl font-bold text-gray-900 mt-1">{value}</H5>
    </Card>
  )
}

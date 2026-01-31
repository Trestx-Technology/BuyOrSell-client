import { TicketDetails } from "@/components/help-center/TicketDetails";
import { Container1080 } from "@/components/layouts/container-1080";
import React from "react";

interface PageProps {
  params: Promise<{
    ticketId: string;
    locale: string;
  }>;
}

export default async function TicketPage(props: PageProps) {
  const params = await props.params;

  return (
    <Container1080 className="py-4 md:py-8 h-full">
      <TicketDetails ticketId={params.ticketId} />
    </Container1080>
  );
}

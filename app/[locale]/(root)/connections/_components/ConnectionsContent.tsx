"use client";

import React from "react";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { H2, Typography } from "@/components/typography";
import {
      useMyConnections,
      useReceivedRequests,
      useSentRequests,
      useAcceptConnectionRequest,
      useRejectConnectionRequest,
      useRemoveConnection,
} from "@/hooks/useConnections";
import { Table } from "@/components/table/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/hooks/useLocale";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/services/axios-api-client";
import { getConnectionsColumns, getReceivedColumns, getSentColumns } from "./Columns";
import { Connection } from "@/interfaces/connection.types";
import { toast } from "sonner";
import { Users, } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";


export default function ConnectionsContent() {
      const { localePath } = useLocale();
      const router = useRouter();
      const session = useAuthStore((state) => state.session);
      const currentUserId = session?.user?._id;

      // Confirmation Dialog State
      const [confirmConfig, setConfirmConfig] = React.useState<{
            open: boolean;
            title: string;
            description: string;
            onConfirm: () => void;
            isLoading?: boolean;
            type: "remove" | "reject";
      }>({
            open: false,
            title: "",
            description: "",
            onConfirm: () => { },
            type: "remove"
      });

      // Queries
      const { data: acceptedConnections, isLoading: isLoadingAccepted, refetch: refetchAccepted } = useMyConnections("ACCEPTED");
      const { data: receivedRequests, isLoading: isLoadingReceived, refetch: refetchReceived } = useReceivedRequests();
      const { data: sentRequests, isLoading: isLoadingSent, refetch: refetchSent } = useSentRequests();

      // Mutations
      const acceptMutation = useAcceptConnectionRequest(() => {
            toast.success("Connection request accepted");
            refetchAccepted();
            refetchReceived();
      });

      const rejectMutation = useRejectConnectionRequest(() => {
            toast.success("Connection request rejected");
            refetchReceived();
            setConfirmConfig(prev => ({ ...prev, open: false }));
      });

      const removeMutation = useRemoveConnection(() => {
            toast.success("Connection removed");
            refetchAccepted();
            setConfirmConfig(prev => ({ ...prev, open: false }));
      });

      const [isMessageLoading, setIsMessageLoading] = React.useState<string | null>(null);

      const handleMessage = async (userId: string) => {
            try {
                  setIsMessageLoading(userId);
                  const response = await axiosInstance.post("/chat/dm", {
                        recipientId: userId,
                  });
                  const chatId = response.data.data._id;
                  router.push(localePath(`/chat?chatId=${chatId}&type=dm`));
            } catch (error) {
                  console.error("Error starting chat:", error);
                  toast.error("Failed to start conversation");
            } finally {
                  setIsMessageLoading(null);
            }
      };

      const connectionsColumns = React.useMemo(() =>
            getConnectionsColumns({
                  currentUserId,
                  localePath,
                  onMessage: handleMessage,
                  onRemove: (id) => {
                        setConfirmConfig({
                              open: true,
                              title: "Remove Connection",
                              description: "Are you sure you want to remove this professional from your network?",
                              onConfirm: () => removeMutation.mutate(id),
                              isLoading: removeMutation.isPending,
                              type: "remove"
                        });
                  },
                  isMessageLoading,
                  isRemoving: removeMutation.isPending ? (removeMutation as any).variables : null,
                  formatDate,
            }),
            [currentUserId, localePath, isMessageLoading, removeMutation]
      );

      const receivedColumns = React.useMemo(() =>
            getReceivedColumns({
                  localePath,
                  onAccept: (id) => acceptMutation.mutate(id),
                  onReject: (id) => {
                        setConfirmConfig({
                              open: true,
                              title: "Reject Request",
                              description: "Are you sure you want to reject this connection request?",
                              onConfirm: () => rejectMutation.mutate(id),
                              isLoading: rejectMutation.isPending,
                              type: "reject"
                        });
                  },
                  isAccepting: acceptMutation.isPending ? (acceptMutation as any).variables : null,
                  isRejecting: rejectMutation.isPending ? (rejectMutation as any).variables : null,
                  formatDate,
            }),
            [localePath, acceptMutation, rejectMutation]
      );

      const sentColumns = React.useMemo(() =>
            getSentColumns({
                  localePath,
                  formatDate,
            }),
            [localePath, formatDate]
      );

      const renderEmptyState = (message: string) => (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-purple" />
                  </div>
                  <Typography variant="h3" className="text-dark-blue font-semibold mb-2">
                        {message}
                  </Typography>
                  <Typography variant="body-small" className="text-grey-blue max-w-xs">
                        Expand your professional network to see more connections here.
                  </Typography>
            </div>
      );

      return (
            <Container1080>
                  <MobileStickyHeader title="My Network" />

                  <div className="px-4 py-8">
                        <div className="mb-8">
                              <H2 className="font-bold text-dark-blue mb-2">
                                    Professional Network
                              </H2>
                              <Typography variant="body-small" className="text-grey-blue">
                                    Manage your professional connections and network requests.
                              </Typography>
                        </div>

                        <Tabs defaultValue="connections" className="w-full">
                              <TabsList className="mb-6 flex justify-start border-b border-gray-200">
                                    <TabsTrigger value="connections" className="relative pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple data-[state=active]:bg-transparent data-[state=active]:text-purple data-[state=active]:shadow-none data-[state=inactive]:border-transparent">
                                          Connections {acceptedConnections?.data?.total ? `(${acceptedConnections.data.total})` : ""}
                                    </TabsTrigger>
                                    <TabsTrigger value="received" className="relative pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple data-[state=active]:bg-transparent data-[state=active]:text-purple data-[state=active]:shadow-none data-[state=inactive]:border-transparent">
                                          Received Requests {receivedRequests?.data?.total ? `(${receivedRequests.data.total})` : ""}
                                    </TabsTrigger>
                                    <TabsTrigger value="sent" className="relative pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple data-[state=active]:bg-transparent data-[state=active]:text-purple data-[state=active]:shadow-none data-[state=inactive]:border-transparent">
                                          Sent Requests {sentRequests?.data?.total ? `(${sentRequests.data.total})` : ""}
                                    </TabsTrigger>
                              </TabsList>

                              {/* Connections Tab */}
                              <TabsContent value="connections">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                          <Table<Connection>
                                                data={acceptedConnections?.data?.items || []}
                                                columns={connectionsColumns || []}
                                                loading={isLoadingAccepted}
                                                containerClassName="p-0 border-none shadow-none"
                                          />
                                          {!isLoadingAccepted && !acceptedConnections?.data?.items.length && renderEmptyState("No connections yet")}
                                    </div>
                              </TabsContent>

                              {/* Received Requests Tab */}
                              <TabsContent value="received">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                          <Table<Connection>
                                                data={receivedRequests?.data?.items || []}
                                                columns={receivedColumns || []}
                                                loading={isLoadingReceived}
                                                containerClassName="p-0 border-none shadow-none"
                                          />
                                          {!isLoadingReceived && !receivedRequests?.data?.items.length && renderEmptyState("No pending requests")}
                                    </div>
                              </TabsContent>

                              {/* Sent Requests Tab */}
                              <TabsContent value="sent">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                          <Table<Connection>
                                                data={sentRequests?.data?.items || []}
                                                columns={sentColumns || []}
                                                loading={isLoadingSent}
                                                containerClassName="p-0 border-none shadow-none"
                                          />
                                          {!isLoadingSent && !sentRequests?.data?.items.length && renderEmptyState("No sent requests")}
                                    </div>
                              </TabsContent>
                        </Tabs>
                  </div>
                  <WarningConfirmationDialog
                        open={confirmConfig.open}
                        onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, open }))}
                        title={confirmConfig.title}
                        description={confirmConfig.description}
                        onConfirm={confirmConfig.onConfirm}
                        isLoading={confirmConfig.type === "remove" ? removeMutation.isPending : rejectMutation.isPending}
                        confirmText={confirmConfig.type === "remove" ? "Remove" : "Reject"}
                  />
            </Container1080>
      );
}

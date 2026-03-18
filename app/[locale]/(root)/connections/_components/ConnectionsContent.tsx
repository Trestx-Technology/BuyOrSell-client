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
      const { localePath, t } = useLocale();
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
            toast.success(t.connections.messages.requestAccepted);
            refetchAccepted();
            refetchReceived();
      });

      const rejectMutation = useRejectConnectionRequest(() => {
            toast.success(t.connections.messages.requestRejected);
            refetchReceived();
            setConfirmConfig(prev => ({ ...prev, open: false }));
      });

      const removeMutation = useRemoveConnection(() => {
            toast.success(t.connections.messages.connectionRemoved);
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
                  toast.error(t.connections.messages.failedToStartChat);
            } finally {
                  setIsMessageLoading(null);
            }
      };

      const connectionsColumns = React.useMemo(() =>
            getConnectionsColumns({
                  currentUserId,
                  localePath,
                  t,
                  onMessage: handleMessage,
                  onRemove: (id) => {
                        setConfirmConfig({
                              open: true,
                              title: t.connections.actions.removeConnection,
                              description: t.connections.actions.removeConfirm,
                              onConfirm: () => removeMutation.mutate(id),
                              isLoading: removeMutation.isPending,
                              type: "remove"
                        });
                  },
                  isMessageLoading,
                  isRemoving: removeMutation.isPending ? (removeMutation as any).variables : null,
                  formatDate,
            }),
            [currentUserId, localePath, isMessageLoading, removeMutation, t]
      );

      const receivedColumns = React.useMemo(() =>
            getReceivedColumns({
                  localePath,
                  t,
                  onAccept: (id) => acceptMutation.mutate(id),
                  onReject: (id) => {
                        setConfirmConfig({
                              open: true,
                              title: t.connections.actions.rejectRequest,
                              description: t.connections.actions.rejectConfirm,
                              onConfirm: () => rejectMutation.mutate(id),
                              isLoading: rejectMutation.isPending,
                              type: "reject"
                        });
                  },
                  isAccepting: acceptMutation.isPending ? (acceptMutation as any).variables : null,
                  isRejecting: rejectMutation.isPending ? (rejectMutation as any).variables : null,
                  formatDate,
            }),
            [localePath, acceptMutation, rejectMutation, t]
      );

      const sentColumns = React.useMemo(() =>
            getSentColumns({
                  localePath,
                  t,
                  formatDate,
            }),
            [localePath, formatDate, t]
      );

      const renderEmptyState = (message: string) => (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-purple/10 dark:bg-purple/20 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-purple dark:text-purple-400" />
                  </div>
                  <Typography variant="h3" className="text-dark-blue dark:text-gray-100 font-semibold mb-2">
                        {message}
                  </Typography>
                  <Typography variant="body-small" className="text-grey-blue dark:text-gray-400 max-w-xs">
                        {t.connections.emptyStates.expandNetwork}
                  </Typography>
            </div>
      );

      return (
            <Container1080>
                  <MobileStickyHeader title={t.connections.myNetwork} />

                  <div className="px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-950">
                        <div className="mb-8">
                              <H2 className="font-bold text-dark-blue dark:text-gray-100 mb-2">
                                    {t.connections.professionalNetwork}
                              </H2>
                              <Typography variant="body-small" className="text-grey-blue dark:text-gray-400">
                                    {t.connections.manageConnections}
                              </Typography>
                        </div>

                        <Tabs defaultValue="connections" className="w-full">
                              <TabsList className="mb-8 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-lg w-fit border border-transparent dark:border-gray-800">
                                    <TabsTrigger 
                                          value="connections" 
                                          className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm"
                                    >
                                          {t.connections.tabs.connections} {acceptedConnections?.data?.total ? `(${acceptedConnections.data.total})` : ""}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                          value="received" 
                                          className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm"
                                    >
                                          {t.connections.tabs.received} {receivedRequests?.data?.total ? `(${receivedRequests.data.total})` : ""}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                          value="sent" 
                                          className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm"
                                    >
                                          {t.connections.tabs.sent} {sentRequests?.data?.total ? `(${sentRequests.data.total})` : ""}
                                    </TabsTrigger>
                              </TabsList>

                              {/* Connections Tab */}
                              <TabsContent value="connections">
                                     <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                           <Table<Connection>
                                                 data={acceptedConnections?.data?.items || []}
                                                 columns={connectionsColumns || []}
                                                 loading={isLoadingAccepted}
                                                 containerClassName="p-0 border-none shadow-none"
                                                 renderEmptyState={() => renderEmptyState("No connections yet")}
                                           />
                                     </div>
                              </TabsContent>

                              {/* Received Requests Tab */}
                              <TabsContent value="received">
                                     <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                           <Table<Connection>
                                                 data={receivedRequests?.data?.items || []}
                                                 columns={receivedColumns || []}
                                                 loading={isLoadingReceived}
                                                 containerClassName="p-0 border-none shadow-none"
                                                 renderEmptyState={() => renderEmptyState("No pending requests")}
                                           />
                                     </div>
                              </TabsContent>

                              {/* Sent Requests Tab */}
                              <TabsContent value="sent">
                                     <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                           <Table<Connection>
                                                 data={sentRequests?.data?.items || []}
                                                 columns={sentColumns || []}
                                                 loading={isLoadingSent}
                                                 containerClassName="p-0 border-none shadow-none"
                                                 renderEmptyState={() => renderEmptyState("No sent requests")}
                                           />
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
                        confirmText={confirmConfig.type === "remove" ? t.connections.actions.remove : t.connections.actions.reject}
                        cancelText={t.connections.actions.cancel}
                  />
            </Container1080>
      );
}

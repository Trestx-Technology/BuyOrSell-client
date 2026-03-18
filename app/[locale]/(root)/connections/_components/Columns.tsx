"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Connection } from "@/interfaces/connection.types";
import { type Translations } from "@/translations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserX, Check, X, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ChatInit } from "@/components/global/chat-init";

interface ColumnActionsWrapperProps {
      conn: Connection;
      currentUserId: string;
      localePath: (path: string) => string;
      onMessage?: (userId: string) => void;
      onRemove?: (id: string) => void;
      onAccept?: (id: string) => void;
      onReject?: (id: string) => void;
      isMessageLoading?: string | null;
      isRemoving?: string | null;
      isAccepting?: string | null;
      isRejecting?: string | null;
      formatDate: (date?: string) => string;
      t: Translations;
}

export const getConnectionsColumns = ({
      currentUserId,
      localePath,
      onMessage,
      onRemove,
      isMessageLoading,
      isRemoving,
      formatDate,
      t,
}: Partial<ColumnActionsWrapperProps>): ColumnDef<Connection>[] => [
            {
                  accessorKey: "user",
                  header: t!.connections.columns.professional,
                  cell: ({ row }) => {
                        const conn = row.original;
                        const otherUser = conn.user || (conn.fromUserId === currentUserId ? conn.toUser : conn.fromUser);
                        if (!otherUser) return null;
                        const displayName = otherUser.name || `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || "Unknown Professional";

                        const profileId = conn.userProfile?._id || otherUser.id;

                        return (
                              <Link href={localePath!(`/jobs/jobseeker/${profileId}?type=profileVisit`)} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-800 group-hover:border-purple/30 transition-colors">
                                          <AvatarImage src={otherUser.image} alt={displayName} />
                                          <AvatarFallback className="bg-purple/5 dark:bg-purple/10 text-purple dark:text-purple-400 text-xs">
                                                {displayName.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                          <Typography variant="sm-semibold" className="text-dark-blue dark:text-gray-100 group-hover:text-purple dark:group-hover:text-purple-400 transition-colors">
                                                {displayName}
                                          </Typography>
                                          <Typography variant="xs-regular" className="text-grey-blue dark:text-gray-400">
                                                {t!.connections.columns.professional}
                                          </Typography>
                                    </div>
                              </Link>
                        );
                  },
            },
            {
                  accessorKey: "status",
                  header: t!.connections.columns.status,
                  cell: () => (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/30 text-[10px] py-0.5 uppercase tracking-wider font-semibold">
                              {t!.connections.status.connected}
                        </Badge>
                  ),
            },
            {
                  accessorKey: "connectedAt",
                  header: t!.connections.columns.connectedSince,
                  cell: ({ row }) => formatDate!(row.original.connectedAt || row.original.acceptedAt || row.original.updatedAt),
            },
            {
                  id: "actions",
                  header: () => <div className="text-right">{t!.connections.columns.actions}</div>,
                  cell: ({ row }) => {
                        const conn = row.original;
                        const otherUser = conn.user || (conn.fromUserId === currentUserId ? conn.toUser : conn.fromUser);
                        // The backend might return ID in connectionId, _id, or id fields
                        const id = conn.connectionId || conn._id || conn.id || "";
                        if (!otherUser) return null;

                        const displayName = otherUser.name || `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || "Unknown Professional";

                        return (
                              <div className="flex justify-end gap-2">
                                    <ChatInit
                                          type="dm"
                                          sellerId={otherUser.id}
                                          sellerName={displayName}
                                          sellerImage={otherUser.image}
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 text-purple dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all shadow-sm"
                                          iconSize={14}
                                    />
                                    <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                          onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove?.(id);
                                          }}
                                          loading={isRemoving === id}
                                          disabled={isRemoving === id}
                                    >
                                          <UserX className="w-3.5 h-3.5" />
                                    </Button>
                              </div>
                        );
                  },
            },
      ];

export const getReceivedColumns = ({
      localePath,
      onAccept,
      onReject,
      isAccepting,
      isRejecting,
      formatDate,
      t,
}: Partial<ColumnActionsWrapperProps>): ColumnDef<Connection>[] => [
            {
                  accessorKey: "user",
                  header: t!.connections.columns.from,
                  cell: ({ row }) => {
                        const conn = row.original;
                        const sender = conn.user || conn.fromUser;
                        if (!sender) return null;
                        const displayName = sender.name || `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Unknown Professional";

                        const profileId = conn.userProfile?._id || sender.id;

                        return (
                              <Link href={localePath!(`/jobs/jobseeker/${profileId}?type=profileVisit`)} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-800 group-hover:border-purple/30 transition-colors">
                                          <AvatarImage src={sender.image} alt={displayName} />
                                          <AvatarFallback className="bg-purple/5 dark:bg-purple/10 text-purple dark:text-purple-400 text-xs">
                                                {displayName.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                          <Typography variant="sm-semibold" className="text-dark-blue dark:text-gray-100 group-hover:text-purple dark:group-hover:text-purple-400 transition-colors">
                                                {displayName}
                                          </Typography>
                                          <div className="flex items-center gap-1 text-[10px] text-grey-blue dark:text-gray-400">
                                                <ArrowDownLeft className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                                                {t!.connections.status.incoming}
                                          </div>
                                    </div>
                              </Link>
                        );
                  },
            },
            {
                  accessorKey: "message",
                  header: t!.connections.columns.message,
                  cell: ({ row }) => (
                        <Typography variant="xs-regular" className="text-grey-blue dark:text-gray-400 italic truncate max-w-[200px]">
                              {row.original.message || t!.connections.messages.noMessage}
                        </Typography>
                  ),
            },
            {
                  accessorKey: "createdAt",
                  header: t!.connections.columns.date,
                  cell: ({ row }) => formatDate!(row.original.createdAt),
            },
            {
                  id: "actions",
                  header: () => <div className="text-right">{t!.connections.columns.actions}</div>,
                  cell: ({ row }) => {
                        const conn = row.original;
                        // For requests, the backend uses requestId or _id
                        const id = conn.requestId || conn._id || conn.id || "";

                        return (
                              <div className="flex justify-end gap-2">
                                    <Button
                                          size="sm"
                                          className="h-8 bg-purple hover:bg-purple/90 text-white shadow-sm"
                                          onClick={(e) => {
                                                e.stopPropagation();
                                                onAccept?.(id);
                                          }}
                                          icon={<Check className="w-3.5 h-3.5" />}
                                          iconPosition="center"
                                          isLoading={isAccepting === id}
                                          disabled={isAccepting === id || isRejecting === id}
                                    >
                                          {t!.connections.actions.accept}
                                    </Button>
                                    <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-red-500 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 hover:border-red-300"
                                          onClick={(e) => {
                                                e.stopPropagation();
                                                onReject?.(id);
                                          }}
                                          icon={<X className="w-3.5 h-3.5" />}
                                          iconPosition="center"
                                          isLoading={isRejecting === id}
                                          disabled={isAccepting === id || isRejecting === id}
                                    >
                                          {t!.connections.actions.reject}
                                    </Button>
                              </div>
                        );
                  },
            },
      ];

export const getSentColumns = ({
      localePath,
      formatDate,
      t,
}: Partial<ColumnActionsWrapperProps>): ColumnDef<Connection>[] => [
            {
                  accessorKey: "user",
                  header: t!.connections.columns.sentTo,
                  cell: ({ row }) => {
                        const conn = row.original;
                        const receiver = conn.user || conn.toUser;
                        if (!receiver) return null;
                        const displayName = receiver.name || `${receiver.firstName || ""} ${receiver.lastName || ""}`.trim() || "Unknown Professional";

                        const profileId = conn.userProfile?._id || receiver.id;

                        return (
                              <Link href={localePath!(`/jobs/jobseeker/${profileId}?type=profileVisit`)} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-800 group-hover:border-purple/30 transition-colors">
                                          <AvatarImage src={receiver.image} alt={displayName} />
                                          <AvatarFallback className="bg-purple/5 dark:bg-purple/10 text-purple dark:text-purple-400 text-xs">
                                                {displayName.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                          <Typography variant="sm-semibold" className="text-dark-blue dark:text-gray-100 group-hover:text-purple dark:group-hover:text-purple-400 transition-colors">
                                                {displayName}
                                          </Typography>
                                          <div className="flex items-center gap-1 text-[10px] text-grey-blue dark:text-gray-400">
                                                <ArrowUpRight className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                                                {t!.connections.status.outgoing}
                                          </div>
                                    </div>
                              </Link>
                        );
                  },
            },
            {
                  accessorKey: "status",
                  header: t!.connections.columns.status,
                  cell: () => (
                        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800/30 text-[10px] py-0.5 uppercase tracking-wider font-semibold">
                              {t!.connections.status.pending}
                        </Badge>
                  ),
            },
            {
                  accessorKey: "createdAt",
                  header: t!.connections.columns.date,
                  cell: ({ row }) => formatDate!(row.original.createdAt),
            },
            {
                  id: "message",
                  header: t!.connections.columns.message,
                  cell: ({ row }) => (
                        <Typography variant="xs-regular" className="text-grey-blue dark:text-gray-400 italic truncate max-w-[200px]">
                              {row.original.message || t!.connections.messages.noMessage}
                        </Typography>
                  ),
            },
      ];

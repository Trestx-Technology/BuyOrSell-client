"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Connection } from "@/interfaces/connection.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserX, Check, X, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import Link from "next/link";

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
}

export const getConnectionsColumns = ({
      currentUserId,
      localePath,
      onMessage,
      onRemove,
      isMessageLoading,
      isRemoving,
      formatDate,
}: Partial<ColumnActionsWrapperProps>): ColumnDef<Connection>[] => [
            {
                  accessorKey: "user",
                  header: "Professional",
                  cell: ({ row }) => {
                        const conn = row.original;
                        const otherUser = conn.user || (conn.fromUserId === currentUserId ? conn.toUser : conn.fromUser);
                        if (!otherUser) return null;
                        const displayName = otherUser.name || `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || "Unknown Professional";

                        const profileId = conn.userProfile?._id || otherUser.id;

                        return (
                              <Link href={localePath!(`/jobs/jobseeker/${profileId}?type=profilevisit`)} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10 border border-gray-100 group-hover:border-purple/30 transition-colors">
                                          <AvatarImage src={otherUser.image} alt={displayName} />
                                          <AvatarFallback className="bg-purple/5 text-purple text-xs">
                                                {displayName.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                          <Typography variant="sm-semibold" className="text-dark-blue group-hover:text-purple transition-colors">
                                                {displayName}
                                          </Typography>
                                          <Typography variant="xs-regular" className="text-grey-blue">
                                                Professional
                                          </Typography>
                                    </div>
                              </Link>
                        );
                  },
            },
            {
                  accessorKey: "status",
                  header: "Status",
                  cell: () => (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-[10px] py-0.5 uppercase tracking-wider font-semibold">
                              Connected
                        </Badge>
                  ),
            },
            {
                  accessorKey: "connectedAt",
                  header: "Connected Since",
                  cell: ({ row }) => formatDate!(row.original.connectedAt || row.original.acceptedAt || row.original.updatedAt),
            },
            {
                  id: "actions",
                  header: () => <div className="text-right">Actions</div>,
                  cell: ({ row }) => {
                        const conn = row.original;
                        const otherUser = conn.user || (conn.fromUserId === currentUserId ? conn.toUser : conn.fromUser);
                        // The backend might return ID in connectionId, _id, or id fields
                        const id = conn.connectionId || conn._id || conn.id || "";
                        if (!otherUser) return null;

                        return (
                              <div className="flex justify-end gap-2">
                                    <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 text-purple hover:bg-purple-100 transition-all shadow-sm"
                                          onClick={(e) => {
                                                e.stopPropagation();
                                                onMessage?.(otherUser.id);
                                          }}
                                          icon={<MessageCircle className="w-3.5 h-3.5" />}
                                          iconPosition="center"
                                          isLoading={isMessageLoading === otherUser.id}
                                          disabled={isMessageLoading === otherUser.id}
                                    />
                                    <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
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
}: Partial<ColumnActionsWrapperProps>): ColumnDef<Connection>[] => [
            {
                  accessorKey: "user",
                  header: "From",
                  cell: ({ row }) => {
                        const conn = row.original;
                        const sender = conn.user || conn.fromUser;
                        if (!sender) return null;
                        const displayName = sender.name || `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Unknown Professional";

                        const profileId = conn.userProfile?._id || sender.id;

                        return (
                              <Link href={localePath!(`/jobs/jobseeker/${profileId}?type=profilevisit`)} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10 border border-gray-100 group-hover:border-purple/30 transition-colors">
                                          <AvatarImage src={sender.image} alt={displayName} />
                                          <AvatarFallback className="bg-purple/5 text-purple text-xs">
                                                {displayName.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                          <Typography variant="sm-semibold" className="text-dark-blue group-hover:text-purple transition-colors">
                                                {displayName}
                                          </Typography>
                                          <div className="flex items-center gap-1 text-[10px] text-grey-blue">
                                                <ArrowDownLeft className="w-3 h-3 text-blue-500" />
                                                INCOMING REQUEST
                                          </div>
                                    </div>
                              </Link>
                        );
                  },
            },
            {
                  accessorKey: "message",
                  header: "Message",
                  cell: ({ row }) => (
                        <Typography variant="xs-regular" className="text-grey-blue italic truncate max-w-[200px]">
                              {row.original.message || "No message included"}
                        </Typography>
                  ),
            },
            {
                  accessorKey: "createdAt",
                  header: "Received Date",
                  cell: ({ row }) => formatDate!(row.original.createdAt),
            },
            {
                  id: "actions",
                  header: () => <div className="text-right">Actions</div>,
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
                                          Accept
                                    </Button>
                                    <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                          onClick={(e) => {
                                                e.stopPropagation();
                                                onReject?.(id);
                                          }}
                                          icon={<X className="w-3.5 h-3.5" />}
                                          iconPosition="center"
                                          isLoading={isRejecting === id}
                                          disabled={isAccepting === id || isRejecting === id}
                                    >
                                          Reject
                                    </Button>
                              </div>
                        );
                  },
            },
      ];

export const getSentColumns = ({
      localePath,
      formatDate,
}: Partial<ColumnActionsWrapperProps>): ColumnDef<Connection>[] => [
            {
                  accessorKey: "user",
                  header: "Sent To",
                  cell: ({ row }) => {
                        const conn = row.original;
                        const receiver = conn.user || conn.toUser;
                        if (!receiver) return null;
                        const displayName = receiver.name || `${receiver.firstName || ""} ${receiver.lastName || ""}`.trim() || "Unknown Professional";

                        const profileId = conn.userProfile?._id || receiver.id;

                        return (
                              <Link href={localePath!(`/jobs/jobseeker/${profileId}?type=profilevisit`)} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10 border border-gray-100 group-hover:border-purple/30 transition-colors">
                                          <AvatarImage src={receiver.image} alt={displayName} />
                                          <AvatarFallback className="bg-purple/5 text-purple text-xs">
                                                {displayName.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                          <Typography variant="sm-semibold" className="text-dark-blue group-hover:text-purple transition-colors">
                                                {displayName}
                                          </Typography>
                                          <div className="flex items-center gap-1 text-[10px] text-grey-blue">
                                                <ArrowUpRight className="w-3 h-3 text-orange-500" />
                                                OUTGOING REQUEST
                                          </div>
                                    </div>
                              </Link>
                        );
                  },
            },
            {
                  accessorKey: "status",
                  header: "Status",
                  cell: () => (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-100 text-[10px] py-0.5 uppercase tracking-wider font-semibold">
                              Pending
                        </Badge>
                  ),
            },
            {
                  accessorKey: "createdAt",
                  header: "Sent Date",
                  cell: ({ row }) => formatDate!(row.original.createdAt),
            },
            {
                  id: "message",
                  header: "Message",
                  cell: ({ row }) => (
                        <Typography variant="xs-regular" className="text-grey-blue italic truncate max-w-[200px]">
                              {row.original.message || "No message included"}
                        </Typography>
                  ),
            },
      ];

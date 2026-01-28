"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "nextjs-toploader/app";
import {
      useCancelConnectionRequest,
      useSendConnectionRequest,
} from "@/hooks/useConnections";
import { toast } from "sonner";
import { ConnectionStatus } from "@/interfaces/connection.types";
import { cn } from "@/lib/utils";

interface ConnectButtonProps {
      receiverId: string; // The userId of the professional
      professionalId: string; // The _id of the professional profile
      initialIsConnected?: boolean;
      initialConnectionStatus?: ConnectionStatus;
      initialRequestId?: string;
      className?: string;
}

export const ConnectButton = ({
      receiverId,
      professionalId,
      initialIsConnected = false,
      initialConnectionStatus,
      initialRequestId,
      className,
}: ConnectButtonProps) => {
      const [isConnected, setIsConnected] = useState(initialIsConnected);
      const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | undefined>(
            initialConnectionStatus
      );
      const [requestId, setRequestId] = useState<string | undefined>(initialRequestId);

      // Keep internal state in sync with props if they change
      useEffect(() => {
            setIsConnected(initialIsConnected);
            setConnectionStatus(initialConnectionStatus);
            setRequestId(initialRequestId);
      }, [initialIsConnected, initialConnectionStatus, initialRequestId]);

      const userId = useAuthStore((state) => state.session.user?._id);
      const isCurrentUser = userId === receiverId;
      const router = useRouter();

      const { mutateAsync: sendRequest, isPending: isSending } = useSendConnectionRequest();
      const { mutateAsync: cancelRequest, isPending: isCancelling } = useCancelConnectionRequest();

      const handleConnection = async (e: React.MouseEvent) => {
            e.stopPropagation();

            if (!userId) {
                  toast.error("Please login to connect with professionals");
                  return;
            }

            // Prevent double clicks if already processing
            if (isSending || isCancelling) return;

            if (connectionStatus === "ACCEPTED") {
                  toast.info("You are already connected");
                  return;
            }

            if (connectionStatus === "PENDING") {
                  if (!requestId) {
                        toast.error("Request ID not found. Please refresh.");
                        return;
                  }

                  const prevStatus = connectionStatus;
                  const prevIsConnected = isConnected;
                  const prevRequestId = requestId;

                  // Optimistic update
                  setConnectionStatus(null);
                  setIsConnected(false);
                  setRequestId(undefined); // Clear requestId optimistically

                  try {
                        await cancelRequest(requestId);
                        toast.success("Connection request cancelled");
                  } catch (error) {
                        // Revert on error
                        setConnectionStatus(prevStatus);
                        setIsConnected(prevIsConnected);
                        setRequestId(prevRequestId);
                        toast.error("Failed to cancel request");
                  }
            } else {
                  const prevStatus = connectionStatus;
                  const prevIsConnected = isConnected;

                  // Optimistic update
                  setConnectionStatus("PENDING");
                  setIsConnected(false);

                  try {
                        const response = await sendRequest({ receiverId });
                        // Accessing response.data.id based on ConnectionRequestResponse interface
                        if (response.data?.id) {
                              setRequestId(response.data.id);
                        } else if ((response as any).data?._id) {
                              // Fallback for different API response formats if necessary
                              setRequestId((response as any).data._id);
                        }
                        toast.success("Connection request sent");
                  } catch (error) {
                        // Revert on error
                        setConnectionStatus(prevStatus);
                        setIsConnected(prevIsConnected);
                        toast.error("Failed to send request");
                  }
            }
      };

      if (isCurrentUser) {
            return (
                  <Button
                        onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/jobs/jobseeker/${professionalId}`);
                        }}
                        className={cn("w-full rounded-lg py-2.5 font-semibold transition-all z-20 relative", className)}
                        variant="primary"
                        width="full"
                  >
                        View Profile
                  </Button>
            );
      }

      return (
            <Button
                  isLoading={isSending || isCancelling}
                  disabled={isSending || isCancelling}
                  onClick={handleConnection}
                  className={cn("w-full rounded-lg py-2.5 font-semibold transition-all z-20 relative", className)}
                  variant={
                        connectionStatus === "PENDING" || connectionStatus === "ACCEPTED"
                              ? "outline"
                              : "primary"
                  }
                  width="full"
            >
                  {connectionStatus === "ACCEPTED"
                        ? "Connected"
                        : connectionStatus === "PENDING"
                              ? "Cancel Request"
                              : connectionStatus === "REJECTED"
                                    ? "Resend Request"
                                    : "Connect"}
            </Button>
      );
};

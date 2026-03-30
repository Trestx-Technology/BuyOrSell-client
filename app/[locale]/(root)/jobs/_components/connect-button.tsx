"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "nextjs-toploader/app";
import {
      useCancelConnectionRequest,
      useSendConnectionRequest,
} from "@/hooks/useConnections";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import { toast } from "sonner";
import { ConnectionStatus } from "@/interfaces/connection.types";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";

export type ConnectButtonRenderProps = {
      isConnected: boolean;
      connectionStatus: ConnectionStatus;
      handleConnection: (e: React.MouseEvent) => void;
      isLoading: boolean;
      requestId?: string;
};

interface ConnectButtonProps {
      receiverId: string; // The userId of the professional
      professionalId: string; // The _id of the professional profile
      organisationId?: string; // Optional organization identity
      initialIsConnected?: boolean;
      initialConnectionStatus?: ConnectionStatus;
      initialRequestId?: string;
      className?: string;
      render?: (props: ConnectButtonRenderProps) => React.ReactNode;
      children?: React.ReactNode;
}

export const ConnectButton = ({
      receiverId,
      professionalId,
      organisationId,
      initialIsConnected = false,
      initialConnectionStatus,
      initialRequestId,
      className,
      render,
      children,
      ...props
}: ConnectButtonProps & Omit<React.ComponentProps<typeof Button>, "children">) => {
      const { t } = useLocale();

      const normalizeStatus = (status: any): ConnectionStatus => {
            if (status === "APPROVED" || status === "ACCEPTED") return "ACCEPTED";
            if (status === "PENDING") return "PENDING";
            if (status === "REJECTED") return "REJECTED";
            return null;
      };

      const [isConnected, setIsConnected] = useState(initialIsConnected);
      const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
            normalizeStatus(initialConnectionStatus)
      );
      const [requestId, setRequestId] = useState<string | undefined>(initialRequestId);
      const [showProfileDialog, setShowProfileDialog] = useState(false);

      // Keep internal state in sync with props if they change
      useEffect(() => {
            setIsConnected(initialIsConnected);
            setConnectionStatus(normalizeStatus(initialConnectionStatus));
            setRequestId(initialRequestId);
      }, [initialIsConnected, initialConnectionStatus, initialRequestId]);

      const userId = useAuthStore((state) => state.session.user?._id);
      const isCurrentUser = userId === receiverId;
      const router = useRouter();

      const { mutateAsync: sendRequest, isPending: isSending } = useSendConnectionRequest();
      const { mutateAsync: cancelRequest, isPending: isCancelling } = useCancelConnectionRequest();
      const { data: jobseekerData, isLoading: isJobseekerLoading } = useGetJobseekerProfile();

      const isLoading = isSending || isCancelling;

      const handleConnection = async (e: React.MouseEvent) => {
            e.stopPropagation();

            if (!userId) {
                  toast.error(t.jobs.messages.loginToConnect);
                  return;
            }

            // Prevent double clicks if already processing
            if (isLoading) return;

            if (connectionStatus === "ACCEPTED") {
                  toast.info(t.jobs.messages.alreadyConnected);
                  return;
            }

            if (connectionStatus === "PENDING") {
                  if (!requestId) {
                        toast.error(t.jobs.messages.requestIdNotFound);
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
                        toast.success(t.jobs.messages.requestCancelled);
                  } catch (error) {
                        // Revert on error
                        setConnectionStatus(prevStatus);
                        setIsConnected(prevIsConnected);
                        setRequestId(prevRequestId);
                        toast.error(t.jobs.messages.failedToCancel);
                  }
            } else {
                  // If connecting as an individual (no organisationId), require jobseeker profile
                  if (!organisationId && !jobseekerData?.data && !isJobseekerLoading) {
                        setShowProfileDialog(true);
                        return;
                  }

                  const prevStatus = connectionStatus;
                  const prevIsConnected = isConnected;

                  // Optimistic update
                  setConnectionStatus("PENDING");
                  setIsConnected(false);

                  try {
                        const response = await sendRequest({
                              receiverId,
                              organisationId
                        });
                        // Accessing response.data.id based on ConnectionRequestResponse interface
                        if (response.data?.id) {
                              setRequestId(response.data.id);
                        } else if ((response as any).data?._id) {
                              // Fallback for different API response formats if necessary
                              setRequestId((response as any).data._id);
                        }
                        toast.success(t.jobs.messages.requestSent);
                  } catch (error) {
                        // Revert on error
                        setConnectionStatus(prevStatus);
                        setIsConnected(prevIsConnected);
                        toast.error(t.jobs.messages.failedToSend);
                  }
            }
      };

      const renderContent = () => {
            if (isCurrentUser) {
                  if (render) {
                        return <>{render({ isConnected, connectionStatus, handleConnection, isLoading, requestId })}</>;
                  }
                  return (
                        <Button
                              onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/jobs/jobseeker/${professionalId}`);
                              }}
                              className={cn("w-full rounded-lg py-2.5 font-semibold transition-all z-20 relative", className)}
                              variant="primary"
                              width="full"
                              {...props}
                        >
                              {children || t.jobs.actions.viewProfile}
                        </Button>
                  );
            }

            if (render) {
                  return <>{render({ isConnected, connectionStatus, handleConnection, isLoading, requestId })}</>;
            }

            return (
                  <Button
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={handleConnection}
                        className={cn("w-full rounded-lg py-2.5 font-semibold transition-all z-20 relative", className)}
                        variant={
                              connectionStatus === "PENDING" || connectionStatus === "ACCEPTED"
                                    ? "outline"
                                    : "primary"
                        }
                        width="full"
                        {...props}
                  >
                        {children || (
                              connectionStatus === "ACCEPTED"
                                    ? t.jobs.actions.connected
                                    : connectionStatus === "PENDING"
                                          ? t.jobs.actions.cancelRequest
                                          : connectionStatus === "REJECTED"
                                                ? t.jobs.actions.resendRequest
                                                : t.jobs.actions.connect
                        )}
                  </Button>
            );
      };

      return (
            <>
                  {renderContent()}

                  <WarningConfirmationDialog
                        open={showProfileDialog}
                        onOpenChange={setShowProfileDialog}
                        title={t.jobs.messages.createProfileTitle || "Jobseeker Profile Required"}
                        description={t.jobs.messages.createProfileDescription || "You need to create a jobseeker profile to connect with other jobseeker profiles."}
                        confirmText={t.jobs.actions.createProfile || "Create Profile"}
                        cancelText={t.common.cancel || "Cancel"}
                        onConfirm={() => {
                              setShowProfileDialog(false);
                              router.push("/jobs/jobseeker/new");
                        }}
                        confirmVariant="primary"
                  />
            </>
      );
};

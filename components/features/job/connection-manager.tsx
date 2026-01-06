"use client";

import React, { useState, useCallback } from "react";
import {
  useSendConnectionRequest,
  useAcceptConnectionRequest,
  useRejectConnectionRequest,
  useCancelConnectionRequest,
  useRemoveConnection,
} from "@/hooks/useConnections";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | null;
export type ConnectionDirection = "OUTGOING" | "INCOMING" | null;

export interface ConnectionState {
  status: ConnectionStatus;
  direction: ConnectionDirection;
  requestId: string | null;
}

export interface ConnectionManagerResult {
  connectionState: ConnectionState;
  isProcessing: boolean;
  sendRequest: () => void;
  cancelRequest: () => void;
  acceptRequest: () => void;
  rejectRequest: () => void;
  removeConnection: () => void;
}

export interface UseConnectionManagerOptions {
  userId: string;
  initialStatus?: ConnectionStatus;
  initialDirection?: ConnectionDirection;
  initialRequestId?: string | null;
  onStatusChange?: (status: ConnectionStatus, success: boolean) => void;
  showConfirmation?: boolean;
  confirmationMessages?: {
    send?: string;
    cancel?: string;
    accept?: string;
    reject?: string;
    remove?: string;
  };
}

/**
 * Hook for managing connection requests with confirmation modals
 */
export function useConnectionManager({
  userId,
  initialStatus = null,
  initialDirection = null,
  initialRequestId = null,
  onStatusChange,
  showConfirmation = true,
  confirmationMessages = {},
}: UseConnectionManagerOptions): ConnectionManagerResult {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: initialStatus,
    direction: initialDirection,
    requestId: initialRequestId,
  });

  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Mutation hooks
  const sendRequestMutation = useSendConnectionRequest();
  const cancelRequestMutation = useCancelConnectionRequest();
  const acceptRequestMutation = useAcceptConnectionRequest();
  const rejectRequestMutation = useRejectConnectionRequest();
  const removeConnectionMutation = useRemoveConnection();

  const isProcessing =
    sendRequestMutation.isPending ||
    cancelRequestMutation.isPending ||
    acceptRequestMutation.isPending ||
    rejectRequestMutation.isPending ||
    removeConnectionMutation.isPending;

  const handleStatusUpdate = useCallback(
    (
      newStatus: ConnectionStatus,
      newDirection: ConnectionDirection,
      newRequestId: string | null,
      success: boolean
    ) => {
      setConnectionState({
        status: newStatus,
        direction: newDirection,
        requestId: newRequestId,
      });
      onStatusChange?.(newStatus, success);
    },
    [onStatusChange]
  );

  const handleSendRequest = useCallback(async () => {
    if (showConfirmation) {
      setShowSendConfirm(true);
      return;
    }
    await executeSendRequest();
  }, [showConfirmation]);

  const executeSendRequest = useCallback(async () => {
    try {
      const response = await sendRequestMutation.mutateAsync({
        receiverId: userId,
      });
      const requestId = response.data?.id || null;
      handleStatusUpdate("PENDING", "OUTGOING", requestId, true);
      toast.success("Connection request sent successfully");
      setShowSendConfirm(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send connection request";
      toast.error(errorMessage);
      handleStatusUpdate(
        connectionState.status,
        connectionState.direction,
        connectionState.requestId,
        false
      );
      setShowSendConfirm(false);
    }
  }, [userId, sendRequestMutation, handleStatusUpdate, connectionState]);

  const handleCancelRequest = useCallback(async () => {
    if (showConfirmation) {
      setShowCancelConfirm(true);
      return;
    }
    await executeCancelRequest();
  }, [showConfirmation]);

  const executeCancelRequest = useCallback(async () => {
    if (!connectionState.requestId) {
      toast.error("Request ID not found");
      return;
    }
    try {
      await cancelRequestMutation.mutateAsync(connectionState.requestId);
      handleStatusUpdate(null, null, null, true);
      toast.success("Connection request cancelled");
      setShowCancelConfirm(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel connection request";
      toast.error(errorMessage);
      handleStatusUpdate(
        connectionState.status,
        connectionState.direction,
        connectionState.requestId,
        false
      );
      setShowCancelConfirm(false);
    }
  }, [
    connectionState.requestId,
    cancelRequestMutation,
    handleStatusUpdate,
    connectionState,
  ]);

  const handleAcceptRequest = useCallback(async () => {
    if (showConfirmation) {
      setShowAcceptConfirm(true);
      return;
    }
    await executeAcceptRequest();
  }, [showConfirmation]);

  const executeAcceptRequest = useCallback(async () => {
    if (!connectionState.requestId) {
      toast.error("Request ID not found");
      return;
    }
    try {
      await acceptRequestMutation.mutateAsync(connectionState.requestId);
      handleStatusUpdate("ACCEPTED", null, connectionState.requestId, true);
      toast.success("Connection request accepted");
      setShowAcceptConfirm(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to accept connection request";
      toast.error(errorMessage);
      handleStatusUpdate(
        connectionState.status,
        connectionState.direction,
        connectionState.requestId,
        false
      );
      setShowAcceptConfirm(false);
    }
  }, [
    connectionState.requestId,
    acceptRequestMutation,
    handleStatusUpdate,
    connectionState,
  ]);

  const handleRejectRequest = useCallback(async () => {
    if (showConfirmation) {
      setShowRejectConfirm(true);
      return;
    }
    await executeRejectRequest();
  }, [showConfirmation]);

  const executeRejectRequest = useCallback(async () => {
    if (!connectionState.requestId) {
      toast.error("Request ID not found");
      return;
    }
    try {
      await rejectRequestMutation.mutateAsync(connectionState.requestId);
      handleStatusUpdate("REJECTED", null, null, true);
      toast.success("Connection request rejected");
      setShowRejectConfirm(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reject connection request";
      toast.error(errorMessage);
      handleStatusUpdate(
        connectionState.status,
        connectionState.direction,
        connectionState.requestId,
        false
      );
      setShowRejectConfirm(false);
    }
  }, [
    connectionState.requestId,
    rejectRequestMutation,
    handleStatusUpdate,
    connectionState,
  ]);

  const handleRemoveConnection = useCallback(async () => {
    if (showConfirmation) {
      setShowRemoveConfirm(true);
      return;
    }
    await executeRemoveConnection();
  }, [showConfirmation]);

  const executeRemoveConnection = useCallback(async () => {
    if (!connectionState.requestId) {
      toast.error("Connection ID not found");
      return;
    }
    try {
      await removeConnectionMutation.mutateAsync(connectionState.requestId);
      handleStatusUpdate(null, null, null, true);
      toast.success("Connection removed");
      setShowRemoveConfirm(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove connection";
      toast.error(errorMessage);
      handleStatusUpdate(
        connectionState.status,
        connectionState.direction,
        connectionState.requestId,
        false
      );
      setShowRemoveConfirm(false);
    }
  }, [
    connectionState.requestId,
    removeConnectionMutation,
    handleStatusUpdate,
    connectionState,
  ]);

  const defaultMessages = {
    send: "Are you sure you want to send a connection request?",
    cancel: "Are you sure you want to cancel this connection request?",
    accept: "Are you sure you want to accept this connection request?",
    reject: "Are you sure you want to reject this connection request?",
    remove: "Are you sure you want to remove this connection?",
  };

  const messages = { ...defaultMessages, ...confirmationMessages };

  return {
    connectionState,
    isProcessing,
    sendRequest: handleSendRequest,
    cancelRequest: handleCancelRequest,
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
    removeConnection: handleRemoveConnection,
    // Internal state for modals (exposed for ConnectionManager component)
    _modals: {
      showSendConfirm,
      setShowSendConfirm,
      showCancelConfirm,
      setShowCancelConfirm,
      showAcceptConfirm,
      setShowAcceptConfirm,
      showRejectConfirm,
      setShowRejectConfirm,
      showRemoveConfirm,
      setShowRemoveConfirm,
      executeSendRequest,
      executeCancelRequest,
      executeAcceptRequest,
      executeRejectRequest,
      executeRemoveConnection,
      messages,
    },
  } as ConnectionManagerResult & {
    _modals: {
      showSendConfirm: boolean;
      setShowSendConfirm: (show: boolean) => void;
      showCancelConfirm: boolean;
      setShowCancelConfirm: (show: boolean) => void;
      showAcceptConfirm: boolean;
      setShowAcceptConfirm: (show: boolean) => void;
      showRejectConfirm: boolean;
      setShowRejectConfirm: (show: boolean) => void;
      showRemoveConfirm: boolean;
      setShowRemoveConfirm: (show: boolean) => void;
      executeSendRequest: () => Promise<void>;
      executeCancelRequest: () => Promise<void>;
      executeAcceptRequest: () => Promise<void>;
      executeRejectRequest: () => Promise<void>;
      executeRemoveConnection: () => Promise<void>;
      messages: typeof defaultMessages;
    };
  };
}

/**
 * Connection Manager Component - Renders confirmation modals
 */
interface ConnectionManagerProps {
  manager: ReturnType<typeof useConnectionManager>;
  userName?: string;
}

export function ConnectionManager({
  manager,
  userName,
}: ConnectionManagerProps) {
  const modals = (manager as any)._modals;

  if (!modals) {
    return null;
  }

  return (
    <>
      {/* Send Request Confirmation */}
      <ResponsiveModal
        open={modals.showSendConfirm}
        onOpenChange={modals.setShowSendConfirm}
      >
        <ResponsiveModalContent className="sm:max-w-md">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Send Connection Request</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {modals.messages.send}
              {userName && <span className="font-semibold"> {userName}</span>}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <ResponsiveModalFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => modals.setShowSendConfirm(false)}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={modals.executeSendRequest}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              {manager.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>

      {/* Cancel Request Confirmation */}
      <ResponsiveModal
        open={modals.showCancelConfirm}
        onOpenChange={modals.setShowCancelConfirm}
      >
        <ResponsiveModalContent className="sm:max-w-md">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Cancel Connection Request
            </ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {modals.messages.cancel}
              {userName && <span className="font-semibold"> {userName}</span>}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <ResponsiveModalFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => modals.setShowCancelConfirm(false)}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              No, Keep It
            </Button>
            <Button
              variant="danger"
              onClick={modals.executeCancelRequest}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              {manager.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>

      {/* Accept Request Confirmation */}
      <ResponsiveModal
        open={modals.showAcceptConfirm}
        onOpenChange={modals.setShowAcceptConfirm}
      >
        <ResponsiveModalContent className="sm:max-w-md">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Accept Connection Request
            </ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {modals.messages.accept}
              {userName && <span className="font-semibold"> {userName}</span>}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <ResponsiveModalFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => modals.setShowAcceptConfirm(false)}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={modals.executeAcceptRequest}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              {manager.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept"
              )}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>

      {/* Reject Request Confirmation */}
      <ResponsiveModal
        open={modals.showRejectConfirm}
        onOpenChange={modals.setShowRejectConfirm}
      >
        <ResponsiveModalContent className="sm:max-w-md">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Reject Connection Request
            </ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {modals.messages.reject}
              {userName && <span className="font-semibold"> {userName}</span>}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <ResponsiveModalFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => modals.setShowRejectConfirm(false)}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={modals.executeRejectRequest}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              {manager.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>

      {/* Remove Connection Confirmation */}
      <ResponsiveModal
        open={modals.showRemoveConfirm}
        onOpenChange={modals.setShowRemoveConfirm}
      >
        <ResponsiveModalContent className="sm:max-w-md">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Remove Connection</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {modals.messages.remove}
              {userName && <span className="font-semibold"> {userName}</span>}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <ResponsiveModalFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => modals.setShowRemoveConfirm(false)}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={modals.executeRemoveConnection}
              disabled={manager.isProcessing}
              className="flex-1 sm:flex-initial"
            >
              {manager.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
}

/**
 * Wrapper component that combines the hook and modal component
 */
interface ConnectionManagerWrapperProps extends UseConnectionManagerOptions {
  children: (manager: ConnectionManagerResult) => React.ReactNode;
  userName?: string;
}

export function ConnectionManagerWrapper({
  children,
  userName,
  ...options
}: ConnectionManagerWrapperProps) {
  const manager = useConnectionManager(options);

  return (
    <>
      <ConnectionManager manager={manager} userName={userName} />
      {children(manager)}
    </>
  );
}

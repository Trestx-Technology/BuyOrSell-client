export const connectionQueries = {
  // Send a connection request to another user
  sendRequest: {
    Key: ["connections", "request", "send"],
    endpoint: "/connections/request",
  },
  // Accept a connection request
  acceptRequest: (id: string) => ({
    Key: ["connections", id, "accept"],
    endpoint: `/connections/${id}/accept`,
  }),
  // Reject a connection request
  rejectRequest: (id: string) => ({
    Key: ["connections", id, "reject"],
    endpoint: `/connections/${id}/reject`,
  }),
  // Cancel a pending connection request (sent by you)
  cancelRequest: (id: string) => ({
    Key: ["connections", id, "cancel"],
    endpoint: `/connections/${id}/cancel`,
  }),
  // Remove an accepted connection
  removeConnection: (id: string) => ({
    Key: ["connections", id, "remove"],
    endpoint: `/connections/${id}`,
  }),
  // Get my connections with optional status filter
  getMyConnections: {
    Key: ["connections", "my"],
    endpoint: "/connections/my-connections",
  },
  // Get sent connection requests (pending)
  getSentRequests: {
    Key: ["connections", "requests", "sent"],
    endpoint: "/connections/requests/sent",
  },
  // Get received connection requests (pending)
  getReceivedRequests: {
    Key: ["connections", "requests", "received"],
    endpoint: "/connections/requests/received",
  },
  // Get connection level with another user (1st, 2nd, 3rd degree or no connection)
  getConnectionLevel: (userId: string) => ({
    Key: ["connections", "level", userId],
    endpoint: `/connections/level/${userId}`,
  }),
  // Check if you can chat with a user (requires accepted connection)
  canChat: (userId: string) => ({
    Key: ["connections", "can-chat", userId],
    endpoint: `/connections/can-chat/${userId}`,
  }),
};

export const paymentQueries = {
  refundPayment: {
    endpoint: "/payments/refund",
    Key: ["refundPayment"],
  },
  createCheckoutSession: {
    endpoint: "/payments/checkout-session",
    Key: ["createCheckoutSession"],
  },
  completeCheckoutSession: (sessionId: string) => ({
    endpoint: `/payments/checkout-session/${sessionId}`,
    Key: ["completeCheckoutSession", sessionId],
  }),
  getUserPayments: (userId: string) => ({
    endpoint: `/payments/user/${userId}`,
    Key: ["getUserPayments", userId],
  }),
  getUserAddonPayments: (userId: string) => ({
    endpoint: `/payments/user/${userId}/addons`,
    Key: ["getUserAddonPayments", userId],
  }),
  getSubscriptionAddonPayments: (subscriptionId: string) => ({
    endpoint: `/payments/subscription/${subscriptionId}/addons`,
    Key: ["getSubscriptionAddonPayments", subscriptionId],
  }),
};

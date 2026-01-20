export const paymentQueries = {
  refundPayment: {
    endpoint: "/payments/refund",
    Key: ["refundPayment"],
  },
  createPaymentIntent: {
    endpoint: "/payments/create-intent",
    Key: ["createPaymentIntent"],
  },
  createCheckoutSession: {
    endpoint: "/payments/checkout-session",
    Key: ["createCheckoutSession"],
  },
  confirmPaymentIntent: {
    endpoint: "/payments/confirm",
    Key: ["confirmPaymentIntent"],
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

export const paymentQueries = {
  createPaymentIntent: {
    endpoint: "/payments/create",
    Key: ["createPaymentIntent"],
  },
  confirmPaymentIntent: (paymentIntentId: string) => ({
    endpoint: `/payments/confirm/${paymentIntentId}`,
    Key: ["confirmPaymentIntent", paymentIntentId],
  }),
  getPaymentIntent: (paymentIntentId: string) => ({
    endpoint: `/payments/${paymentIntentId}`,
    Key: ["getPaymentIntent", paymentIntentId],
  }),
};

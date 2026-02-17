export const subscriptionQueries = {
  createSubscription: {
    endpoint: "/subscriptions",
    Key: ["createSubscription"],
  },
  getAllSubscriptions: {
    endpoint: "/subscriptions",
    Key: ["getAllSubscriptions"],
  },
  updateSubscription: {
    endpoint: "/subscriptions",
    Key: ["updateSubscription"],
  },
  getSubscriptionUsers: (planId: string) => ({
    endpoint: `/subscriptions/${planId}/users`,
    Key: ["getSubscriptionUsers", planId],
  }),
  getMySubscription: {
    endpoint: "/subscriptions/my",
    Key: ["getMySubscription"],
  },
  getMyActiveSubscription: {
    endpoint: "/subscriptions/my/active",
    Key: ["getMyActiveSubscription"],
  },
  incrementAiUsage: (subscriptionId: string) => ({
    endpoint: `/subscriptions/${subscriptionId}/ai/increment`,
    Key: ["incrementAiUsage", subscriptionId],
  }),
  stopRecurringSubscription: (subscriptionId: string) => ({
    endpoint: `/subscriptions/${subscriptionId}/stop-recurring`,
    Key: ["stopRecurringSubscription", subscriptionId],
  }),
};

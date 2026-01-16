export const subscriptionQueries = {
  createSubscription: {
    endpoint: '/subscriptions',
    Key: ['createSubscription'],
  },
  getAllSubscriptions: {
    endpoint: '/subscriptions',
    Key: ['getAllSubscriptions'],
  },
  updateSubscription: {
    endpoint: '/subscriptions',
    Key: ['updateSubscription'],
  },
  getSubscriptionUsers: (planId: string) => ({
    endpoint: `/subscriptions/${planId}/users`,
    Key: ['getSubscriptionUsers', planId],
  }),
  getMySubscription: {
    endpoint: '/subscriptions/my',
    Key: ['getMySubscription'],
  },
  getMyActiveSubscription: {
    endpoint: '/subscriptions/my/active',
    Key: ['getMyActiveSubscription'],
  },
};

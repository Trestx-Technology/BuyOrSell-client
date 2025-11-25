export const userQueries = {
  findAllUsers: {
    Key: ['users'],
    endpoint: '/users',
  },
  createUser: {
    Key: ['user', 'create'],
    endpoint: '/users',
  },
  sendEmailOtp: {
    Key: ['user', 'email-otp'],
    endpoint: '/send-email-otp',
  },
  sendPhoneOtp: {
    Key: ['user', 'phone-otp'],
    endpoint: '/send-phone-otp',
  },
  sendLoginEmailOtp: {
    Key: ['user', 'login-email-otp'],
    endpoint: '/send-login-email-otp',
  },
  sendLoginPhoneOtp: {
    Key: ['user', 'login-phone-otp'],
    endpoint: '/send-login-phone-otp',
  },
  verifyEmailOtp: {
    Key: ['user', 'verify-email-otp'],
    endpoint: '/verify-email-otp',
  },
  verifyPhoneOtp: {
    Key: ['user', 'verify-phone-otp'],
    endpoint: '/verify-phone-otp',
  },
  getProfile: {
    Key: ['user', 'profile'],
    endpoint: '/users/profile',
  },
  addUserType: (id: string) => ({
    Key: ['user', id, 'user-type', 'add'],
    endpoint: `/users/${id}/user-type`,
  }),
  updateUserType: (id: string) => ({
    Key: ['user', id, 'user-type', 'update'],
    endpoint: `/users/${id}/user-type`,
  }),
  updateUserTypeDeprecated: (id: string) => ({
    Key: ['user', id, 'user-type', 'update-deprecated'],
    endpoint: `/users/${id}/update-user-type`,
  }),
  getUserById: (id: string) => ({
    Key: ['user', id],
    endpoint: `/users/${id}`,
  }),
  updateUser: (id: string) => ({
    Key: ['user', id, 'update'],
    endpoint: `/users/${id}`,
  }),
  deleteUser: (id: string) => ({
    Key: ['user', id, 'delete'],
    endpoint: `/users/${id}`,
  }),
  findAllUsersWithAdsCount: (minCount: string) => ({
    Key: ['users', 'min-ads', minCount],
    endpoint: `/users/minAds/${minCount}`,
  }),
  updateMyEmarati: {
    Key: ['user', 'me', 'emarati'],
    endpoint: '/users/me/emarati',
  },
  adminUpdateEmarati: (id: string) => ({
    Key: ['user', id, 'emarati'],
    endpoint: `/users/${id}/emarati`,
  }),
  blockUser: (id: string) => ({
    Key: ['user', id, 'block'],
    endpoint: `/users/block/${id}`,
  }),
  assignRole: (id: string) => ({
    Key: ['user', id, 'role'],
    endpoint: `/users/${id}/role`,
  }),
  getBlockHistory: (id: string) => ({
    Key: ['user', id, 'block-history'],
    endpoint: `/users/user/${id}/block-history`,
  }),
};


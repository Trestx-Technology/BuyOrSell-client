export const userQueries = {
  findAllUsers: {
    Key: ['users'],
    endpoint: '/users',
  },
  createUser: {
    Key: ['user', 'create'],
    endpoint: '/users',
  },
  sendEmailOtp: (email: string) => ({
    Key: ['user', 'email-otp', email],
    endpoint: `/users/send-email-otp/${email}`,
  }),
  sendPhoneOtp: (phone: string) => ({
    Key: ['user', 'phone-otp', phone],
    endpoint: `/users/send-phone-otp/${phone}`,
  }),
  sendLoginEmailOtp: (email: string) => ({
    Key: ['user', 'login-email-otp', email],
    endpoint: `/users/send-login-email-otp/${email}`,
  }),
  sendLoginPhoneOtp: (phone: string) => ({
    Key: ['user', 'login-phone-otp', phone],
    endpoint: `/users/send-login-phone-otp/${phone}`,
  }),
  verifyEmail: (email: string, code: string) => ({
    Key: ['user', 'verify-email', email, code],
    endpoint: `/users/verify-email/${email}/${code}`,
  }),
  verifyPhone: (phone: string, code: string) => ({
    Key: ['user', 'verify-phone', phone, code],
    endpoint: `/users/verify-phone/${phone}/${code}`,
  }),
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


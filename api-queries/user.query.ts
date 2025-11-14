export const userQueries = {
  // Get all users
  findAllUsers: {
    key: "find-all-users",
    endpoint: "/users",
  },
  // Create user
  createUser: {
    key: "create-user",
    endpoint: "/users",
  },
  // Send email OTP
  sendEmailOtp: {
    key: "send-email-otp",
    endpoint: "/users/send-email-otp/:email",
  },
  // Send phone OTP
  sendPhoneOtp: {
    key: "send-phone-otp",
    endpoint: "/users/send-phone-otp/:phone",
  },
  // Send login email OTP
  sendLoginEmailOtp: {
    key: "send-login-email-otp",
    endpoint: "/users/send-login-email-otp/:email",
  },
  // Send login phone OTP
  sendLoginPhoneOtp: {
    key: "send-login-phone-otp",
    endpoint: "/users/send-login-phone-otp/:phone",
  },
  // Verify email
  verifyEmail: {
    key: "verify-email",
    endpoint: "/users/verify-email/:email/:code",
  },
  // Verify phone
  verifyPhone: {
    key: "verify-phone",
    endpoint: "/users/verify-phone/:phone/:code",
  },
  // Get user profile
  getProfile: {
    key: "get-profile",
    endpoint: "/users/profile",
  },
  // Add user type
  addUserType: {
    key: "add-user-type",
    endpoint: "/users/:id/user-type",
  },
  // Update user type
  updateUserType: {
    key: "update-user-type",
    endpoint: "/users/:id/user-type",
  },
  // Update user type (deprecated)
  updateUserTypeDeprecated: {
    key: "update-user-type-deprecated",
    endpoint: "/users/:id/update-user-type",
  },
  // Get user by ID
  getUserById: {
    key: "get-user-by-id",
    endpoint: "/users/:id",
  },
  // Update user
  updateUser: {
    key: "update-user",
    endpoint: "/users/:id",
  },
  // Delete user
  deleteUser: {
    key: "delete-user",
    endpoint: "/users/:id",
  },
  // Find users with minimum ads count
  findAllUsersWithAdsCount: {
    key: "find-all-users-with-ads-count",
    endpoint: "/users/minAds/:minCount",
  },
  // Update my Emarati status
  updateMyEmarati: {
    key: "update-my-emarati",
    endpoint: "/users/me/emarati",
  },
  // Admin update Emarati status
  adminUpdateEmarati: {
    key: "admin-update-emarati",
    endpoint: "/users/:id/emarati",
  },
  // Block user
  blockUser: {
    key: "block-user",
    endpoint: "/users/block/:id",
  },
  // Assign role
  assignRole: {
    key: "assign-role",
    endpoint: "/users/:id/role",
  },
  // Get block history
  getBlockHistory: {
    key: "get-block-history",
    endpoint: "/users/user/:id/block-history",
  },
};


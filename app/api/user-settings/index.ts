export const userSettingsQueries = {
  createUserSettings: {
    Key: ["user-settings", "create"],
    endpoint: "/user-settings",
  },
  getUserSettings: () => ({
    Key: ["user-settings", "get"],
    endpoint: `/user-settings`,
  }),
  updateUserSettings: {
    Key: ["user-settings", "update"],
    endpoint: "/user-settings",
  },
  deleteUserSettings: {
    Key: ["user-settings", "delete"],
    endpoint: "/user-settings",
  },
};

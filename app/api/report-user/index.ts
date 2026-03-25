export const reportUserQueries = {
  all: {
    Key: ["report-user"],
    endpoint: "/report-user",
  },
  byId: (id: string) => ({
    Key: ["report-user", id],
    endpoint: `/report-user/${id}`,
  }),
  create: {
    Key: ["report-user", "create"],
    endpoint: "/report-user",
  },
  update: (id: string) => ({
    Key: ["report-user", id, "update"],
    endpoint: `/report-user/${id}`,
  }),
  delete: (id: string) => ({
    Key: ["report-user", id, "delete"],
    endpoint: `/report-user/${id}`,
  }),
  byUserId: (userId: string) => ({
    Key: ["report-user", "by-user", userId],
    endpoint: `/report-user/by-user/${userId}`,
  }),
};


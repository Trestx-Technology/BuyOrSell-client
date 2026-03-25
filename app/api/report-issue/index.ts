export const reportIssueQueries = {
  all: {
    Key: ["report-issues"],
    endpoint: "/report-issue",
  },
  byId: (id: string) => ({
    Key: ["report-issue", id],
    endpoint: `/report-issue/${id}`,
  }),
  create: {
    Key: ["report-issue", "create"],
    endpoint: "/report-issue",
  },
  update: (id: string) => ({
    Key: ["report-issue", id, "update"],
    endpoint: `/report-issue/${id}`,
  }),
  delete: (id: string) => ({
    Key: ["report-issue", id, "delete"],
    endpoint: `/report-issue/${id}`,
  }),
};

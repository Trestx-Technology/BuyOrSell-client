export const addressQueries = {
  createAddress: {
    Key: ["address", "create"],
    endpoint: "/address",
  },
  getMyAddresses: {
    Key: ["address", "my"],
    endpoint: "/address/my",
  },
  getAddressById: (id: string) => ({
    Key: ["address", id],
    endpoint: `/address/${id}`,
  }),
  updateAddress: (id: string) => ({
    Key: ["address", id, "update"],
    endpoint: `/address/${id}`,
  }),
  deleteAddress: (id: string) => ({
    Key: ["address", id, "delete"],
    endpoint: `/address/${id}`,
  }),
};

import { CreateSeoDto } from "@/interfaces/seo";

export const seoQueries = {
  getAllSeo: {
    endpoint: "/seo",
    queryKey: ["seo-all"],
  },
  createSeo: {
    endpoint: "/seo",
    queryKey: ["create-seo"],
  },
  getSeoByRoute: (route: string) => ({
    endpoint: `/seo/${route}`,
    queryKey: ["seo-by-route", route],
  }),
};

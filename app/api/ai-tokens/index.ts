export * from "./ai-tokens.services";

export const AI_TOKENS_QUERY_KEYS = {
  balance: ["ai-tokens", "balance"],
  packages: ["ai-tokens", "packages"],
  package: (id: string) => ["ai-tokens", "package", id],
};

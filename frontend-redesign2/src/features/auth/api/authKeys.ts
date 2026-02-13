// src/features/auth/api/authKeys.ts
export const authKeys = {
  all: ["auth"] as const,
  me: () => ["auth", "me"] as const,
};

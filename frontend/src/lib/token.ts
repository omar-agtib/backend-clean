// src/lib/token.ts
const KEY = "chantier.jwt";

function normalizeJwt(t: string) {
  return (t || "").replace(/^Bearer\s+/i, "").trim();
}

export const token = {
  get(): string | null {
    const v = localStorage.getItem(KEY);
    return v ? normalizeJwt(v) : null;
  },
  set(v: string) {
    localStorage.setItem(KEY, normalizeJwt(v));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};

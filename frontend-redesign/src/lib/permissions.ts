// src/lib/permissions.ts
export type Role = "OWNER" | "MANAGER" | "WORKER" | "VIEWER" | string;

function norm(role?: string | null): Role {
  return (role || "OWNER").toUpperCase();
}

/**
 * If role is missing, we default to OWNER to avoid blocking you
 * while backend roles are still evolving.
 */
export function canManagePlans(role?: string | null) {
  const r = norm(role);
  return r === "OWNER" || r === "MANAGER" || r === "WORKER";
}

export function canAnnotate(role?: string | null) {
  const r = norm(role);
  return r === "OWNER" || r === "MANAGER" || r === "WORKER";
}

export function canDeletePins(role?: string | null) {
  const r = norm(role);
  return r === "OWNER" || r === "MANAGER";
}

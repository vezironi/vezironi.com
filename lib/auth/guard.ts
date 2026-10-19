import type { SessionUser } from "./session";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export function isAdmin(user: SessionUser | null, adminId: string): user is SessionUser {
  return user !== null && user.id === adminId;
}

/**
 * In-memory user store.
 *
 * Users are stored in a Map keyed by email for fast lookups.
 * Data is lost on server restart — acceptable per the project spec.
 */

import { User } from "@/types/auth";

const users = new Map<string, User>();

let nextId = 1;

export function createUser(email: string, passwordHash: string): User {
  const user: User = {
    id: String(nextId++),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
  };
  users.set(user.email, user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.get(email.toLowerCase());
}

/**
 * Reset the user store. Used only in tests to ensure isolation.
 */
export function resetUsers(): void {
  users.clear();
  nextId = 1;
}

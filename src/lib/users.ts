/**
 * In-memory user store.
 * Each user has an id, email, and hashed password.
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/** Publicly safe user data (no password hash). */
export interface SafeUser {
  id: string;
  email: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

let nextId = 1;

function generateId(): string {
  return String(nextId++);
}

export function findUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export function createUser(email: string, passwordHash: string): User {
  const id = generateId();
  const user: User = {
    id,
    email,
    passwordHash,
    createdAt: new Date(),
  };
  users.set(id, user);
  return user;
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

/** Clear all users — used in tests only. */
export function clearUsers(): void {
  users.clear();
  nextId = 1;
}

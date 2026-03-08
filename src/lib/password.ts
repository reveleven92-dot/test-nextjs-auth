/**
 * Password hashing utilities using bcryptjs.
 *
 * IMPORTANT: bcryptjs uses Node.js APIs and must NOT be used
 * in Edge Runtime (middleware). Keep usage in API routes only.
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

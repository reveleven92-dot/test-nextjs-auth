import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SALT_ROUNDS = 10;

/**
 * The JWT secret key. In production this should come from an
 * environment variable. We fall back to a default for development only.
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me";
  return new TextEncoder().encode(secret);
}

const TOKEN_EXPIRY = "24h";
const COOKIE_NAME = "auth-token";

export { COOKIE_NAME };

/** Hash a plain-text password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compare a plain-text password against a hash. */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT containing the user id and email. */
export async function createToken(payload: {
  userId: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getJwtSecret());
}

/** Verify and decode a JWT. Returns the payload or null if invalid. */
export async function verifyToken(
  token: string,
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as { userId: string; email: string };
  } catch {
    return null;
  }
}

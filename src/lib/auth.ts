/**
 * JWT utilities using the `jose` library.
 *
 * `jose` is Edge Runtime compatible, so these functions can be
 * used in both API routes and middleware.
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "dev-secret-change-in-production";
const TOKEN_EXPIRY = "24h";
const AUTH_COOKIE_NAME = "auth-token";

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET_KEY);
}

export async function createToken(payload: {
  sub: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecretKey());
}

export async function verifyToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

export { AUTH_COOKIE_NAME };

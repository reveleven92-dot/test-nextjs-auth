/**
 * POST /api/auth/login
 *
 * Authenticates a user with email and password. Returns a JWT token on success.
 */

import { NextRequest } from "next/server";
import { validateLoginInput } from "@/lib/validation";
import { verifyPassword } from "@/lib/password";
import { createToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/users";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const email = body.email ?? "";
  const password = body.password ?? "";

  // Validate input
  const validation = validateLoginInput(email, password);
  if (!validation.valid) {
    return errorResponse("Validation failed", 400, validation.errors);
  }

  // Look up user
  const user = findUserByEmail(email);
  if (!user) {
    return errorResponse("Invalid email or password", 401);
  }

  // Verify password
  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    return errorResponse("Invalid email or password", 401);
  }

  // Generate JWT
  const token = await createToken({ sub: user.id, email: user.email });

  return successResponse({ token, user: { id: user.id, email: user.email } });
}

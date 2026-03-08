/**
 * POST /api/auth/register
 *
 * Creates a new user account. Returns a JWT token on success.
 */

import { NextRequest } from "next/server";
import { validateRegisterInput } from "@/lib/validation";
import { hashPassword } from "@/lib/password";
import { createToken } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/users";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; confirmPassword?: string };

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const email = body.email ?? "";
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  // Validate input
  const validation = validateRegisterInput(email, password, confirmPassword);
  if (!validation.valid) {
    return errorResponse("Validation failed", 400, validation.errors);
  }

  // Check for duplicate email
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return errorResponse("An account with this email already exists", 409);
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const user = createUser(email, passwordHash);

  // Generate JWT
  const token = await createToken({ sub: user.id, email: user.email });

  return successResponse(
    { token, user: { id: user.id, email: user.email } },
    201
  );
}

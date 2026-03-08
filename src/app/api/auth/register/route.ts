import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createToken, COOKIE_NAME } from "@/lib/auth";
import { createUser, findUserByEmail, toSafeUser } from "@/lib/users";
import { validateRegisterInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON body.", meta: null },
      { status: 400 },
    );
  }

  const { errors, email, password } = validateRegisterInput(body);

  if (errors.length > 0) {
    return NextResponse.json(
      { data: null, error: errors, meta: null },
      { status: 400 },
    );
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      {
        data: null,
        error: [
          { field: "email", message: "An account with this email already exists." },
        ],
        meta: null,
      },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = createUser(email, passwordHash);
  const token = await createToken({ userId: user.id, email: user.email });

  const response = NextResponse.json(
    { data: { user: toSafeUser(user) }, error: null, meta: null },
    { status: 201 },
  );

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

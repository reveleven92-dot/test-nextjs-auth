import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth";
import { findUserByEmail, toSafeUser } from "@/lib/users";
import { validateLoginInput } from "@/lib/validation";

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

  const { errors, email, password } = validateLoginInput(body);

  if (errors.length > 0) {
    return NextResponse.json(
      { data: null, error: errors, meta: null },
      { status: 400 },
    );
  }

  const user = findUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      {
        data: null,
        error: [
          { field: "email", message: "Invalid email or password." },
        ],
        meta: null,
      },
      { status: 401 },
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      {
        data: null,
        error: [
          { field: "email", message: "Invalid email or password." },
        ],
        meta: null,
      },
      { status: 401 },
    );
  }

  const token = await createToken({ userId: user.id, email: user.email });

  const response = NextResponse.json(
    { data: { user: toSafeUser(user) }, error: null, meta: null },
    { status: 200 },
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

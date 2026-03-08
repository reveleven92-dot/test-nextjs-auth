import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { findUserById, toSafeUser } from "@/lib/users";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { data: null, error: "Not authenticated.", meta: null },
      { status: 401 },
    );
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { data: null, error: "Invalid or expired token.", meta: null },
      { status: 401 },
    );
  }

  const user = findUserById(payload.userId);
  if (!user) {
    return NextResponse.json(
      { data: null, error: "User not found.", meta: null },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { data: { user: toSafeUser(user) }, error: null, meta: null },
    { status: 200 },
  );
}

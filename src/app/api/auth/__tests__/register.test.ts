import { POST } from "@/app/api/auth/register/route";
import { clearUsers, findUserByEmail } from "@/lib/users";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  clearUsers();
});

describe("POST /api/auth/register", () => {
  // Happy path
  it("creates a new user and returns 201 with a cookie", async () => {
    const res = await POST(
      makeRequest({
        email: "new@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    );

    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.data.user.email).toBe("new@example.com");
    expect(json.data.user).not.toHaveProperty("passwordHash");
    expect(json.error).toBeNull();

    // A user should now exist in the store.
    expect(findUserByEmail("new@example.com")).toBeDefined();

    // An auth cookie should be set.
    const cookie = res.cookies.get("auth-token");
    expect(cookie).toBeDefined();
    expect(cookie!.value.length).toBeGreaterThan(0);
  });

  // Negative: missing fields
  it("returns 400 when fields are missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error.length).toBeGreaterThanOrEqual(2);
  });

  // Negative: invalid email
  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({
        email: "not-an-email",
        password: "password123",
        confirmPassword: "password123",
      }),
    );
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error.some((e: { field: string }) => e.field === "email")).toBe(
      true,
    );
  });

  // Negative: password too short
  it("returns 400 when password is too short", async () => {
    const res = await POST(
      makeRequest({
        email: "user@example.com",
        password: "short",
        confirmPassword: "short",
      }),
    );
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(
      json.error.some((e: { field: string }) => e.field === "password"),
    ).toBe(true);
  });

  // Negative: passwords do not match
  it("returns 400 when passwords do not match", async () => {
    const res = await POST(
      makeRequest({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "different123",
      }),
    );
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(
      json.error.some(
        (e: { field: string }) => e.field === "confirmPassword",
      ),
    ).toBe(true);
  });

  // Negative: duplicate email
  it("returns 409 when email is already taken", async () => {
    // Register once.
    await POST(
      makeRequest({
        email: "dupe@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    );

    // Try again with the same email.
    const res = await POST(
      makeRequest({
        email: "dupe@example.com",
        password: "password456",
        confirmPassword: "password456",
      }),
    );
    expect(res.status).toBe(409);

    const json = await res.json();
    expect(json.error[0].field).toBe("email");
  });
});

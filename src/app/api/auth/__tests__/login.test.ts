import { POST as registerPOST } from "@/app/api/auth/register/route";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { clearUsers } from "@/lib/users";
import { NextRequest } from "next/server";

function makeRequest(
  url: string,
  body: unknown,
): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  clearUsers();

  // Seed a user for login tests.
  await registerPOST(
    makeRequest("http://localhost:3000/api/auth/register", {
      email: "existing@example.com",
      password: "password123",
      confirmPassword: "password123",
    }),
  );
});

describe("POST /api/auth/login", () => {
  // Happy path
  it("logs in with valid credentials and returns 200 with a cookie", async () => {
    const res = await loginPOST(
      makeRequest("http://localhost:3000/api/auth/login", {
        email: "existing@example.com",
        password: "password123",
      }),
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.data.user.email).toBe("existing@example.com");
    expect(json.data.user).not.toHaveProperty("passwordHash");
    expect(json.error).toBeNull();

    const cookie = res.cookies.get("auth-token");
    expect(cookie).toBeDefined();
    expect(cookie!.value.length).toBeGreaterThan(0);
  });

  // Negative: missing fields
  it("returns 400 when fields are missing", async () => {
    const res = await loginPOST(
      makeRequest("http://localhost:3000/api/auth/login", {}),
    );
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error.length).toBeGreaterThanOrEqual(2);
  });

  // Negative: wrong password
  it("returns 401 for wrong password", async () => {
    const res = await loginPOST(
      makeRequest("http://localhost:3000/api/auth/login", {
        email: "existing@example.com",
        password: "wrongpassword",
      }),
    );
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error[0].message).toBe("Invalid email or password.");
  });

  // Negative: non-existent email
  it("returns 401 for a non-existent email", async () => {
    const res = await loginPOST(
      makeRequest("http://localhost:3000/api/auth/login", {
        email: "nobody@example.com",
        password: "password123",
      }),
    );
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error[0].message).toBe("Invalid email or password.");
  });

  // Negative: invalid JSON body
  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not valid json{",
    });

    const res = await loginPOST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid JSON body.");
  });
});

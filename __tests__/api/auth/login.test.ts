/**
 * Unit tests for POST /api/auth/login.
 *
 * Tests cover: 1 happy path + 3 negative scenarios.
 */

import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { resetUsers } from "@/lib/users";

function makeLoginRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeRegisterRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    resetUsers();

    // Seed a test user for login tests
    const request = makeRegisterRequest({
      email: "alice@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    await registerPost(request as never);
  });

  it("returns a token for valid credentials (happy path)", async () => {
    const request = makeLoginRequest({
      email: "alice@example.com",
      password: "password123",
    });

    const response = await loginPost(request as never);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.token).toBeDefined();
    expect(data.data.user.email).toBe("alice@example.com");
    expect(data.error).toBeNull();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = makeLoginRequest({});

    const response = await loginPost(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.meta.fields.email).toBeDefined();
    expect(data.meta.fields.password).toBeDefined();
  });

  it("returns 401 for a non-existent user", async () => {
    const request = makeLoginRequest({
      email: "nobody@example.com",
      password: "password123",
    });

    const response = await loginPost(request as never);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid email or password");
  });

  it("returns 401 for wrong password", async () => {
    const request = makeLoginRequest({
      email: "alice@example.com",
      password: "wrongpassword",
    });

    const response = await loginPost(request as never);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid email or password");
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const response = await loginPost(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON body");
  });
});

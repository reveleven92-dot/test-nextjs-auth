/**
 * Unit tests for POST /api/auth/register.
 *
 * Tests cover: 1 happy path + 3 negative scenarios.
 */

import { POST } from "@/app/api/auth/register/route";
import { resetUsers } from "@/lib/users";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeInvalidJsonRequest(): Request {
  return new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    resetUsers();
  });

  it("creates a new user and returns a token (happy path)", async () => {
    const request = makeRequest({
      email: "alice@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.token).toBeDefined();
    expect(data.data.user.email).toBe("alice@example.com");
    expect(data.error).toBeNull();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = makeRequest({});

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.meta.fields).toBeDefined();
    expect(data.meta.fields.email).toBeDefined();
    expect(data.meta.fields.password).toBeDefined();
  });

  it("returns 400 when passwords do not match", async () => {
    const request = makeRequest({
      email: "alice@example.com",
      password: "password123",
      confirmPassword: "different456",
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.meta.fields.confirmPassword).toBe("Passwords do not match");
  });

  it("returns 409 when email is already registered", async () => {
    // Register the first user
    const first = makeRequest({
      email: "alice@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    await POST(first as never);

    // Try to register with the same email
    const duplicate = makeRequest({
      email: "alice@example.com",
      password: "password456",
      confirmPassword: "password456",
    });

    const response = await POST(duplicate as never);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("An account with this email already exists");
  });

  it("returns 400 when password is too short", async () => {
    const request = makeRequest({
      email: "alice@example.com",
      password: "short",
      confirmPassword: "short",
    });

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.meta.fields.password).toContain("at least 8 characters");
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = makeInvalidJsonRequest();

    const response = await POST(request as never);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON body");
  });
});

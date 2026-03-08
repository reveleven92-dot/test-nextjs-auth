/**
 * End-to-end test for the login flow.
 *
 * Tests the full register-then-login cycle by calling the API routes directly.
 * This verifies the happy path and negative scenarios end-to-end.
 */

import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { verifyToken } from "@/lib/auth";
import { resetUsers } from "@/lib/users";

function makeRegisterRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeLoginRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Login flow (E2E)", () => {
  beforeEach(() => {
    resetUsers();
  });

  it("registers a user, then logs in and gets a valid JWT (happy path)", async () => {
    // Step 1: Register a new user
    const registerResponse = await registerPost(
      makeRegisterRequest({
        email: "bob@example.com",
        password: "securepass1",
        confirmPassword: "securepass1",
      }) as never
    );
    expect(registerResponse.status).toBe(201);
    const registerData = await registerResponse.json();
    expect(registerData.data.user.email).toBe("bob@example.com");

    // Step 2: Log in with the same credentials
    const loginResponse = await loginPost(
      makeLoginRequest({
        email: "bob@example.com",
        password: "securepass1",
      }) as never
    );
    expect(loginResponse.status).toBe(200);
    const loginData = await loginResponse.json();

    // Step 3: Verify the returned JWT is valid
    const payload = await verifyToken(loginData.data.token);
    expect(payload).not.toBeNull();
    expect(payload!.email).toBe("bob@example.com");
  });

  it("rejects login with wrong password after registration (bad input)", async () => {
    // Register first
    await registerPost(
      makeRegisterRequest({
        email: "carol@example.com",
        password: "securepass1",
        confirmPassword: "securepass1",
      }) as never
    );

    // Try to login with wrong password
    const response = await loginPost(
      makeLoginRequest({
        email: "carol@example.com",
        password: "wrongpassword",
      }) as never
    );

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Invalid email or password");
  });

  it("rejects login for an unregistered user (missing data)", async () => {
    const response = await loginPost(
      makeLoginRequest({
        email: "nobody@example.com",
        password: "password123",
      }) as never
    );

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Invalid email or password");
  });

  it("rejects registration with mismatched passwords (validation failure)", async () => {
    const response = await registerPost(
      makeRegisterRequest({
        email: "dave@example.com",
        password: "password123",
        confirmPassword: "password456",
      }) as never
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.meta.fields.confirmPassword).toBe("Passwords do not match");
  });
});

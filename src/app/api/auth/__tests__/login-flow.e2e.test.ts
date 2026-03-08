/**
 * End-to-end test for the full login flow:
 *   1. Register a new account
 *   2. Log out
 *   3. Log back in
 *   4. Access the /api/auth/me endpoint
 *
 * This test exercises the real API route handlers directly,
 * verifying the full chain: validation -> user store -> JWT -> cookies.
 */

import { POST as registerPOST } from "@/app/api/auth/register/route";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { POST as logoutPOST } from "@/app/api/auth/logout/route";
import { GET as meGET } from "@/app/api/auth/me/route";
import { clearUsers } from "@/lib/users";
import { NextRequest } from "next/server";

function postRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequestWithCookie(url: string, cookieValue: string): NextRequest {
  return new NextRequest(url, {
    method: "GET",
    headers: { Cookie: `auth-token=${cookieValue}` },
  });
}

beforeEach(() => {
  clearUsers();
});

describe("E2E: register -> logout -> login -> me", () => {
  it("completes the full authentication flow successfully", async () => {
    // Step 1: Register
    const registerRes = await registerPOST(
      postRequest("http://localhost:3000/api/auth/register", {
        email: "e2e@example.com",
        password: "securepass1",
        confirmPassword: "securepass1",
      }),
    );
    expect(registerRes.status).toBe(201);

    const registerJson = await registerRes.json();
    expect(registerJson.data.user.email).toBe("e2e@example.com");

    const registerCookie = registerRes.cookies.get("auth-token");
    expect(registerCookie).toBeDefined();

    // Step 2: Access /me with the registration cookie
    const meRes1 = await meGET(
      getRequestWithCookie(
        "http://localhost:3000/api/auth/me",
        registerCookie!.value,
      ),
    );
    expect(meRes1.status).toBe(200);
    const meJson1 = await meRes1.json();
    expect(meJson1.data.user.email).toBe("e2e@example.com");

    // Step 3: Logout
    const logoutRes = await logoutPOST();
    expect(logoutRes.status).toBe(200);
    const logoutCookie = logoutRes.cookies.get("auth-token");
    expect(logoutCookie!.value).toBe("");

    // Step 4: Verify that /me rejects without a valid token
    const meRes2 = await meGET(
      getRequestWithCookie("http://localhost:3000/api/auth/me", ""),
    );
    expect(meRes2.status).toBe(401);

    // Step 5: Login with the same credentials
    const loginRes = await loginPOST(
      postRequest("http://localhost:3000/api/auth/login", {
        email: "e2e@example.com",
        password: "securepass1",
      }),
    );
    expect(loginRes.status).toBe(200);

    const loginJson = await loginRes.json();
    expect(loginJson.data.user.email).toBe("e2e@example.com");

    const loginCookie = loginRes.cookies.get("auth-token");
    expect(loginCookie).toBeDefined();

    // Step 6: Verify /me works with the login cookie
    const meRes3 = await meGET(
      getRequestWithCookie(
        "http://localhost:3000/api/auth/me",
        loginCookie!.value,
      ),
    );
    expect(meRes3.status).toBe(200);
    const meJson3 = await meRes3.json();
    expect(meJson3.data.user.email).toBe("e2e@example.com");
  });

  // Negative: access /me without token
  it("rejects /me access without a token", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/me", {
      method: "GET",
    });
    const res = await meGET(req);
    expect(res.status).toBe(401);
  });

  // Negative: access /me with an expired/invalid token
  it("rejects /me access with an invalid token", async () => {
    const res = await meGET(
      getRequestWithCookie(
        "http://localhost:3000/api/auth/me",
        "totally.bogus.token",
      ),
    );
    expect(res.status).toBe(401);
  });

  // Negative: login with wrong credentials after registration
  it("rejects login with wrong password after registration", async () => {
    await registerPOST(
      postRequest("http://localhost:3000/api/auth/register", {
        email: "wrong@example.com",
        password: "correctpass1",
        confirmPassword: "correctpass1",
      }),
    );

    const loginRes = await loginPOST(
      postRequest("http://localhost:3000/api/auth/login", {
        email: "wrong@example.com",
        password: "wrongpass123",
      }),
    );
    expect(loginRes.status).toBe(401);
  });
});

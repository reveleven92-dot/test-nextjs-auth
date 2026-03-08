import { hashPassword, verifyPassword, createToken, verifyToken } from "@/lib/auth";

describe("hashPassword and verifyPassword", () => {
  it("hashes a password and verifies it correctly", async () => {
    const password = "mysecurepassword";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct-password");
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("produces different hashes for the same password", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
  });
});

describe("createToken and verifyToken", () => {
  it("creates and verifies a token with correct payload", async () => {
    const payload = { userId: "42", email: "test@example.com" };
    const token = await createToken(payload);

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);

    const decoded = await verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.userId).toBe("42");
    expect(decoded!.email).toBe("test@example.com");
  });

  it("returns null for an invalid token", async () => {
    const result = await verifyToken("invalid.token.string");
    expect(result).toBeNull();
  });

  it("returns null for an empty token", async () => {
    const result = await verifyToken("");
    expect(result).toBeNull();
  });
});

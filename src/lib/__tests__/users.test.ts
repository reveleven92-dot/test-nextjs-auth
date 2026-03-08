import {
  createUser,
  findUserByEmail,
  findUserById,
  toSafeUser,
  clearUsers,
} from "@/lib/users";

beforeEach(() => {
  clearUsers();
});

describe("createUser", () => {
  it("creates a user with the given email and hash", () => {
    const user = createUser("test@example.com", "hashed123");
    expect(user.email).toBe("test@example.com");
    expect(user.passwordHash).toBe("hashed123");
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it("assigns incrementing ids", () => {
    const u1 = createUser("a@a.com", "h");
    const u2 = createUser("b@b.com", "h");
    expect(Number(u2.id)).toBeGreaterThan(Number(u1.id));
  });
});

describe("findUserByEmail", () => {
  it("finds an existing user by email", () => {
    createUser("found@example.com", "hash");
    const user = findUserByEmail("found@example.com");
    expect(user).toBeDefined();
    expect(user!.email).toBe("found@example.com");
  });

  it("returns undefined for a non-existent email", () => {
    expect(findUserByEmail("nope@example.com")).toBeUndefined();
  });
});

describe("findUserById", () => {
  it("finds an existing user by id", () => {
    const created = createUser("by-id@example.com", "hash");
    const found = findUserById(created.id);
    expect(found).toBeDefined();
    expect(found!.email).toBe("by-id@example.com");
  });

  it("returns undefined for a non-existent id", () => {
    expect(findUserById("999")).toBeUndefined();
  });
});

describe("toSafeUser", () => {
  it("strips the password hash", () => {
    const user = createUser("safe@example.com", "secrethash");
    const safe = toSafeUser(user);
    expect(safe).toHaveProperty("id");
    expect(safe).toHaveProperty("email");
    expect(safe).toHaveProperty("createdAt");
    expect(safe).not.toHaveProperty("passwordHash");
  });
});

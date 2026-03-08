import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateLoginInput,
  validateRegisterInput,
} from "@/lib/validation";

describe("validateEmail", () => {
  it("returns error when email is empty", () => {
    expect(validateEmail("")).toEqual({
      field: "email",
      message: "Email is required.",
    });
  });

  it("returns error when email is not a string", () => {
    expect(validateEmail(123)).toEqual({
      field: "email",
      message: "Email is required.",
    });
  });

  it("returns error for invalid email format", () => {
    expect(validateEmail("not-an-email")).toEqual({
      field: "email",
      message: "Please enter a valid email address.",
    });
  });

  it("returns null for a valid email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });
});

describe("validatePassword", () => {
  it("returns error when password is empty", () => {
    expect(validatePassword("")).toEqual({
      field: "password",
      message: "Password is required.",
    });
  });

  it("returns error when password is too short", () => {
    expect(validatePassword("short")).toEqual({
      field: "password",
      message: "Password must be at least 8 characters.",
    });
  });

  it("returns null for a valid password", () => {
    expect(validatePassword("longpassword")).toBeNull();
  });
});

describe("validateConfirmPassword", () => {
  it("returns error when confirm password is empty", () => {
    expect(validateConfirmPassword("password1", "")).toEqual({
      field: "confirmPassword",
      message: "Please confirm your password.",
    });
  });

  it("returns error when passwords do not match", () => {
    expect(validateConfirmPassword("password1", "password2")).toEqual({
      field: "confirmPassword",
      message: "Passwords do not match.",
    });
  });

  it("returns null when passwords match", () => {
    expect(validateConfirmPassword("password1", "password1")).toBeNull();
  });
});

describe("validateLoginInput", () => {
  it("returns errors for empty input", () => {
    const result = validateLoginInput({});
    expect(result.errors.length).toBe(2);
  });

  it("returns no errors for valid input", () => {
    const result = validateLoginInput({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.errors.length).toBe(0);
    expect(result.email).toBe("user@example.com");
    expect(result.password).toBe("password123");
  });
});

describe("validateRegisterInput", () => {
  it("returns errors for empty input", () => {
    const result = validateRegisterInput({});
    expect(result.errors.length).toBe(3);
  });

  it("returns error when passwords do not match", () => {
    const result = validateRegisterInput({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].field).toBe("confirmPassword");
  });

  it("returns no errors for valid input", () => {
    const result = validateRegisterInput({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.errors.length).toBe(0);
  });
});

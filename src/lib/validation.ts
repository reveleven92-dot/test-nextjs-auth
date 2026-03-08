/**
 * Shared validation helpers for auth forms and API routes.
 */

export interface ValidationError {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: unknown): ValidationError | null {
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return { field: "email", message: "Email is required." };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { field: "email", message: "Please enter a valid email address." };
  }
  return null;
}

export function validatePassword(password: unknown): ValidationError | null {
  if (
    !password ||
    typeof password !== "string" ||
    password.trim().length === 0
  ) {
    return { field: "password", message: "Password is required." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      field: "password",
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  return null;
}

export function validateConfirmPassword(
  password: unknown,
  confirmPassword: unknown,
): ValidationError | null {
  if (
    !confirmPassword ||
    typeof confirmPassword !== "string" ||
    confirmPassword.trim().length === 0
  ) {
    return {
      field: "confirmPassword",
      message: "Please confirm your password.",
    };
  }
  if (password !== confirmPassword) {
    return { field: "confirmPassword", message: "Passwords do not match." };
  }
  return null;
}

export function validateLoginInput(body: Record<string, unknown>): {
  errors: ValidationError[];
  email: string;
  password: string;
} {
  const errors: ValidationError[] = [];

  const emailErr = validateEmail(body.email);
  if (emailErr) errors.push(emailErr);

  const passErr = validatePassword(body.password);
  if (passErr) errors.push(passErr);

  return {
    errors,
    email: typeof body.email === "string" ? body.email.trim() : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

export function validateRegisterInput(body: Record<string, unknown>): {
  errors: ValidationError[];
  email: string;
  password: string;
} {
  const errors: ValidationError[] = [];

  const emailErr = validateEmail(body.email);
  if (emailErr) errors.push(emailErr);

  const passErr = validatePassword(body.password);
  if (passErr) errors.push(passErr);

  const confirmErr = validateConfirmPassword(
    body.password,
    body.confirmPassword,
  );
  if (confirmErr) errors.push(confirmErr);

  return {
    errors,
    email: typeof body.email === "string" ? body.email.trim() : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

/**
 * Authentication-related TypeScript types.
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: { token: string; user: { id: string; email: string } } | null;
  error: string | null;
  meta: { timestamp: string };
}

export interface ApiErrorResponse {
  data: null;
  error: string;
  meta: { timestamp: string; fields?: Record<string, string> };
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

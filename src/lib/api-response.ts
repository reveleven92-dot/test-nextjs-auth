/**
 * Standardized API response envelope builder.
 *
 * All API responses follow the shape: { data, error, meta }.
 */

import { NextResponse } from "next/server";

interface ApiEnvelope<T> {
  data: T | null;
  error: string | null;
  meta: {
    timestamp: string;
    fields?: Record<string, string>;
  };
}

export function successResponse<T>(data: T, status = 200): NextResponse {
  const body: ApiEnvelope<T> = {
    data,
    error: null,
    meta: { timestamp: new Date().toISOString() },
  };
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status: number,
  fields?: Record<string, string>
): NextResponse {
  const body: ApiEnvelope<null> = {
    data: null,
    error: message,
    meta: { timestamp: new Date().toISOString(), ...(fields && { fields }) },
  };
  return NextResponse.json(body, { status });
}

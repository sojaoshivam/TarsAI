import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface AuthedRequest {
  userId: string;
}

type ApiHandler<T = unknown> = (
  req: Request,
  context: AuthedRequest
) => Promise<Response>;

/**
 * Wraps an API handler with error handling and consistent response format
 */
export function withErrorHandler(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: message,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Requires authentication for an API endpoint
 */
export function withAuth(handler: ApiHandler) {
  return withErrorHandler(async (req: Request) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    return handler(req, { userId });
  });
}

/**
 * Validates request method
 */
export function withMethodCheck(methods: string[], handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    if (!methods.includes(req.method)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Method ${req.method} not allowed`,
        },
        { status: 405 }
      );
    }

    return handler(req);
  };
}

/**
 * Validates request body against a schema
 */
export async function validateRequestBody<T>(
  req: Request,
  validator: (data: unknown) => T
): Promise<T> {
  try {
    const body = await req.json();
    return validator(body);
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

/**
 * Creates a successful API response
 */
export function successResponse<T>(data: T, status: number = 200): Response {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Creates an error API response
 */
export function errorResponse(message: string, status: number = 400): Response {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

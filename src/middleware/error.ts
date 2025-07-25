import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: any;
}

export function errorHandler(err: ApiError, req: Request, res: Response, _next: NextFunction) {
  // Log error without exposing stack trace in production
  if (process.env.NODE_ENV === 'production') {
    console.error(`Error ${err.code || 'INTERNAL_ERROR'}: ${err.message}`);
  } else {
    console.error('Error:', err);
  }

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  // Only include details in non-production environments
  const response: any = {
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  };

  if (process.env.NODE_ENV !== 'production' && err.details) {
    response.error.details = err.details;
  }

  res.status(status).json(response);
}
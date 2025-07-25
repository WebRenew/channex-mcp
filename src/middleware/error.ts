import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: any;
}

export function errorHandler(err: ApiError, req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  res.status(status).json({
    error: {
      code,
      message,
      details: err.details,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
}
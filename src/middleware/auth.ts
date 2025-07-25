import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface AuthenticatedRequest extends Request {
  apiKey?: string;
  userId?: string;
}

// In production, these would come from a database
const API_KEYS = new Map<string, { userId: string; name: string; permissions: string[] }>();

// Initialize with environment variable API keys
export function initializeApiKeys() {
  console.log('Initializing API keys...');
  const keys = process.env.API_KEYS?.split(',') || [];
  keys.forEach((keyConfig) => {
    const [key, userId, name] = keyConfig.split(':');
    if (key && userId && name) {
      API_KEYS.set(key, {
        userId,
        name,
        permissions: ['*'] // All permissions for now
      });
    }
  });

  // Add a default development key if none provided
  if (API_KEYS.size === 0 && process.env.NODE_ENV !== 'production') {
    const devKey = 'dev_' + crypto.randomBytes(16).toString('hex');
    API_KEYS.set(devKey, {
      userId: 'dev_user',
      name: 'Development User',
      permissions: ['*']
    });
    console.log(`🔑 Development API key: ${devKey}`);
    console.log(`Total API keys loaded: ${API_KEYS.size}`);
  }
}

export function authenticateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
  const apiKey = req.headers['x-api-key'] as string || req.query.api_key as string;

  if (!apiKey) {
    return res.status(401).json({
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key is required. Please provide it in the X-API-Key header or api_key query parameter.'
      }
    });
  }

  console.log(`Checking API key: ${apiKey}, Total keys: ${API_KEYS.size}`);
  const keyInfo = API_KEYS.get(apiKey);
  if (!keyInfo) {
    return res.status(401).json({
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key provided.'
      }
    });
  }

  // Attach user info to request
  req.apiKey = apiKey;
  req.userId = keyInfo.userId;

  // Log API usage
  console.log(`API call by ${keyInfo.name} (${keyInfo.userId}) to ${req.method} ${req.path}`);

  next();
}

// Helper to generate new API keys
export function generateApiKey(userId: string, name: string): string {
  const key = 'ck_' + crypto.randomBytes(32).toString('hex');
  API_KEYS.set(key, {
    userId,
    name,
    permissions: ['*']
  });
  return key;
}

// Helper to validate webhook signatures
export function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

import { toolRegistry, executeToolHandler } from './registry.js';
import { authenticateRequest, initializeApiKeys } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Request logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// List all available tools
app.get('/api/v1/tools', authenticateRequest, (_req, res) => {
  const tools = toolRegistry.getAllTools();
  res.json({
    data: tools,
    meta: {
      count: tools.length
    }
  });
});

// Get specific tool schema
app.get('/api/v1/tools/:toolName', authenticateRequest, (req, res) => {
  const tool = toolRegistry.getTool(req.params.toolName);
  if (!tool) {
    res.status(404).json({
      error: {
        code: 'TOOL_NOT_FOUND',
        message: `Tool ${req.params.toolName} not found`
      }
    });
    return;
  }
  res.json({ data: tool });
});

// Execute a single tool
app.post('/api/v1/tools/:toolName', authenticateRequest, async (req, res, next) => {
  try {
    const { toolName } = req.params;
    const result = await executeToolHandler(toolName, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Batch execute multiple tools
const BatchRequestSchema = z.object({
  requests: z.array(z.object({
    tool: z.string(),
    params: z.any(),
    id: z.string().optional()
  }))
});

app.post('/api/v1/batch', authenticateRequest, async (req, res, next) => {
  try {
    const { requests } = BatchRequestSchema.parse(req.body);
    
    const results = await Promise.all(
      requests.map(async (request) => {
        try {
          const result = await executeToolHandler(request.tool, request.params);
          return {
            id: request.id,
            tool: request.tool,
            success: true,
            result
          };
        } catch (error: any) {
          return {
            id: request.id,
            tool: request.tool,
            success: false,
            error: {
              code: error.code || 'EXECUTION_ERROR',
              message: error.message
            }
          };
        }
      })
    );
    
    res.json({ data: results });
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorHandler);

// Start server
export function startServer() {
  // Initialize API keys
  initializeApiKeys();
  
  app.listen(PORT, () => {
    console.log(`🚀 Channex MCP HTTP Server running on port ${PORT}`);
    console.log(`📝 API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

// Export for testing
export { app };
# Channex MCP Server Deployment Guide

## Overview

The Channex MCP Server can run in two modes:
1. **MCP Mode**: For local Claude integration (stdio transport)
2. **HTTP Mode**: For remote access and Railway deployment (REST API)

## HTTP API Mode

### Local Development

```bash
# Install dependencies
npm install

# Run in HTTP mode (default)
npm run dev:http

# Or set environment variable
MCP_MODE=http npm run dev
```

### API Endpoints

#### Authentication
All endpoints require API key authentication via `X-API-Key` header or `api_key` query parameter.

#### Available Endpoints

```
GET  /health                    - Health check
GET  /api/v1/tools             - List all available tools
GET  /api/v1/tools/:toolName   - Get tool schema
POST /api/v1/tools/:toolName   - Execute a tool
POST /api/v1/batch             - Execute multiple tools
```

#### Example Requests

```bash
# List all tools
curl -H "X-API-Key: your_api_key" http://localhost:3000/api/v1/tools

# List properties
curl -X POST http://localhost:3000/api/v1/tools/channex_list_properties \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10}'

# Get room types for a property
curl -X POST http://localhost:3000/api/v1/tools/channex_list_room_types \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"property_id": "2efc1cd3-5e94-435b-8e14-f4ce2e9de74b"}'

# Batch request
curl -X POST http://localhost:3000/api/v1/batch \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [
      {
        "tool": "channex_list_properties",
        "params": {"limit": 5},
        "id": "req1"
      },
      {
        "tool": "channex_list_room_types",
        "params": {"property_id": "some-id"},
        "id": "req2"
      }
    ]
  }'
```

## Railway Deployment

### Prerequisites
1. Railway account
2. Railway CLI installed (`npm i -g @railway/cli`)

### Deployment Steps

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Create New Project**
   ```bash
   railway init
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set CHANNEX_API_KEY=your_key
   railway variables set CHANNEX_BASE_URL=https://app.channex.io/api/v1/
   railway variables set API_KEYS=ck_prod_key1:user1:User Name
   railway variables set PORT=3000
   railway variables set MCP_MODE=http
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Get Deployment URL**
   ```bash
   railway domain
   ```

### Using Docker

The project includes a Dockerfile for containerized deployment:

```bash
# Build locally
docker build -t channex-mcp .

# Run locally
docker run -p 3000:3000 \
  -e CHANNEX_API_KEY=your_key \
  -e API_KEYS=dev_key:dev_user:Developer \
  channex-mcp
```

## Team Access

### Generating API Keys

For development, the server auto-generates a key if none are provided. In production, set the `API_KEYS` environment variable:

```
API_KEYS=key1:userId1:User One,key2:userId2:User Two
```

Format: `apiKey:userId:userName` (comma-separated for multiple keys)

### Security Best Practices

1. **Use HTTPS in production** - Railway provides this automatically
2. **Rotate API keys regularly**
3. **Set CORS origins** - Configure `ALLOWED_ORIGINS` for your domains
4. **Monitor usage** - Check logs for unauthorized access attempts
5. **Rate limiting** - Default: 100 requests per 15 minutes per IP

## MCP Mode (Local Claude Integration)

### Setup

1. **Add to Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "channex": {
         "command": "node",
         "args": ["/path/to/channex-mcp/dist/index.js"],
         "env": {
           "MCP_MODE": "mcp",
           "CHANNEX_API_KEY": "your_key"
         }
       }
     }
   }
   ```

2. **Run in MCP mode**
   ```bash
   npm run dev:mcp
   ```

## Available Tools

### Properties
- `channex_list_properties` - List all properties
- `channex_get_property` - Get property by ID
- `channex_create_property` - Create new property
- `channex_update_property` - Update property
- `channex_delete_property` - Delete property

### Room Types
- `channex_list_room_types` - List room types
- `channex_get_room_type` - Get room type by ID
- `channex_create_room_type` - Create room type

### Rate Plans
- `channex_list_rate_plans` - List rate plans
- `channex_get_rate_plan` - Get rate plan by ID
- `channex_create_rate_plan` - Create rate plan

### ARI (Availability, Rates, Inventory)
- `channex_get_availability` - Get availability
- `channex_get_restrictions` - Get restrictions
- `channex_update_ari` - Update ARI data

## Monitoring

### Health Check
```bash
curl http://your-deployment.railway.app/health
```

### Logs
- Local: Console output
- Railway: `railway logs`

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check API key is set correctly
   - Verify key format in `API_KEYS` env var

2. **Connection to Channex failed**
   - Verify `CHANNEX_API_KEY` is correct
   - Check `CHANNEX_BASE_URL` format

3. **CORS errors**
   - Add your domain to `ALLOWED_ORIGINS`

### Debug Mode
```bash
NODE_ENV=development npm run dev:http
```

## Support

For issues or questions:
1. Check logs for error details
2. Verify environment variables
3. Test with curl commands above
4. Contact team lead for API key issues
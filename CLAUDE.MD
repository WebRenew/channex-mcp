# Channex MCP - Claude Code Documentation

## Project Overview

Channex MCP is a self-improving Model Context Protocol (MCP) server for interacting with the Channex.io API. This project provides a standardized interface for managing properties, room types, rate plans, and availability/rate information (ARI) in the Channex platform.

## Core Architecture

### Self-Improving Design

The project uses a command-based architecture that allows it to evolve and improve itself through recursive commands located in `.claude/commands/`. This design enables:

1. **Auto-generation** of new endpoints and features
2. **Self-testing** capabilities
3. **Documentation generation**
4. **Code quality improvements**

### Key Components

1. **MCP Server** (`src/index.ts`)
   - Handles MCP protocol communication
   - Routes tool calls to appropriate handlers
   - Manages authentication and API key storage

2. **API Client** (`src/api/client.ts`)
   - Centralized HTTP client for Channex API
   - Handles authentication headers
   - Manages base URL configuration (staging/production)

3. **Resource Modules**
   - Properties (`src/resources/properties.ts`)
   - Room Types (`src/resources/room-types.ts`)
   - Rate Plans (`src/resources/rate-plans.ts`)
   - ARI (`src/resources/ari.ts`)

4. **Self-Improvement Commands** (`.claude/commands/`)
   - `generate-endpoint.ts` - Creates new API endpoint handlers
   - `test-all.ts` - Runs comprehensive test suite
   - `update-docs.ts` - Updates documentation from API responses
   - `improve-types.ts` - Enhances TypeScript types from actual API data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Channex API key

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```env
CHANNEX_API_KEY=your_api_key_here
CHANNEX_BASE_URL=https://staging.channex.io
```

### Running the Server

```bash
npm run dev
```

## Available Tools

### Properties Management

- `channex_list_properties` - List all properties
- `channex_get_property` - Get property by ID
- `channex_create_property` - Create new property
- `channex_update_property` - Update property
- `channex_delete_property` - Delete property

### Room Types Management

- `channex_list_room_types` - List room types
- `channex_get_room_type` - Get room type by ID
- `channex_create_room_type` - Create room type
- `channex_update_room_type` - Update room type
- `channex_delete_room_type` - Delete room type

### Rate Plans Management

- `channex_list_rate_plans` - List rate plans
- `channex_get_rate_plan` - Get rate plan by ID
- `channex_create_rate_plan` - Create rate plan
- `channex_update_rate_plan` - Update rate plan
- `channex_delete_rate_plan` - Delete rate plan

### ARI Management

- `channex_get_availability` - Get availability per room type
- `channex_get_restrictions` - Get restrictions per rate plan
- `channex_update_ari` - Update availability, rates, and restrictions

## Self-Improvement Workflow

### Adding New Endpoints

1. Run the generate command:
   ```bash
   npm run command generate-endpoint -- --resource bookings --operations list,get,create
   ```

2. The command will:
   - Create new resource file
   - Add TypeScript interfaces
   - Register tools in MCP server
   - Update documentation

### Testing

**IMPORTANT: NEVER USE MOCK DATA. All testing must be done against the live Channex API (staging or production).**

Run all tests:
```bash
npm run command test-all
```

Run specific resource tests:
```bash
npm run command test-all -- --resource properties
```

Testing Guidelines:
- Always test against real Channex API endpoints
- Use actual property IDs, room types, and rate plans from your Channex account
- Test with real data to ensure accurate API behavior
- Never create mock responses or fake data for testing

### Improving Types

After making API calls, improve types:
```bash
npm run command improve-types -- --resource properties --sample-file samples/properties.json
```

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow functional programming principles where appropriate
- Keep functions small and focused
- Use descriptive names

### Testing Philosophy

**NEVER USE MOCK DATA OR MOCK RESPONSES**
- All development and testing must be done against live Channex APIs
- Use real property data from staging or production environments
- Test with actual API responses to ensure compatibility
- When implementing new features, test them immediately against the live API
- Document actual API responses and use them to improve type definitions

### Error Handling

All API errors should be caught and returned in MCP format:

```typescript
try {
  const response = await client.get('/api/v1/properties');
  return response.data;
} catch (error) {
  return {
    error: {
      code: error.response?.status || 'unknown',
      message: error.response?.data?.errors?.title || error.message
    }
  };
}
```

### Adding New Features

1. Create feature branch
2. Implement using self-improvement commands where possible
3. Add tests
4. Update documentation
5. Submit for review

## API Documentation

### Authentication

All requests require the `user-api-key` header:

```typescript
headers: {
  'user-api-key': process.env.CHANNEX_API_KEY,
  'Content-Type': 'application/json'
}
```

### Response Format

Successful responses:
```json
{
  "data": {
    "type": "property",
    "id": "uuid",
    "attributes": { ... }
  }
}
```

Error responses:
```json
{
  "errors": {
    "code": "validation_error",
    "title": "Validation Error",
    "details": { ... }
  }
}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check API key is set correctly
   - Verify API key has necessary permissions

2. **422 Validation Error**
   - Check required fields are provided
   - Verify data types match API expectations

3. **Rate Limiting**
   - Implement exponential backoff
   - Cache responses where appropriate

## Future Enhancements

1. **Webhook Support** - Handle Channex webhooks
2. **Batch Operations** - Bulk updates for ARI
3. **Channel Management** - Integrate channel mapping APIs
4. **Booking Management** - Full booking lifecycle support
5. **Reporting** - Analytics and insights tools

## Contributing

1. Use self-improvement commands to maintain consistency
2. Write tests for new features
3. Update documentation
4. Follow the established patterns

## License

[Specify license]

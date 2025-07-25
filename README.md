# Channex MCP

A self-improving Model Context Protocol (MCP) server for interacting with the Channex.io API.

## ⚠️ Important Disclaimer

**This is NOT an official Channex.io project.** This is an independent, open-source implementation of an MCP server that interfaces with the Channex.io API. It is not affiliated with, endorsed by, or supported by Channex.io. Use at your own risk.

## 🚀 Quick Start with Claude Code

See [CLAUDE_CODE_SETUP.md](./CLAUDE_CODE_SETUP.md) for detailed instructions on adding this MCP to Claude Code.

## Features

- ✨ Complete CRUD operations for Properties, Room Types, Rate Plans
- 📊 ARI (Availability, Rates, Inventory) management
- 🔄 Self-improving architecture with recursive commands
- 🧪 Built-in testing framework
- 📝 Auto-generated documentation
- 🔒 Secure API key management

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your Channex API key

```bash
cp .env.example .env
```

## Usage

### Running the MCP Server

```bash
npm run dev
```

### Self-Improvement Commands

Generate new endpoints:
```bash
npm run command generate-endpoint -- bookings list,get,create
```

Run tests:
```bash
npm run command test-all
```

Update documentation:
```bash
npm run command update-docs
```

Improve types from API responses:
```bash
npm run command improve-types -- properties samples/properties.json
```

## Available Tools

The MCP server exposes the following tools:

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
- `channex_get_availability` - Get availability per room type
- `channex_get_restrictions` - Get restrictions per rate plan
- `channex_update_ari` - Update availability, rates, and restrictions

### Channels (OTA Connections)
- `channex_test_channel_api` - Test channel API access
- `channex_check_existing_connection` - Check for existing channel connections
- `channex_list_channels` - List all channel connections (supports field filtering)
- `channex_get_channel_by_code` - Get channels by code (optimized for specific channels)
- `channex_get_channel` - Get channel details
- `channex_create_channel` - Create new channel (e.g., Airbnb)
- `channex_update_channel` - Update channel settings (now supports property_ids)
- `channex_delete_channel` - Delete channel connection
- `channex_get_channel_mappings` - Get listing-to-rate-plan mappings
- `channex_update_channel_mapping` - Map channel listings to rate plans
- `channex_get_airbnb_listings` - Get Airbnb-specific listings
- `channex_update_airbnb_listing` - Update Airbnb pricing/availability

## Development

### Project Structure

```
channex-mcp/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── api/
│   │   └── client.ts     # Channex API client
│   ├── resources/        # Resource handlers
│   │   ├── properties.ts
│   │   ├── room-types.ts
│   │   ├── rate-plans.ts
│   │   ├── ari.ts
│   │   └── channels.ts
│   └── types/           # TypeScript definitions
├── .claude/
│   └── commands/        # Self-improvement scripts
└── CLAUDE.MD           # Claude Code documentation
```

### Adding New Features

1. Use the `generate-endpoint` command to scaffold new resources
2. Add TypeScript types in `src/types/index.ts`
3. Implement handlers in the MCP server
4. Update documentation using `update-docs`

## Recent Updates (Jan 2025)

### Response Size Optimization
- Added field filtering support to reduce response sizes
- Implemented response truncation for large objects
- Created optimized `channex_get_channel_by_code` endpoint
- Fixed pagination parameter formatting

### Channel Management Enhancement
- Added `property_ids` support to `channex_update_channel`
- Enables adding/removing properties from existing channels
- Essential for managing multi-property OTA connections

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

**Important**: This is an unofficial project. Contributors must:
- Test against real Channex APIs (no mocks)
- Respect Channex.io's Terms of Service
- Never commit API keys or credentials

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is not affiliated with Channex.io. The Channex name and API are property of their respective owners. This is an independent project that provides an MCP interface to interact with the public Channex API.

## Support

For issues and questions, please open a GitHub issue.

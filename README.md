# Channex MCP

A self-improving Model Context Protocol (MCP) server for interacting with the Channex.io API.

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
- `channex_list_channels` - List all channel connections
- `channex_get_channel` - Get channel details
- `channex_create_channel` - Create new channel (e.g., Airbnb)
- `channex_update_channel` - Update channel settings
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests with `npm run command test-all`
5. Submit a pull request

## License

[Specify license]

## Support

For issues and questions, please open a GitHub issue.

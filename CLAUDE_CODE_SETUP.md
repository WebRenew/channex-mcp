# Adding Channex MCP to Claude Code

This guide walks you through setting up the Channex MCP server with Claude Code (formerly Claude Desktop).

## Prerequisites

- Claude Code installed on your system
- Node.js 18+ installed
- A Channex.io API key

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/charlesrhoward/channex-mcp.git
cd channex-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Channex API key:

```env
CHANNEX_API_KEY=your_api_key_here
CHANNEX_BASE_URL=https://staging.channex.io
```

### 4. Build the Project

```bash
npm run build
```

## Configure Claude Code

### 1. Locate Claude Code Configuration

The configuration file location depends on your operating system:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

### 2. Edit Configuration

Open the configuration file and add the Channex MCP server to the `mcpServers` section:

```json
{
  "mcpServers": {
    "channex": {
      "command": "node",
      "args": ["/absolute/path/to/channex-mcp/dist/index.js"],
      "env": {
        "CHANNEX_API_KEY": "your_api_key_here",
        "CHANNEX_BASE_URL": "https://staging.channex.io"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/channex-mcp` with the actual path where you cloned the repository.

### 3. Alternative: Use npx (if published to npm)

If the package is published to npm, you can use:

```json
{
  "mcpServers": {
    "channex": {
      "command": "npx",
      "args": ["channex-mcp"],
      "env": {
        "CHANNEX_API_KEY": "your_api_key_here",
        "CHANNEX_BASE_URL": "https://staging.channex.io"
      }
    }
  }
}
```

### 4. Restart Claude Code

After saving the configuration file, completely quit and restart Claude Code for the changes to take effect.

## Verify Installation

Once Claude Code restarts, you can verify the MCP is loaded by asking Claude:

"What Channex tools do you have available?"

Claude should list the available tools:
- `channex_list_properties`
- `channex_get_property`
- `channex_create_property`
- `channex_update_property`
- `channex_delete_property`
- `channex_list_room_types`
- `channex_get_room_type`
- `channex_create_room_type`
- `channex_list_rate_plans`
- `channex_get_rate_plan`
- `channex_create_rate_plan`
- `channex_get_availability`
- `channex_get_restrictions`
- `channex_update_ari`

## Usage Examples

### List Properties
Ask Claude: "Can you list all my Channex properties?"

### Get Property Details
Ask Claude: "Show me the details for property ID [property-id]"

### Create a Property
Ask Claude: "Help me create a new property called 'Beach Resort' with currency USD"

### Update ARI
Ask Claude: "Update the availability for room type [room-type-id] for the next 7 days to 5 rooms per day"

## Troubleshooting

### MCP Not Loading

1. **Check logs**: Claude Code logs can be found at:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%LOCALAPPDATA%\Claude\logs\`
   - Linux: `~/.local/share/claude/logs/`

2. **Verify path**: Ensure the path in the configuration is absolute and correct

3. **Check permissions**: Make sure the MCP files are readable

4. **Test manually**: Try running the MCP server directly:
   ```bash
   node /path/to/channex-mcp/dist/index.js
   ```

### API Key Issues

If you see authentication errors:
1. Verify your API key is correct
2. Check if the key has the necessary permissions in Channex
3. Ensure the environment variables are properly set in the config

### Connection Issues

For connection problems:
1. Check your internet connection
2. Verify the `CHANNEX_BASE_URL` is correct
3. Try using the production URL: `https://app.channex.io`

## Development Mode

For development and debugging, you can run the MCP server with tsx:

```json
{
  "mcpServers": {
    "channex-dev": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/channex-mcp/src/index.ts"],
      "env": {
        "CHANNEX_API_KEY": "your_api_key_here",
        "CHANNEX_BASE_URL": "https://staging.channex.io"
      }
    }
  }
}
```

This allows you to make changes without rebuilding.

## Security Notes

1. **API Keys**: Never commit your API keys to version control
2. **Environment**: The API key is passed as an environment variable to the MCP process
3. **Permissions**: The MCP only has access to what you explicitly configure

## Support

For issues specific to:
- **Channex MCP**: Open an issue at https://github.com/charlesrhoward/channex-mcp/issues
- **Claude Code**: Visit https://claude.ai/help
- **Channex API**: Refer to https://docs.channex.io

## Next Steps

After setup, you can:
1. Explore the available tools by asking Claude about Channex operations
2. Integrate property management workflows into your Claude conversations
3. Use the self-improvement commands to extend functionality
4. Contribute improvements back to the repository
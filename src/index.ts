import { config } from 'dotenv';
import { startServer } from './server.js';
import { startMCPServer } from './index-mcp-complete.js';

// Load environment variables
config();

// Determine which mode to run in
const mode = process.env.MCP_MODE || 'http';

async function main() {
  if (mode === 'mcp') {
    console.log('Starting in MCP mode...');
    await startMCPServer();
  } else {
    console.log('Starting in HTTP mode...');
    startServer();
  }
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
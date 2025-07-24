#!/bin/bash

echo "🚀 Setting up Channex MCP..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please add your CHANNEX_API_KEY to .env"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your CHANNEX_API_KEY to .env"
echo "2. Run 'npm run dev' to start the MCP server"
echo "3. Run 'npm run command test-all' to test the connection"

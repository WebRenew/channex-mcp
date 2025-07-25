# Contributing to Channex MCP

Thank you for your interest in contributing to the Channex MCP project! This document provides guidelines and information for contributors.

## Important Disclaimers

⚠️ **This is NOT an official Channex.io project**

- This is an independent, community-driven Model Context Protocol (MCP) server
- It is not affiliated with, endorsed by, or supported by Channex.io
- Channex.io is not responsible for this project or its functionality
- Use at your own risk and always test against staging environments first

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Focus on constructive criticism and positive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### 1. Reporting Issues

Before creating an issue:
- Check if the issue already exists
- Test against the latest version
- Include detailed reproduction steps
- Provide error messages and logs
- Specify your environment (Node version, OS, etc.)

### 2. Suggesting Features

When suggesting new features:
- Check if it's already been suggested
- Explain the use case and benefits
- Consider if it aligns with the project's goals
- Be open to feedback and alternative approaches

### 3. Submitting Pull Requests

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/channex-mcp.git
   cd channex-mcp
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/charlesrhoward/channex-mcp.git
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

1. **Code Style**
   - Follow the existing code style
   - Use TypeScript strict mode
   - Run `npm run lint` before committing
   - Format with `npm run format`

2. **Testing Philosophy**
   - **NEVER use mock data** - test against real Channex APIs
   - Use staging environment for development
   - Document actual API responses
   - Include error handling for all edge cases

3. **Commit Messages**
   - Use conventional commits format:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation
     - `refactor:` for code refactoring
     - `test:` for test additions/changes
     - `chore:` for maintenance tasks
   - Be descriptive in your commit messages

4. **Documentation**
   - Update README.md for new features
   - Document new MCP tools thoroughly
   - Include examples in documentation
   - Update CLAUDE.md if changing architecture

#### Pull Request Process

1. Update your fork:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. Rebase your feature branch:
   ```bash
   git checkout feature/your-feature-name
   git rebase main
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create Pull Request:
   - Use a descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include testing instructions
   - Add screenshots if applicable

5. Address review feedback promptly

### 4. Working with Channex API

**Important Considerations:**

- Always respect Channex.io's Terms of Service
- Do not abuse API rate limits
- Use appropriate API endpoints
- Handle authentication securely
- Never commit API keys or credentials
- Test thoroughly before merging

### 5. Self-Improvement Commands

This project includes self-improvement commands. When contributing:

1. Use existing commands where possible:
   ```bash
   npm run command generate-endpoint -- resource-name operations
   ```

2. Update commands if you change architecture

3. Document any new commands you add

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Add your Channex API key to `.env`

4. Run in development mode:
   ```bash
   npm run dev
   ```

## Testing

Before submitting a PR:

1. Run the build:
   ```bash
   npm run build
   ```

2. Test your changes against real API:
   ```bash
   npm run command test-all
   ```

3. Verify no TypeScript errors:
   ```bash
   npm run lint
   ```

## Areas for Contribution

We especially welcome contributions in these areas:

- Additional Channex API endpoints
- Improved error handling
- Documentation improvements
- Testing utilities (that work with real APIs)
- Performance optimizations
- Additional OTA channel support
- Webhook handling
- Booking management features

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Be patient - this is a community project

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Acknowledgments

- Thanks to all contributors who help improve this project
- Special thanks to Channex.io for providing the API that makes this possible
- Thanks to Anthropic for the MCP SDK

Remember: This is an unofficial project. Always test thoroughly and use at your own risk!
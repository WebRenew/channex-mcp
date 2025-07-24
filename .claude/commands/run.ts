#!/usr/bin/env node
import { execSync } from 'child_process';
import { resolve } from 'path';

// Command runner for self-improvement commands
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
  console.log('Available commands:');
  console.log('  generate-endpoint - Generate new API endpoint');
  console.log('  test-all - Run all tests');
  console.log('  update-docs - Update documentation');
  console.log('  improve-types - Improve TypeScript types');
  process.exit(0);
}

const commandPath = resolve(import.meta.dirname, `${command}.ts`);

try {
  execSync(`tsx ${commandPath} ${args.join(' ')}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} catch (error) {
  console.error(`Failed to run command: ${command}`);
  process.exit(1);
}

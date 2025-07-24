#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const docsPath = resolve(process.cwd(), 'CLAUDE.MD');
const packagePath = resolve(process.cwd(), 'package.json');

// Read current docs
let docs = readFileSync(docsPath, 'utf-8');

// Update version from package.json
const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
docs = docs.replace(/version": "[^"]+"/g, `version": "${pkg.version}"`);

// Find all tool definitions in src/index.ts
const indexPath = resolve(process.cwd(), 'src/index.ts');
const indexContent = readFileSync(indexPath, 'utf-8');

// Extract tool definitions
const toolMatches = indexContent.matchAll(/name: '(channex_[^']+)',\s*description: '([^']+)'/g);
const tools = Array.from(toolMatches).map(match => ({
  name: match[1],
  description: match[2],
}));

// Group tools by resource
const toolsByResource = {
  properties: tools.filter(t => t.name.includes('_propert')),
  roomTypes: tools.filter(t => t.name.includes('_room_type')),
  ratePlans: tools.filter(t => t.name.includes('_rate_plan')),
  ari: tools.filter(t => t.name.includes('_ari') || t.name.includes('_availability') || t.name.includes('_restrictions')),
};

// Generate tools documentation
let toolsDocs = '## Available Tools\n\n';

if (toolsByResource.properties.length > 0) {
  toolsDocs += '### Properties Management\n\n';
  toolsByResource.properties.forEach(tool => {
    toolsDocs += `- \`${tool.name}\` - ${tool.description}\n`;
  });
  toolsDocs += '\n';
}

if (toolsByResource.roomTypes.length > 0) {
  toolsDocs += '### Room Types Management\n\n';
  toolsByResource.roomTypes.forEach(tool => {
    toolsDocs += `- \`${tool.name}\` - ${tool.description}\n`;
  });
  toolsDocs += '\n';
}

if (toolsByResource.ratePlans.length > 0) {
  toolsDocs += '### Rate Plans Management\n\n';
  toolsByResource.ratePlans.forEach(tool => {
    toolsDocs += `- \`${tool.name}\` - ${tool.description}\n`;
  });
  toolsDocs += '\n';
}

if (toolsByResource.ari.length > 0) {
  toolsDocs += '### ARI Management\n\n';
  toolsByResource.ari.forEach(tool => {
    toolsDocs += `- \`${tool.name}\` - ${tool.description}\n`;
  });
  toolsDocs += '\n';
}

// Replace tools section in docs
const toolsStart = docs.indexOf('## Available Tools');
const toolsEnd = docs.indexOf('## Self-Improvement Workflow');
if (toolsStart !== -1 && toolsEnd !== -1) {
  docs = docs.substring(0, toolsStart) + toolsDocs + docs.substring(toolsEnd);
}

// Write updated docs
writeFileSync(docsPath, docs);
console.log('✅ Updated CLAUDE.MD with latest tool definitions');

// Generate API examples
console.log('\n📝 Generating API examples...');
// This could be expanded to generate example requests/responses

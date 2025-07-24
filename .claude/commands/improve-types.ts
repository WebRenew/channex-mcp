#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const resourceName = process.argv[2];
const sampleFile = process.argv[3];

if (!resourceName || !sampleFile) {
  console.error('Usage: improve-types <resource-name> <sample-file>');
  console.error('Example: improve-types properties samples/properties.json');
  process.exit(1);
}

// Read sample data
const sampleData = JSON.parse(readFileSync(sampleFile, 'utf-8'));

// Helper to generate TypeScript type from value
function generateType(value: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    const itemType = generateType(value[0], indent);
    return `${itemType}[]`;
  }
  
  if (typeof value === 'object') {
    const props = Object.entries(value).map(([key, val]) => {
      const isOptional = val === null || val === undefined;
      return `${spaces}  ${key}${isOptional ? '?' : ''}: ${generateType(val, indent + 1)};`;
    });
    return `{\n${props.join('\n')}\n${spaces}}`;
  }
  
  return 'any';
}

// Generate interface from sample
function generateInterface(name: string, data: any): string {
  const props = generateType(data.attributes || data, 0);
  return `export interface ${name} extends ChannexEntity {
  type: '${data.type || resourceName}';
  attributes: ${props};
}`;
}

// Process the sample data
let interfaces = '';

if (sampleData.data) {
  if (Array.isArray(sampleData.data) && sampleData.data.length > 0) {
    interfaces = generateInterface(
      resourceName.charAt(0).toUpperCase() + resourceName.slice(1),
      sampleData.data[0]
    );
  } else if (typeof sampleData.data === 'object') {
    interfaces = generateInterface(
      resourceName.charAt(0).toUpperCase() + resourceName.slice(1),
      sampleData.data
    );
  }
}

console.log('Generated TypeScript interface:\n');
console.log(interfaces);

// Ask user to confirm before writing
console.log('\nAdd this to src/types/index.ts? (y/n)');

process.stdin.once('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'y') {
    const typesPath = resolve(process.cwd(), 'src/types/index.ts');
    const currentTypes = readFileSync(typesPath, 'utf-8');
    writeFileSync(typesPath, currentTypes + '\n\n' + interfaces);
    console.log('✅ Types updated successfully');
  } else {
    console.log('❌ Types not updated');
  }
  process.exit(0);
});

#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Generate new endpoint handler
const resourceName = process.argv[2];
const operations = process.argv[3]?.split(',') || ['list', 'get', 'create', 'update', 'delete'];

if (!resourceName) {
  console.error('Usage: generate-endpoint <resource-name> [operations]');
  console.error('Example: generate-endpoint bookings list,get,create');
  process.exit(1);
}

const camelCase = (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const pascalCase = (str: string) => {
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const resourcePath = resolve(process.cwd(), `src/resources/${resourceName}.ts`);
const resourceClass = `${pascalCase(resourceName)}Resource`;
const resourceVar = `${camelCase(resourceName)}Resource`;

// Generate resource file
const resourceContent = `import { channexClient } from '../api/client.js';

export interface ${pascalCase(resourceName)}ListParams {
  pagination?: {
    page?: number;
    limit?: number;
  };
  filter?: Record<string, any>;
}

export interface ${pascalCase(resourceName)}CreateData {
  // TODO: Add fields based on API documentation
  [key: string]: any;
}

export class ${resourceClass} {
${operations.includes('list') ? `  async list(params?: ${pascalCase(resourceName)}ListParams) {
    try {
      const queryParams: any = {};
      
      if (params?.pagination) {
        queryParams['pagination[page]'] = params.pagination.page || 1;
        queryParams['pagination[limit]'] = params.pagination.limit || 10;
      }
      
      if (params?.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
          queryParams[\`filter[\${key}]\`] = value;
        });
      }
      
      return await channexClient.get('/api/v1/${resourceName}', queryParams);
    } catch (error) {
      throw error;
    }
  }
` : ''}
${operations.includes('get') ? `  async get(id: string) {
    try {
      return await channexClient.get(\`/api/v1/${resourceName}/\${id}\`);
    } catch (error) {
      throw error;
    }
  }
` : ''}
${operations.includes('create') ? `  async create(data: ${pascalCase(resourceName)}CreateData) {
    try {
      return await channexClient.post('/api/v1/${resourceName}', { ${resourceName.replace(/-/g, '_')}: data });
    } catch (error) {
      throw error;
    }
  }
` : ''}
${operations.includes('update') ? `  async update(id: string, data: Partial<${pascalCase(resourceName)}CreateData>) {
    try {
      return await channexClient.put(\`/api/v1/${resourceName}/\${id}\`, { ${resourceName.replace(/-/g, '_')}: data });
    } catch (error) {
      throw error;
    }
  }
` : ''}
${operations.includes('delete') ? `  async delete(id: string, force: boolean = false) {
    try {
      const params = force ? { force: true } : undefined;
      return await channexClient.delete(\`/api/v1/${resourceName}/\${id}\`, params);
    } catch (error) {
      throw error;
    }
  }
` : ''}
}

export const ${resourceVar} = new ${resourceClass}();
`;

writeFileSync(resourcePath, resourceContent);
console.log(`✅ Generated resource file: ${resourcePath}`);

// Generate tools in index.ts
console.log(`
Next steps:
1. Add TypeScript interfaces for ${resourceName} in src/types/index.ts
2. Add tool handlers in src/index.ts
3. Update CLAUDE.MD documentation
`);

import { Tool } from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ToolCatalog {
  version: string;
  lastUpdated: string;
  categories: {
    [key: string]: {
      name: string;
      description: string;
      tools: Array<{
        name: string;
        description: string;
        examples?: Array<{
          description: string;
          input: any;
        }>;
        parameters: {
          [key: string]: {
            type: string;
            description: string;
            required: boolean;
            enum?: string[];
            example?: any;
          };
        };
      }>;
    };
  };
}

async function loadToolCatalog(): Promise<ToolCatalog> {
  try {
    const catalogPath = path.join(__dirname, '../../tools.json');
    const catalogData = await fs.readFile(catalogPath, 'utf-8');
    return JSON.parse(catalogData);
  } catch (error) {
    console.error('Error loading tool catalog:', error);
    throw new Error('Failed to load tool catalog');
  }
}

export const systemTools: Tool[] = [
  {
    name: 'channex_list_tools',
    description: 'Get a catalog of all available Channex MCP tools with examples and documentation',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter tools by category',
          enum: ['properties', 'room_types', 'rate_plans', 'ari', 'channels', 'system']
        }
      }
    },
    handler: async (args: { category?: string }) => {
      try {
        const catalog = await loadToolCatalog();
        
        if (args.category) {
          const categoryData = catalog.categories[args.category];
          if (!categoryData) {
            return {
              error: {
                code: 'invalid_category',
                message: `Category '${args.category}' not found. Available categories: ${Object.keys(catalog.categories).join(', ')}`
              }
            };
          }
          
          return {
            version: catalog.version,
            lastUpdated: catalog.lastUpdated,
            category: args.category,
            ...categoryData
          };
        }
        
        // Return full catalog
        return catalog;
      } catch (error: any) {
        return {
          error: {
            code: 'catalog_error',
            message: error.message || 'Failed to retrieve tool catalog'
          }
        };
      }
    }
  }
];
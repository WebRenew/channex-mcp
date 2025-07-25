// This is the original MCP server code with proper JSON Schema
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { propertiesResource } from './resources/properties.js';
import { roomTypesResource } from './resources/room-types.js';
import { ratePlansResource } from './resources/rate-plans.js';
import { ariResource } from './resources/ari.js';

// Create MCP server
const server = new Server(
  {
    name: 'channex-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Properties Tools with JSON Schema
const propertyTools = [
  {
    name: 'channex_list_properties',
    description: 'List all properties in Channex',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        limit: { type: 'number', description: 'Items per page' },
        filter: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Property ID' },
            title: { type: 'string', description: 'Property title' },
            is_active: { type: 'boolean', description: 'Active status' }
          }
        }
      }
    },
  },
  {
    name: 'channex_get_property',
    description: 'Get a specific property by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Property ID' }
      },
      required: ['id']
    },
  },
  {
    name: 'channex_create_property',
    description: 'Create a new property',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        currency: { type: 'string', minLength: 3, maxLength: 3 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        zip_code: { type: 'string' },
        country: { type: 'string', minLength: 2, maxLength: 2 },
        state: { type: 'string' },
        city: { type: 'string' },
        address: { type: 'string' },
        longitude: { type: 'string' },
        latitude: { type: 'string' },
        timezone: { type: 'string' },
        property_type: { type: 'string' },
        group_id: { type: 'string' },
      },
      required: ['title', 'currency']
    },
  },
  {
    name: 'channex_update_property',
    description: 'Update an existing property',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            currency: { type: 'string', minLength: 3, maxLength: 3 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
          }
        }
      },
      required: ['id', 'data']
    },
  },
  {
    name: 'channex_delete_property',
    description: 'Delete a property',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        force: { type: 'boolean', description: 'Force delete even if has channels' }
      },
      required: ['id']
    },
  },
];

// Room Types Tools with JSON Schema
const roomTypeTools = [
  {
    name: 'channex_list_room_types',
    description: 'List room types',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    },
  },
  {
    name: 'channex_get_room_type',
    description: 'Get a specific room type',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    },
  },
  {
    name: 'channex_create_room_type',
    description: 'Create a new room type',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        title: { type: 'string' },
        occ_adults: { type: 'number' },
        occ_children: { type: 'number' },
        occ_infants: { type: 'number' },
        default_occupancy: { type: 'number' },
        count_of_rooms: { type: 'number' },
        room_kind: { type: 'string' }
      },
      required: ['property_id', 'title', 'occ_adults', 'count_of_rooms']
    },
  },
  {
    name: 'channex_update_room_type',
    description: 'Update an existing room type',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            occ_adults: { type: 'number' },
            occ_children: { type: 'number' },
            occ_infants: { type: 'number' },
            default_occupancy: { type: 'number' },
            count_of_rooms: { type: 'number' },
            room_kind: { type: 'string' }
          }
        }
      },
      required: ['id', 'data']
    },
  },
  {
    name: 'channex_delete_room_type',
    description: 'Delete a room type',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        force: { type: 'boolean', description: 'Force delete even if has bookings' }
      },
      required: ['id']
    },
  },
];

// Rate Plans Tools with JSON Schema
const ratePlanTools = [
  {
    name: 'channex_list_rate_plans',
    description: 'List rate plans',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        room_type_id: { type: 'string' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    },
  },
  {
    name: 'channex_get_rate_plan',
    description: 'Get a specific rate plan',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    },
  },
  {
    name: 'channex_create_rate_plan',
    description: 'Create a new rate plan',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        room_type_id: { type: 'string' },
        title: { type: 'string' },
        sell_mode: { type: 'string', enum: ['per_room', 'per_person'] },
        rate_mode: { type: 'string', enum: ['manual', 'derived', 'auto'] },
        currency: { type: 'string' }
      },
      required: ['property_id', 'room_type_id', 'title']
    },
  },
  {
    name: 'channex_update_rate_plan',
    description: 'Update an existing rate plan',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            sell_mode: { type: 'string', enum: ['per_room', 'per_person'] },
            rate_mode: { type: 'string', enum: ['manual', 'derived', 'auto'] },
            currency: { type: 'string' }
          }
        }
      },
      required: ['id', 'data']
    },
  },
  {
    name: 'channex_delete_rate_plan',
    description: 'Delete a rate plan',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        force: { type: 'boolean', description: 'Force delete even if has bookings' }
      },
      required: ['id']
    },
  },
];

// ARI Tools with JSON Schema
const ariTools = [
  {
    name: 'channex_get_availability',
    description: 'Get availability per room type',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        date: { type: 'string' },
        date_from: { type: 'string' },
        date_to: { type: 'string' }
      },
      required: ['property_id']
    },
  },
  {
    name: 'channex_get_restrictions',
    description: 'Get restrictions per rate plan',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        date: { type: 'string' },
        date_from: { type: 'string' },
        date_to: { type: 'string' },
        restrictions: {
          type: 'array',
          items: { type: 'string' },
          description: 'e.g., availability, rate, min_stay_arrival'
        }
      },
      required: ['property_id']
    },
  },
  {
    name: 'channex_update_ari',
    description: 'Update availability, rates, and restrictions',
    inputSchema: {
      type: 'object',
      properties: {
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property_id: { type: 'string' },
              rate_plan_id: { type: 'string' },
              room_type_id: { type: 'string' },
              date: { type: 'string' },
              availability: { type: 'number' },
              rate: { type: ['string', 'number'] },
              min_stay_arrival: { type: 'number' },
              min_stay_through: { type: 'number' },
              closed_to_arrival: { type: 'boolean' },
              closed_to_departure: { type: 'boolean' },
              stop_sell: { type: 'boolean' }
            },
            required: ['property_id', 'date']
          }
        }
      },
      required: ['values']
    },
  },
];

// Register all tools
const allTools = [...propertyTools, ...roomTypeTools, ...ratePlanTools, ...ariTools];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Properties handlers
    if (name === 'channex_list_properties') {
      const result = await propertiesResource.list({
        pagination: { page: args?.page as number, limit: args?.limit as number },
        filter: args?.filter as any,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_property') {
      const result = await propertiesResource.get(args?.id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_property') {
      const result = await propertiesResource.create(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_property') {
      const result = await propertiesResource.update(args?.id as string, args?.data as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_delete_property') {
      const result = await propertiesResource.delete(args?.id as string, args?.force as boolean);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // Room Types handlers
    if (name === 'channex_list_room_types') {
      const result = await roomTypesResource.list({
        pagination: { page: args?.page as number, limit: args?.limit as number },
        filter: { property_id: args?.property_id as string },
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_room_type') {
      const result = await roomTypesResource.get(args?.id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_room_type') {
      const result = await roomTypesResource.create(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_room_type') {
      const result = await roomTypesResource.update(args?.id as string, args?.data as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_delete_room_type') {
      const result = await roomTypesResource.delete(args?.id as string, args?.force as boolean);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // Rate Plans handlers
    if (name === 'channex_list_rate_plans') {
      const result = await ratePlansResource.list({
        pagination: { page: args?.page as number, limit: args?.limit as number },
        filter: args?.property_id || args?.room_type_id ? {
          property_id: args?.property_id as string,
          room_type_id: args?.room_type_id as string,
        } : undefined,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_rate_plan') {
      const result = await ratePlansResource.get(args?.id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_rate_plan') {
      const result = await ratePlansResource.create(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_rate_plan') {
      const result = await ratePlansResource.update(args?.id as string, args?.data as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_delete_rate_plan') {
      const result = await ratePlansResource.delete(args?.id as string, args?.force as boolean);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ARI handlers
    if (name === 'channex_get_availability') {
      const result = await ariResource.getAvailability(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_restrictions') {
      const result = await ariResource.getRestrictions(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_ari') {
      const result = await ariResource.updateARI(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: {
            code: error.code || 'error',
            message: error.message || 'An error occurred',
            details: error.details,
          },
        }, null, 2),
      }],
    };
  }
});

// Start the server
export async function startMCPServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Channex MCP server started');
}

// Export for use in main entry point
export { server };
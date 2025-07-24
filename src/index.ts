import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

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

// Properties Tools
const propertyTools = [
  {
    name: 'channex_list_properties',
    description: 'List all properties in Channex',
    inputSchema: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      filter: z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        is_active: z.boolean().optional(),
      }).optional(),
    }),
  },
  {
    name: 'channex_get_property',
    description: 'Get a specific property by ID',
    inputSchema: z.object({
      id: z.string().describe('Property ID'),
    }),
  },
  {
    name: 'channex_create_property',
    description: 'Create a new property',
    inputSchema: z.object({
      title: z.string(),
      currency: z.string().length(3),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      zip_code: z.string().optional(),
      country: z.string().length(2).optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      longitude: z.string().optional(),
      latitude: z.string().optional(),
      timezone: z.string().optional(),
      property_type: z.string().optional(),
      group_id: z.string().optional(),
    }),
  },
  {
    name: 'channex_update_property',
    description: 'Update an existing property',
    inputSchema: z.object({
      id: z.string(),
      data: z.object({
        title: z.string().optional(),
        currency: z.string().length(3).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        // ... other fields
      }),
    }),
  },
  {
    name: 'channex_delete_property',
    description: 'Delete a property',
    inputSchema: z.object({
      id: z.string(),
      force: z.boolean().optional().describe('Force delete even if has channels'),
    }),
  },
];

// Room Types Tools
const roomTypeTools = [
  {
    name: 'channex_list_room_types',
    description: 'List room types',
    inputSchema: z.object({
      property_id: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
    }),
  },
  {
    name: 'channex_get_room_type',
    description: 'Get a specific room type',
    inputSchema: z.object({
      id: z.string(),
    }),
  },
  {
    name: 'channex_create_room_type',
    description: 'Create a new room type',
    inputSchema: z.object({
      property_id: z.string(),
      title: z.string(),
      occ_adults: z.number(),
      occ_children: z.number().optional(),
      occ_infants: z.number().optional(),
      default_occupancy: z.number().optional(),
      count_of_rooms: z.number(),
      room_kind: z.string().optional(),
    }),
  },
];

// Rate Plans Tools
const ratePlanTools = [
  {
    name: 'channex_list_rate_plans',
    description: 'List rate plans',
    inputSchema: z.object({
      property_id: z.string().optional(),
      room_type_id: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
    }),
  },
  {
    name: 'channex_get_rate_plan',
    description: 'Get a specific rate plan',
    inputSchema: z.object({
      id: z.string(),
    }),
  },
  {
    name: 'channex_create_rate_plan',
    description: 'Create a new rate plan',
    inputSchema: z.object({
      property_id: z.string(),
      room_type_id: z.string(),
      title: z.string(),
      sell_mode: z.enum(['per_room', 'per_person']).optional(),
      rate_mode: z.enum(['manual', 'derived', 'auto']).optional(),
      currency: z.string().optional(),
    }),
  },
];

// ARI Tools
const ariTools = [
  {
    name: 'channex_get_availability',
    description: 'Get availability per room type',
    inputSchema: z.object({
      property_id: z.string(),
      date: z.string().optional(),
      date_from: z.string().optional(),
      date_to: z.string().optional(),
    }),
  },
  {
    name: 'channex_get_restrictions',
    description: 'Get restrictions per rate plan',
    inputSchema: z.object({
      property_id: z.string(),
      date: z.string().optional(),
      date_from: z.string().optional(),
      date_to: z.string().optional(),
      restrictions: z.array(z.string()).describe('e.g., availability, rate, min_stay_arrival'),
    }),
  },
  {
    name: 'channex_update_ari',
    description: 'Update availability, rates, and restrictions',
    inputSchema: z.object({
      values: z.array(z.object({
        property_id: z.string(),
        rate_plan_id: z.string().optional(),
        room_type_id: z.string().optional(),
        date: z.string(),
        availability: z.number().optional(),
        rate: z.union([z.string(), z.number()]).optional(),
        min_stay_arrival: z.number().optional(),
        min_stay_through: z.number().optional(),
        closed_to_arrival: z.boolean().optional(),
        closed_to_departure: z.boolean().optional(),
        stop_sell: z.boolean().optional(),
      })),
    }),
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
        pagination: { page: args.page, limit: args.limit },
        filter: args.filter,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_property') {
      const result = await propertiesResource.get(args.id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_property') {
      const result = await propertiesResource.create(args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_property') {
      const result = await propertiesResource.update(args.id, args.data);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_delete_property') {
      const result = await propertiesResource.delete(args.id, args.force);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // Room Types handlers
    if (name === 'channex_list_room_types') {
      const result = await roomTypesResource.list({
        pagination: { page: args.page, limit: args.limit },
        filter: { property_id: args.property_id },
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_room_type') {
      const result = await roomTypesResource.get(args.id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_room_type') {
      const result = await roomTypesResource.create(args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // Rate Plans handlers
    if (name === 'channex_list_rate_plans') {
      const result = await ratePlansResource.list({
        pagination: { page: args.page, limit: args.limit },
        filter: args.property_id || args.room_type_id ? {
          property_id: args.property_id,
          room_type_id: args.room_type_id,
        } : undefined,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_rate_plan') {
      const result = await ratePlansResource.get(args.id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_rate_plan') {
      const result = await ratePlansResource.create(args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ARI handlers
    if (name === 'channex_get_availability') {
      const result = await ariResource.getAvailability(args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_restrictions') {
      const result = await ariResource.getRestrictions(args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_ari') {
      const result = await ariResource.updateARI(args);
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
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Channex MCP server started');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});

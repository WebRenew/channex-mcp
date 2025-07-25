import { z } from 'zod';
import { propertiesResource } from './resources/properties.js';
import { roomTypesResource } from './resources/room-types.js';
import { ratePlansResource } from './resources/rate-plans.js';
import { ariResource } from './resources/ari.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
  handler: (params: any) => Promise<any>;
}

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    this.registerPropertyTools();
    this.registerRoomTypeTools();
    this.registerRatePlanTools();
    this.registerARITools();
  }

  private registerPropertyTools() {
    this.register({
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
      handler: async (params) => {
        return propertiesResource.list({
          pagination: { page: params.page, limit: params.limit },
          filter: params.filter,
        });
      }
    });

    this.register({
      name: 'channex_get_property',
      description: 'Get a specific property by ID',
      inputSchema: z.object({
        id: z.string().describe('Property ID'),
      }),
      handler: async (params) => {
        return propertiesResource.get(params.id);
      }
    });

    this.register({
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
      handler: async (params) => {
        return propertiesResource.create(params);
      }
    });

    this.register({
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
      handler: async (params) => {
        return propertiesResource.update(params.id, params.data);
      }
    });

    this.register({
      name: 'channex_delete_property',
      description: 'Delete a property',
      inputSchema: z.object({
        id: z.string(),
        force: z.boolean().optional().describe('Force delete even if has channels'),
      }),
      handler: async (params) => {
        return propertiesResource.delete(params.id, params.force);
      }
    });
  }

  private registerRoomTypeTools() {
    this.register({
      name: 'channex_list_room_types',
      description: 'List room types',
      inputSchema: z.object({
        property_id: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().optional(),
      }),
      handler: async (params) => {
        return roomTypesResource.list({
          pagination: { page: params.page, limit: params.limit },
          filter: { property_id: params.property_id },
        });
      }
    });

    this.register({
      name: 'channex_get_room_type',
      description: 'Get a specific room type',
      inputSchema: z.object({
        id: z.string(),
      }),
      handler: async (params) => {
        return roomTypesResource.get(params.id);
      }
    });

    this.register({
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
      handler: async (params) => {
        return roomTypesResource.create(params);
      }
    });
  }

  private registerRatePlanTools() {
    this.register({
      name: 'channex_list_rate_plans',
      description: 'List rate plans',
      inputSchema: z.object({
        property_id: z.string().optional(),
        room_type_id: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().optional(),
      }),
      handler: async (params) => {
        return ratePlansResource.list({
          pagination: { page: params.page, limit: params.limit },
          filter: params.property_id || params.room_type_id ? {
            property_id: params.property_id,
            room_type_id: params.room_type_id,
          } : undefined,
        });
      }
    });

    this.register({
      name: 'channex_get_rate_plan',
      description: 'Get a specific rate plan',
      inputSchema: z.object({
        id: z.string(),
      }),
      handler: async (params) => {
        return ratePlansResource.get(params.id);
      }
    });

    this.register({
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
      handler: async (params) => {
        return ratePlansResource.create(params);
      }
    });
  }

  private registerARITools() {
    this.register({
      name: 'channex_get_availability',
      description: 'Get availability per room type',
      inputSchema: z.object({
        property_id: z.string(),
        date: z.string().optional(),
        date_from: z.string().optional(),
        date_to: z.string().optional(),
      }),
      handler: async (params) => {
        return ariResource.getAvailability(params);
      }
    });

    this.register({
      name: 'channex_get_restrictions',
      description: 'Get restrictions per rate plan',
      inputSchema: z.object({
        property_id: z.string(),
        date: z.string().optional(),
        date_from: z.string().optional(),
        date_to: z.string().optional(),
        restrictions: z.array(z.string()).describe('e.g., availability, rate, min_stay_arrival'),
      }),
      handler: async (params) => {
        return ariResource.getRestrictions(params);
      }
    });

    this.register({
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
      handler: async (params) => {
        return ariResource.updateARI(params);
      }
    });
  }

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  getAllTools() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.inputSchema)
    }));
  }

  async execute(toolName: string, params: any): Promise<any> {
    const tool = this.getTool(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    // Validate input
    const validatedParams = tool.inputSchema.parse(params);
    
    // Execute handler
    return tool.handler(validatedParams);
  }
}

// Convert Zod schema to JSON Schema (simplified)
function zodToJsonSchema(_schema: z.ZodSchema): any {
  // This is a simplified version - in production, use a proper zod-to-json-schema library
  return {
    type: 'object',
    description: 'Tool input parameters'
  };
}

export const toolRegistry = new ToolRegistry();

export async function executeToolHandler(toolName: string, params: any) {
  try {
    const result = await toolRegistry.execute(toolName, params);
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input parameters',
          details: error.errors
        }
      };
    }
    
    throw error;
  }
}
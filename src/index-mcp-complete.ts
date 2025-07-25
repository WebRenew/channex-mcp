// Complete MCP server with all fields from Channex API documentation
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
import { channelsResource } from './resources/channels.js';

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

// Properties Tools with complete JSON Schema
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
        facilities: { type: 'array', items: { type: 'string' } },
        website: { type: 'string' },
        content: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            important_information: { type: 'string' },
            photos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  position: { type: 'number' },
                  description: { type: 'string' },
                  author: { type: 'string' },
                  kind: { type: 'string', enum: ['photo', 'ad', 'menu'] }
                }
              }
            }
          }
        },
        settings: {
          type: 'object',
          properties: {
            allow_availability_autoupdate_on_confirmation: { type: 'boolean' },
            allow_availability_autoupdate_on_modification: { type: 'boolean' },
            allow_availability_autoupdate_on_cancellation: { type: 'boolean' },
            min_stay_type: { type: 'string', enum: ['arrival', 'through', 'both'] },
            max_price: { type: 'number' },
            min_price: { type: 'number' },
            max_day_advance: { type: 'number' },
            cut_off_days: { type: 'number' },
            cut_off_time: { type: 'string' },
            state_length: { type: 'number' }
          }
        }
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
            zip_code: { type: 'string' },
            country: { type: 'string', minLength: 2, maxLength: 2 },
            state: { type: 'string' },
            city: { type: 'string' },
            address: { type: 'string' },
            longitude: { type: 'string' },
            latitude: { type: 'string' },
            timezone: { type: 'string' },
            property_type: { type: 'string' },
            facilities: { type: 'array', items: { type: 'string' } },
            website: { type: 'string' },
            content: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                important_information: { type: 'string' },
                photos: { type: 'array' }
              }
            },
            settings: { type: 'object' }
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

// Room Types Tools with complete JSON Schema
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
        room_kind: { type: 'string', enum: ['room', 'dorm'] },
        capacity: { type: 'number', description: 'For dorm rooms' },
        facilities: { type: 'array', items: { type: 'string' } },
        content: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            photos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  position: { type: 'number' },
                  description: { type: 'string' },
                  author: { type: 'string' },
                  kind: { type: 'string', enum: ['photo', 'ad', 'menu'] }
                }
              }
            }
          }
        }
      },
      required: ['property_id', 'title', 'occ_adults', 'occ_children', 'occ_infants', 'default_occupancy', 'count_of_rooms']
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
            room_kind: { type: 'string', enum: ['room', 'dorm'] },
            capacity: { type: 'number' },
            facilities: { type: 'array', items: { type: 'string' } },
            content: { type: 'object' }
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

// Rate Plans Tools with complete JSON Schema including options
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
        rate_mode: { type: 'string', enum: ['manual', 'derived', 'auto', 'cascade'] },
        currency: { type: 'string' },
        tax_set_id: { type: 'string' },
        parent_rate_plan_id: { type: 'string' },
        children_fee: { type: 'string' },
        infant_fee: { type: 'string' },
        meal_type: { type: 'string', enum: ['none', 'breakfast', 'lunch', 'dinner', 'all_inclusive'] },
        
        // Restrictions arrays (7 elements for each day of week)
        max_stay: { type: 'array', items: { type: 'number' }, minItems: 7, maxItems: 7 },
        min_stay_arrival: { type: 'array', items: { type: 'number' }, minItems: 7, maxItems: 7 },
        min_stay_through: { type: 'array', items: { type: 'number' }, minItems: 7, maxItems: 7 },
        closed_to_arrival: { type: 'array', items: { type: 'boolean' }, minItems: 7, maxItems: 7 },
        closed_to_departure: { type: 'array', items: { type: 'boolean' }, minItems: 7, maxItems: 7 },
        stop_sell: { type: 'array', items: { type: 'boolean' }, minItems: 7, maxItems: 7 },
        
        // Critical options array for occupancy pricing
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              occupancy: { type: 'number', description: 'Number of guests' },
              is_primary: { type: 'boolean', description: 'Primary rate option' },
              rate: { type: 'number', description: 'Base rate amount' },
              derived_option: {
                type: 'object',
                properties: {
                  rate: {
                    type: 'array',
                    items: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            required: ['occupancy', 'is_primary']
          }
        },
        
        // Inheritance flags
        inherit_rate: { type: 'boolean' },
        inherit_closed_to_arrival: { type: 'boolean' },
        inherit_closed_to_departure: { type: 'boolean' },
        inherit_stop_sell: { type: 'boolean' },
        inherit_min_stay_arrival: { type: 'boolean' },
        inherit_min_stay_through: { type: 'boolean' },
        inherit_max_stay: { type: 'boolean' },
        inherit_availability_offset: { type: 'boolean' },
        inherit_max_sell: { type: 'boolean' },
        inherit_max_availability: { type: 'boolean' },
        
        auto_rate_settings: { type: 'object' }
      },
      required: ['property_id', 'room_type_id', 'title', 'options']
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
            rate_mode: { type: 'string', enum: ['manual', 'derived', 'auto', 'cascade'] },
            currency: { type: 'string' },
            tax_set_id: { type: 'string' },
            children_fee: { type: 'string' },
            infant_fee: { type: 'string' },
            meal_type: { type: 'string' },
            max_stay: { type: 'array' },
            min_stay_arrival: { type: 'array' },
            min_stay_through: { type: 'array' },
            closed_to_arrival: { type: 'array' },
            closed_to_departure: { type: 'array' },
            stop_sell: { type: 'array' },
            options: { type: 'array' },
            inherit_rate: { type: 'boolean' },
            inherit_closed_to_arrival: { type: 'boolean' },
            inherit_closed_to_departure: { type: 'boolean' },
            inherit_stop_sell: { type: 'boolean' },
            inherit_min_stay_arrival: { type: 'boolean' },
            inherit_min_stay_through: { type: 'boolean' },
            inherit_max_stay: { type: 'boolean' }
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

// ARI Tools with corrected JSON Schema
const ariTools = [
  {
    name: 'channex_get_availability',
    description: 'Get availability per room type',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        date: { type: 'string', description: 'Specific date (YYYY-MM-DD)' },
        date_gte: { type: 'string', description: 'Date from (YYYY-MM-DD)' },
        date_lte: { type: 'string', description: 'Date to (YYYY-MM-DD)' }
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
        date: { type: 'string', description: 'Specific date (YYYY-MM-DD)' },
        date_gte: { type: 'string', description: 'Date from (YYYY-MM-DD)' },
        date_lte: { type: 'string', description: 'Date to (YYYY-MM-DD)' },
        restrictions: {
          type: 'string',
          description: 'Comma-separated list: availability,rate,min_stay_arrival,min_stay_through,closed_to_arrival,closed_to_departure,stop_sell,max_stay'
        }
      },
      required: ['property_id', 'restrictions']
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
              date: { type: 'string', description: 'Single date update' },
              date_from: { type: 'string', description: 'Range start date' },
              date_to: { type: 'string', description: 'Range end date' },
              days: { type: 'array', items: { type: 'string' }, description: 'Weekdays: monday,tuesday,etc' },
              availability: { type: 'number' },
              rate: { type: ['string', 'number'] },
              rates: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    occupancy: { type: 'number' },
                    rate: { type: ['string', 'number'] }
                  }
                }
              },
              min_stay: { type: 'number' },
              min_stay_arrival: { type: 'number' },
              min_stay_through: { type: 'number' },
              max_stay: { type: 'number' },
              closed_to_arrival: { type: 'boolean' },
              closed_to_departure: { type: 'boolean' },
              stop_sell: { type: 'boolean' }
            },
            required: ['property_id']
          }
        }
      },
      required: ['values']
    },
  },
];

// Channel Tools with JSON Schema
const channelTools = [
  {
    name: 'channex_test_channel_api',
    description: 'Test channel API access and discover available endpoints',
    inputSchema: {
      type: 'object',
      properties: {}
    },
  },
  {
    name: 'channex_check_existing_connection',
    description: 'Check if a channel is already connected for specific properties',
    inputSchema: {
      type: 'object',
      properties: {
        channel_code: { 
          type: 'string', 
          description: 'Channel code to check (e.g., airbnb, booking_com)' 
        },
        property_ids: { 
          type: 'array',
          items: { type: 'string' },
          description: 'Property IDs to check for existing connections' 
        }
      },
      required: ['channel_code', 'property_ids']
    },
  },
  {
    name: 'channex_list_channels',
    description: 'List all channel connections',
    inputSchema: {
      type: 'object',
      properties: {
        property_id: { type: 'string', description: 'Filter by property ID' },
        channel_code: { type: 'string', description: 'Filter by channel code (e.g., airbnb)' },
        is_active: { type: 'boolean', description: 'Filter by active status' },
        page: { type: 'number', description: 'Page number' },
        limit: { type: 'number', description: 'Items per page' },
        fields: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Fields to include in response (reduces size)' 
        }
      }
    },
  },
  {
    name: 'channex_get_channel_by_code',
    description: 'Get channels by channel code (optimized for specific channel types like airbnb)',
    inputSchema: {
      type: 'object',
      properties: {
        channel_code: { 
          type: 'string', 
          description: 'Channel code (e.g., airbnb, booking_com)' 
        },
        property_id: { 
          type: 'string', 
          description: 'Optional: filter by property ID' 
        }
      },
      required: ['channel_code']
    },
  },
  {
    name: 'channex_get_channel',
    description: 'Get details of a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Channel ID' }
      },
      required: ['id']
    },
  },
  {
    name: 'channex_create_channel',
    description: 'Create a new channel connection (e.g., Airbnb)',
    inputSchema: {
      type: 'object',
      properties: {
        channel_code: { type: 'string', description: 'Channel code (e.g., airbnb, booking_com)' },
        title: { type: 'string', description: 'Channel connection title' },
        property_ids: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Array of property IDs to connect'
        },
        settings: {
          type: 'object',
          description: 'Channel-specific settings',
          properties: {
            min_stay_type: { 
              type: 'string', 
              enum: ['arrival', 'through'],
              description: 'Min stay type for Airbnb'
            },
            send_booking_notification_email: { 
              type: 'boolean',
              description: 'Send email notifications for bookings'
            }
          }
        }
      },
      required: ['channel_code', 'title', 'property_ids']
    },
  },
  {
    name: 'channex_update_channel',
    description: 'Update channel settings',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Channel ID' },
        data: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            is_active: { type: 'boolean' },
            property_ids: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Array of property IDs to connect to the channel'
            },
            settings: { type: 'object' }
          }
        }
      },
      required: ['id', 'data']
    },
  },
  {
    name: 'channex_delete_channel',
    description: 'Delete a channel connection',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Channel ID' }
      },
      required: ['id']
    },
  },
  {
    name: 'channex_get_channel_mappings',
    description: 'Get mappings between channel listings and rate plans',
    inputSchema: {
      type: 'object',
      properties: {
        channel_id: { type: 'string', description: 'Channel ID' }
      },
      required: ['channel_id']
    },
  },
  {
    name: 'channex_update_channel_mapping',
    description: 'Map a channel listing to a room type and rate plan',
    inputSchema: {
      type: 'object',
      properties: {
        channel_id: { type: 'string', description: 'Channel ID' },
        mapping_id: { type: 'string', description: 'Mapping ID' },
        data: {
          type: 'object',
          properties: {
            room_type_id: { type: 'string' },
            rate_plan_id: { type: 'string' },
            is_mapped: { type: 'boolean' },
            settings: { type: 'object' }
          }
        }
      },
      required: ['channel_id', 'mapping_id', 'data']
    },
  },
  {
    name: 'channex_get_airbnb_listings',
    description: 'Get Airbnb listings for a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channel_id: { type: 'string', description: 'Channel ID' }
      },
      required: ['channel_id']
    },
  },
  {
    name: 'channex_update_airbnb_listing',
    description: 'Update Airbnb listing settings (pricing, availability)',
    inputSchema: {
      type: 'object',
      properties: {
        channel_id: { type: 'string', description: 'Channel ID' },
        listing_id: { type: 'string', description: 'Listing ID' },
        settings: {
          type: 'object',
          properties: {
            price_settings: {
              type: 'object',
              properties: {
                currency: { type: 'string' },
                default_daily_price: { type: 'number' },
                default_weekend_price: { type: 'number' },
                monthly_stay_discount: { type: 'number' },
                weekly_stay_discount: { type: 'number' },
                price_per_extra_guest: { type: 'number' },
                guests_included: { type: 'number' },
                security_deposit: { type: 'number' },
                cleaning_fee: { type: 'number' }
              }
            },
            availability_settings: {
              type: 'object',
              properties: {
                number_of_days: { type: 'number' },
                number_of_hours: { type: 'number' },
                preparation_time: { type: 'number' },
                max_nights: { type: 'number' },
                min_nights: { type: 'number' },
                checkin_dates: { type: 'array', items: { type: 'string' } },
                checkout_dates: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      },
      required: ['channel_id', 'listing_id', 'settings']
    },
  },
];

// Register all tools
const allTools = [...propertyTools, ...roomTypeTools, ...ratePlanTools, ...ariTools, ...channelTools];

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

    // ARI handlers - with corrected parameter handling
    if (name === 'channex_get_availability') {
      const params: any = { property_id: args?.property_id };
      if (args?.date) {
        params.date = args.date;
      } else if (args?.date_gte && args?.date_lte) {
        params.date_from = args.date_gte;
        params.date_to = args.date_lte;
      }
      const result = await ariResource.getAvailability(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_restrictions') {
      const params: any = { 
        property_id: args?.property_id,
        restrictions: typeof args?.restrictions === 'string' ? args.restrictions.split(',') : []
      };
      if (args?.date) {
        params.date = args.date;
      } else if (args?.date_gte && args?.date_lte) {
        params.date_from = args.date_gte;
        params.date_to = args.date_lte;
      }
      const result = await ariResource.getRestrictions(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_ari') {
      const result = await ariResource.updateARI(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // Channel handlers
    if (name === 'channex_test_channel_api') {
      const result = await channelsResource.testAccess();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_check_existing_connection') {
      const result = await channelsResource.checkExistingConnection({
        channel_code: args?.channel_code as string,
        property_ids: args?.property_ids as string[]
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_list_channels') {
      const result = await channelsResource.list({
        pagination: { page: args?.page as number, limit: args?.limit as number },
        filter: {
          property_id: args?.property_id as string,
          channel_code: args?.channel_code as string,
          is_active: args?.is_active as boolean
        },
        fields: args?.fields as string[]
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_channel_by_code') {
      const result = await channelsResource.getByCode(
        args?.channel_code as string,
        args?.property_id as string
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_channel') {
      const result = await channelsResource.get(args?.id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_create_channel') {
      const result = await channelsResource.create({
        channel_code: args?.channel_code as string,
        title: args?.title as string,
        property_ids: args?.property_ids as string[],
        settings: args?.settings as any
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_channel') {
      const result = await channelsResource.update(args?.id as string, args?.data as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_delete_channel') {
      const result = await channelsResource.delete(args?.id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_channel_mappings') {
      const result = await channelsResource.getMappings(args?.channel_id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_channel_mapping') {
      const result = await channelsResource.updateMapping(
        args?.channel_id as string,
        args?.mapping_id as string,
        args?.data as any
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_get_airbnb_listings') {
      const result = await channelsResource.getAirbnbListings(args?.channel_id as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'channex_update_airbnb_listing') {
      const result = await channelsResource.updateAirbnbListing(
        args?.channel_id as string,
        args?.listing_id as string,
        args?.settings as any
      );
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
import { channexClient } from '../api/client.js';
import { truncateLargeObject, extractEssentialChannelFields } from '../utils/response-helpers.js';

export interface Channel {
  id: string;
  type: string;
  attributes: {
    channel_code: string;
    title: string;
    is_active: boolean;
    properties?: string[];
    settings?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ChannelMapping {
  id: string;
  type: string;
  attributes: {
    listing_id: string;
    room_type_id: string;
    rate_plan_id: string;
    property_id: string;
    is_mapped: boolean;
    settings?: Record<string, any>;
  };
}

export interface ListChannelsParams {
  pagination?: {
    page?: number;
    limit?: number;
  };
  filter?: {
    property_id?: string;
    channel_code?: string;
    is_active?: boolean;
  };
  fields?: string[]; // Add field filtering support
}

export class ChannelsResource {
  /**
   * Test if channel API endpoints are accessible
   */
  async testAccess() {
    const endpoints = [
      '/channels',
      '/channel_types',
      '/channel_connections',
      '/api/v1/channels'
    ];
    
    const results: Record<string, any> = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await channexClient.get(endpoint);
        results[endpoint] = {
          accessible: true,
          status: 200,
          data: response
        };
      } catch (error: any) {
        results[endpoint] = {
          accessible: false,
          status: error.response?.status || 'unknown',
          error: error.response?.data?.errors || error.message,
          requiresWhitelabel: error.response?.status === 403
        };
      }
    }
    
    return results;
  }

  /**
   * Check if a channel is already connected for specific properties
   */
  async checkExistingConnection(params: {
    channel_code: string;
    property_ids: string[];
  }) {
    try {
      // Get all channels for the given channel code
      const response = await this.list({
        filter: { channel_code: params.channel_code }
      });

      // Extract channels array from response
      const channels = response.data || [];

      // Check if any existing channel includes the requested properties
      const existingConnections = [];
      for (const channel of channels) {
        const connectedProperties = channel.attributes.properties || [];
        const overlap = params.property_ids.filter(id => 
          connectedProperties.includes(id)
        );
        
        if (overlap.length > 0) {
          existingConnections.push({
            channel_id: channel.id,
            channel_title: channel.attributes.title,
            overlapping_properties: overlap,
            is_active: channel.attributes.is_active
          });
        }
      }

      return {
        has_existing_connection: existingConnections.length > 0,
        existing_connections: existingConnections
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all channels
   */
  async list(params?: ListChannelsParams) {
    try {
      const queryParams: any = {};
      
      // Pagination params - ensure proper handling
      if (params?.pagination?.page) {
        queryParams['page'] = params.pagination.page;
      }
      
      if (params?.pagination?.limit) {
        queryParams['limit'] = params.pagination.limit;
      }
      
      // Filter params
      if (params?.filter?.property_id) {
        queryParams['property_id'] = params.filter.property_id;
      }
      
      if (params?.filter?.channel_code) {
        queryParams['channel_code'] = params.filter.channel_code;
      }
      
      if (params?.filter?.is_active !== undefined) {
        queryParams['is_active'] = params.filter.is_active;
      }
      
      // Field filtering to reduce response size
      if (params?.fields && params.fields.length > 0) {
        queryParams['fields'] = params.fields.join(',');
      }
      
      const response = await channexClient.get<any>('/channels', queryParams);
      
      // If response has included data (relationships), minimize it
      if (response.data && Array.isArray(response.data)) {
        response.data = response.data.map((channel: any) => {
          // Remove large included data if not explicitly requested
          if (channel.relationships && !params?.fields?.includes('relationships')) {
            delete channel.relationships;
          }
          if (channel.included) {
            delete channel.included;
          }
          return channel;
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific channel
   */
  async get(id: string, options?: { truncate?: boolean }) {
    try {
      const response = await channexClient.get<any>(`/channels/${id}`);
      
      // Apply truncation if requested or if response is very large
      if (options?.truncate || JSON.stringify(response).length > 50000) {
        if (response.data) {
          response.data = extractEssentialChannelFields(response.data);
        }
        // Handle included data if present
        if ((response as any).included) {
          (response as any).included = truncateLargeObject((response as any).included, 2, 5);
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get channels by channel code (more efficient than listing all)
   */
  async getByCode(channelCode: string, propertyId?: string) {
    try {
      const queryParams: any = {
        channel_code: channelCode,
        limit: 10,
        fields: 'id,title,channel_code,is_active,properties,created_at,updated_at'
      };
      
      if (propertyId) {
        queryParams.property_id = propertyId;
      }
      
      const response = await channexClient.get<any>('/channels', queryParams);
      
      // Truncate large nested objects
      if (response.data && Array.isArray(response.data)) {
        response.data = response.data.map((channel: any) => {
          // Keep only essential data
          const cleaned = {
            id: channel.id,
            type: channel.type,
            attributes: {
              channel_code: channel.attributes?.channel_code,
              title: channel.attributes?.title,
              is_active: channel.attributes?.is_active,
              properties: channel.attributes?.properties || [],
              created_at: channel.attributes?.created_at,
              updated_at: channel.attributes?.updated_at,
              // Truncate settings if too large
              settings: channel.attributes?.settings ? 
                { truncated: true, keys: Object.keys(channel.attributes.settings) } : 
                undefined
            }
          };
          return cleaned;
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new channel connection
   */
  async create(data: {
    channel_code: string;
    title: string;
    property_ids: string[];
    settings?: Record<string, any>;
  }) {
    try {
      return await channexClient.post<Channel>('/channels', {
        channel: {
          channel_code: data.channel_code,
          title: data.title,
          property_ids: data.property_ids,
          settings: data.settings
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update channel settings
   */
  async update(id: string, data: {
    title?: string;
    is_active?: boolean;
    property_ids?: string[];
    settings?: Record<string, any>;
  }) {
    try {
      return await channexClient.put<Channel>(`/channels/${id}`, {
        channel: data
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a channel
   */
  async delete(id: string) {
    try {
      return await channexClient.delete(`/channels/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get channel mappings
   */
  async getMappings(channelId: string, options?: { limit?: number }) {
    try {
      const queryParams: any = {};
      if (options?.limit) {
        queryParams.limit = options.limit;
      }
      
      const response = await channexClient.get<any>(`/channels/${channelId}/mappings`, queryParams);
      
      // Truncate large mapping responses
      if (response.data && Array.isArray(response.data) && response.data.length > 20) {
        const originalLength = response.data.length;
        response.data = response.data.slice(0, 20);
        // Add truncation info to meta or as a separate property
        if (!response.meta) response.meta = {};
        (response as any).meta.truncated = true;
        (response as any).meta.truncated_count = originalLength - 20;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update channel mapping
   */
  async updateMapping(channelId: string, mappingId: string, data: {
    room_type_id?: string;
    rate_plan_id?: string;
    is_mapped?: boolean;
    settings?: Record<string, any>;
  }) {
    try {
      return await channexClient.put<ChannelMapping>(`/channels/${channelId}/mappings/${mappingId}`, {
        mapping: data
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Airbnb-specific listings
   */
  async getAirbnbListings(channelId: string) {
    try {
      return await channexClient.get(`/channels/${channelId}/listings`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Airbnb listing settings
   */
  async updateAirbnbListing(channelId: string, listingId: string, settings: {
    price_settings?: {
      currency?: string;
      default_daily_price?: number;
      default_weekend_price?: number;
      monthly_stay_discount?: number;
      weekly_stay_discount?: number;
      price_per_extra_guest?: number;
      guests_included?: number;
      security_deposit?: number;
      cleaning_fee?: number;
    };
    availability_settings?: {
      number_of_days?: number;
      number_of_hours?: number;
      preparation_time?: number;
      max_nights?: number;
      min_nights?: number;
      checkin_dates?: string[];
      checkout_dates?: string[];
    };
  }) {
    try {
      return await channexClient.put(`/channels/${channelId}/listings/${listingId}`, {
        listing: settings
      });
    } catch (error) {
      throw error;
    }
  }
}

export const channelsResource = new ChannelsResource();
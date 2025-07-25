import { channexClient } from '../api/client.js';

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
   * List all channels
   */
  async list(params?: ListChannelsParams) {
    try {
      const queryParams: any = {};
      
      if (params?.pagination?.page) {
        queryParams['page[number]'] = params.pagination.page;
      }
      
      if (params?.pagination?.limit) {
        queryParams['page[size]'] = params.pagination.limit;
      }
      
      if (params?.filter?.property_id) {
        queryParams['filter[property_id]'] = params.filter.property_id;
      }
      
      if (params?.filter?.channel_code) {
        queryParams['filter[channel_code]'] = params.filter.channel_code;
      }
      
      if (params?.filter?.is_active !== undefined) {
        queryParams['filter[is_active]'] = params.filter.is_active;
      }
      
      return await channexClient.get<Channel[]>('/channels', queryParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific channel
   */
  async get(id: string) {
    try {
      return await channexClient.get<Channel>(`/channels/${id}`);
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
  async getMappings(channelId: string) {
    try {
      return await channexClient.get<ChannelMapping[]>(`/channels/${channelId}/mappings`);
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
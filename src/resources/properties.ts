import { channexClient } from '../api/client.js';
import { Property } from '../types/index.js';

export interface PropertyListParams {
  pagination?: {
    page?: number;
    limit?: number;
  };
  filter?: {
    id?: string;
    title?: string;
    is_active?: boolean;
  };
}

export interface PropertyCreateData {
  title: string;
  currency: string;
  email?: string;
  phone?: string;
  zip_code?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  longitude?: string;
  latitude?: string;
  timezone?: string;
  facilities?: string[];
  property_type?: string;
  group_id?: string;
  settings?: any;
  content?: any;
  logo_url?: string;
  website?: string;
}

export class PropertiesResource {
  async list(params?: PropertyListParams) {
    try {
      const queryParams: any = {};
      
      if (params?.pagination) {
        queryParams['pagination[page]'] = params.pagination.page || 1;
        queryParams['pagination[limit]'] = params.pagination.limit || 10;
      }
      
      if (params?.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
          queryParams[`filter[${key}]`] = value;
        });
      }
      
      return await channexClient.get<Property[]>('/properties', queryParams);
    } catch (error) {
      throw error;
    }
  }

  async get(id: string) {
    try {
      return await channexClient.get<Property>(`/properties/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async create(data: PropertyCreateData) {
    try {
      return await channexClient.post<Property>('/properties', { property: data });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: Partial<PropertyCreateData>) {
    try {
      return await channexClient.put<Property>(`/properties/${id}`, { property: data });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string, force: boolean = false) {
    try {
      const params = force ? { force: true } : undefined;
      return await channexClient.delete(`/properties/${id}`, params);
    } catch (error) {
      throw error;
    }
  }

  async options() {
    try {
      return await channexClient.get('/properties/options');
    } catch (error) {
      throw error;
    }
  }
}

export const propertiesResource = new PropertiesResource();

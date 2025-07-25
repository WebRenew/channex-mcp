import { channexClient } from '../api/client.js';
import { RatePlan } from '../types/index.js';

export interface RatePlanListParams {
  pagination?: {
    page?: number;
    limit?: number;
  };
  filter?: {
    property_id?: string;
    room_type_id?: string;
  };
}

export interface RatePlanCreateData {
  property_id: string;
  room_type_id: string;
  title: string;
  sell_mode?: 'per_room' | 'per_person';
  rate_mode?: 'manual' | 'derived' | 'auto';
  currency?: string;
  children_fee?: string;
  infant_fee?: string;
  meal_type?: string;
  options?: any[];
}

export class RatePlansResource {
  async list(params?: RatePlanListParams) {
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
      
      return await channexClient.get<RatePlan[]>('/rate_plans', queryParams);
    } catch (error) {
      throw error;
    }
  }

  async get(id: string) {
    try {
      return await channexClient.get<RatePlan>(`/rate_plans/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async create(data: RatePlanCreateData) {
    try {
      return await channexClient.post<RatePlan>('/rate_plans', { rate_plan: data });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: Partial<RatePlanCreateData>) {
    try {
      return await channexClient.put<RatePlan>(`/rate_plans/${id}`, { rate_plan: data });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string, force: boolean = false) {
    try {
      const params = force ? { force: true } : undefined;
      return await channexClient.delete(`/rate_plans/${id}`, params);
    } catch (error) {
      throw error;
    }
  }

  async options(propertyId?: string) {
    try {
      const params = propertyId ? { filter: { property_id: propertyId } } : undefined;
      return await channexClient.get('/rate_plans/options', params);
    } catch (error) {
      throw error;
    }
  }
}

export const ratePlansResource = new RatePlansResource();

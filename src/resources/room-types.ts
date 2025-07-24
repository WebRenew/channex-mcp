import { channexClient } from '../api/client.js';
import { RoomType } from '../types/index.js';

export interface RoomTypeListParams {
  pagination?: {
    page?: number;
    limit?: number;
  };
  filter?: {
    property_id?: string;
  };
}

export interface RoomTypeCreateData {
  property_id: string;
  title: string;
  occ_adults: number;
  occ_children?: number;
  occ_infants?: number;
  default_occupancy?: number;
  count_of_rooms: number;
  room_kind?: string;
  capacity?: number;
  facilities?: string[];
  content?: {
    description?: string;
    photos?: any[];
  };
}

export class RoomTypesResource {
  async list(params?: RoomTypeListParams) {
    try {
      const queryParams: any = {};
      
      if (params?.pagination) {
        queryParams['pagination[page]'] = params.pagination.page || 1;
        queryParams['pagination[limit]'] = params.pagination.limit || 10;
      }
      
      if (params?.filter?.property_id) {
        queryParams['filter[property_id]'] = params.filter.property_id;
      }
      
      return await channexClient.get<RoomType[]>('/api/v1/room_types', queryParams);
    } catch (error) {
      throw error;
    }
  }

  async get(id: string) {
    try {
      return await channexClient.get<RoomType>(`/api/v1/room_types/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async create(data: RoomTypeCreateData) {
    try {
      return await channexClient.post<RoomType>('/api/v1/room_types', { room_type: data });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: Partial<RoomTypeCreateData>) {
    try {
      return await channexClient.put<RoomType>(`/api/v1/room_types/${id}`, { room_type: data });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string, force: boolean = false) {
    try {
      const params = force ? { force: true } : undefined;
      return await channexClient.delete(`/api/v1/room_types/${id}`, params);
    } catch (error) {
      throw error;
    }
  }

  async options() {
    try {
      return await channexClient.get('/api/v1/room_types/options');
    } catch (error) {
      throw error;
    }
  }
}

export const roomTypesResource = new RoomTypesResource();

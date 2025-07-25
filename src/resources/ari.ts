import { channexClient } from '../api/client.js';

export interface GetRestrictionsParams {
  property_id: string;
  date?: string;
  date_from?: string;
  date_to?: string;
  date_gte?: string;
  date_lte?: string;
  restrictions: string[]; // e.g., ['availability', 'rate', 'min_stay_arrival']
}

export interface GetAvailabilityParams {
  property_id: string;
  date?: string;
  date_from?: string;
  date_to?: string;
  date_gte?: string;
  date_lte?: string;
}

export interface UpdateARIData {
  values: Array<{
    property_id: string;
    rate_plan_id?: string;
    room_type_id?: string;
    date: string;
    availability?: number;
    rate?: string | number;
    min_stay_arrival?: number;
    min_stay_through?: number;
    min_stay?: number;
    closed_to_arrival?: boolean;
    closed_to_departure?: boolean;
    stop_sell?: boolean;
    max_stay?: number;
  }>;
}

export class ARIResource {
  async getRestrictions(params: GetRestrictionsParams) {
    try {
      const queryParams: any = {
        'filter[property_id]': params.property_id,
        'filter[restrictions]': params.restrictions.join(','),
      };

      if (params.date) {
        queryParams['filter[date]'] = params.date;
      } else if (params.date_from && params.date_to) {
        queryParams['filter[date][gte]'] = params.date_from;
        queryParams['filter[date][lte]'] = params.date_to;
      } else if (params.date_gte && params.date_lte) {
        queryParams['filter[date][gte]'] = params.date_gte;
        queryParams['filter[date][lte]'] = params.date_lte;
      }

      return await channexClient.get('/restrictions', queryParams);
    } catch (error) {
      throw error;
    }
  }

  async getAvailability(params: GetAvailabilityParams) {
    try {
      const queryParams: any = {
        'filter[property_id]': params.property_id,
      };

      if (params.date) {
        queryParams['filter[date]'] = params.date;
      } else if (params.date_from && params.date_to) {
        queryParams['filter[date][gte]'] = params.date_from;
        queryParams['filter[date][lte]'] = params.date_to;
      } else if (params.date_gte && params.date_lte) {
        queryParams['filter[date][gte]'] = params.date_gte;
        queryParams['filter[date][lte]'] = params.date_lte;
      }

      return await channexClient.get('/availability', queryParams);
    } catch (error) {
      throw error;
    }
  }

  async updateARI(data: UpdateARIData) {
    try {
      return await channexClient.post('/ari', data);
    } catch (error) {
      throw error;
    }
  }
}

export const ariResource = new ARIResource();

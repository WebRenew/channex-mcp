// Common types used across Channex API

export interface ChannexEntity {
  id: string;
  type: string;
  attributes: Record<string, any>;
  relationships?: Record<string, any>;
}

export interface Property extends ChannexEntity {
  type: 'property';
  attributes: {
    id: string;
    title: string;
    is_active: boolean;
    email?: string;
    phone?: string;
    currency: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    zip_code?: string;
    latitude?: string | null;
    longitude?: string | null;
    timezone?: string;
    property_type?: string;
    content?: {
      description?: string;
      photos?: Photo[];
      important_information?: string | null;
    };
    logo_url?: string | null;
    acc_channels_count?: number;
    settings?: PropertySettings;
  };
}

export interface PropertySettings {
  allow_availability_autoupdate_on_confirmation?: boolean;
  allow_availability_autoupdate_on_modification?: boolean;
  allow_availability_autoupdate_on_cancellation?: boolean;
  min_stay_type?: 'both' | 'arrival' | 'through';
  max_price?: string | number | null;
  min_price?: string | number | null;
  state_length?: number;
  cut_off_time?: string;
  cut_off_days?: number;
  max_day_advance?: number | null;
}

export interface Photo {
  id?: string;
  url: string;
  position: number;
  author?: string;
  kind?: 'photo' | 'ad' | 'menu';
  description?: string;
  property_id?: string;
  room_type_id?: string | null;
}

export interface RoomType extends ChannexEntity {
  type: 'room_type';
  attributes: {
    id: string;
    title: string;
    occ_adults: number;
    occ_children: number;
    occ_infants: number;
    default_occupancy: number;
    count_of_rooms: number;
    room_kind: string;
    capacity?: number | null;
    content?: {
      description?: string;
      photos?: Photo[];
    };
  };
}

export interface RatePlan extends ChannexEntity {
  type: 'rate_plan';
  attributes: {
    id: string;
    title: string;
    sell_mode: 'per_room' | 'per_person';
    rate_mode: 'manual' | 'derived' | 'auto';
    currency: string;
    children_fee?: string;
    infant_fee?: string;
    max_stay?: number[];
    min_stay_arrival?: number[];
    min_stay_through?: number[];
    closed_to_arrival?: boolean[];
    closed_to_departure?: boolean[];
    stop_sell?: boolean[];
    options?: RatePlanOption[];
    inherit_rate?: boolean;
    inherit_closed_to_arrival?: boolean;
    inherit_closed_to_departure?: boolean;
    inherit_stop_sell?: boolean;
    inherit_min_stay_arrival?: boolean;
    inherit_min_stay_through?: boolean;
    inherit_max_stay?: boolean;
    inherit_availability_offset?: boolean;
    inherit_max_sell?: boolean;
    inherit_max_availability?: boolean;
    auto_rate_settings?: any;
    meal_type?: string;
  };
}

export interface RatePlanOption {
  occupancy: number;
  is_primary: boolean;
  derived_option?: any;
  rate: number;
}

export interface ARIUpdate {
  property_id: string;
  rate_plan_id?: string;
  room_type_id?: string;
  date_from: string;
  date_to: string;
  availability?: number;
  rate?: string | number;
  min_stay_arrival?: number;
  min_stay_through?: number;
  closed_to_arrival?: boolean;
  closed_to_departure?: boolean;
  stop_sell?: boolean;
  max_stay?: number;
}

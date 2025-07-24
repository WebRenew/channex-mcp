import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from 'dotenv';

config();

export interface ChannexConfig {
  apiKey: string;
  baseUrl: string;
}

export interface ChannexError {
  code: string;
  title: string;
  details?: Record<string, string[]>;
}

export interface ChannexResponse<T> {
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  errors?: ChannexError;
}

export class ChannexClient {
  private client: AxiosInstance;

  constructor(config?: Partial<ChannexConfig>) {
    const apiKey = config?.apiKey || process.env.CHANNEX_API_KEY;
    const baseUrl = config?.baseUrl || process.env.CHANNEX_BASE_URL || 'https://staging.channex.io';

    if (!apiKey) {
      throw new Error('CHANNEX_API_KEY is required');
    }

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'user-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ errors: ChannexError }>) => {
        if (error.response?.data?.errors) {
          const channexError = error.response.data.errors;
          throw {
            status: error.response.status,
            ...channexError,
          };
        }
        throw error;
      }
    );
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<ChannexResponse<T>> {
    const response = await this.client.get<ChannexResponse<T>>(path, { params });
    return response.data;
  }

  async post<T>(path: string, data: any): Promise<ChannexResponse<T>> {
    const response = await this.client.post<ChannexResponse<T>>(path, data);
    return response.data;
  }

  async put<T>(path: string, data: any): Promise<ChannexResponse<T>> {
    const response = await this.client.put<ChannexResponse<T>>(path, data);
    return response.data;
  }

  async delete(path: string, params?: Record<string, any>): Promise<ChannexResponse<void>> {
    const response = await this.client.delete<ChannexResponse<void>>(path, { params });
    return response.data;
  }
}

// Singleton instance
export const channexClient = new ChannexClient();

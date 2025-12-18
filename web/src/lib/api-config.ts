import { ApiClient } from '@/lib/api-config';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Animals API
export const animalsApi = {
  getAll: () => ApiClient.get('/animals'),
  getSows: () => ApiClient.get('/animals/sows'),
  getBoars: () => ApiClient.get('/animals/boars'),
  getById: (id: string) => ApiClient.get(`/animals/${id}`),
  create: (data: any) => ApiClient.post('/animals', data),
  update: (id: string, data: any) => ApiClient.patch(`/animals/${id}`, data),
  delete: (id: string) => ApiClient.delete(`/animals/${id}`),
};

// Add more API modules as needed:
// export const eventsApi = { ... };
// export const breedingApi = { ... };
// export const feedApi = { ... };

class ApiClientClass {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, data: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint: string, data: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const ApiClient = new ApiClientClass();

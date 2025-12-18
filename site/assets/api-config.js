// API Configuration for Frontend
// Uses environment variables for different deployment environments

const getApiUrl = () => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    // Try to get from window.ENV (injected by Vercel)
    if (window.ENV && window.ENV.NEXT_PUBLIC_API_URL) {
      return window.ENV.NEXT_PUBLIC_API_URL;
    }
  }
  
  // Fallback to process.env for Next.js
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default for local development
  return 'http://localhost:3001/api/v1';
};

export const API_BASE_URL = getApiUrl();

// API Client Helper
export class ApiClient {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
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

  static get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static patch(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Example usage:
// import { ApiClient } from './api-config';
// const animals = await ApiClient.get('/animals');
// const newAnimal = await ApiClient.post('/animals', { tagNo: 'SOW001', type: 'sow' });

// API Configuration for Frontend
const API_BASE_URL = 'https://pig-3k5m.onrender.com/api/v1';

export { API_BASE_URL };

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

/**
 * Centralized API service for consistent fetching and error handling
 */

const API_BASE = '/api';

export const request = async (url, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Request Error [${url}]:`, error);
    throw error;
  }
};

export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),
  
  // Special method for uploads (no JSON content-type header)
  upload: async (url, formData) => {
    try {
      const response = await fetch(url, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`API Upload Error [${url}]:`, error);
      throw error;
    }
  },
};

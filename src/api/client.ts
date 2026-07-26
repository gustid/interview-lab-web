import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

if(!baseURL) {
  throw new Error('API base URL is not defined. Please set the VITE_API_BASE_URL environment variable.');
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
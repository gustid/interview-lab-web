import axios from 'axios';
import { getAccessToken } from '../features/auth/auth-storage';

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

if (!baseURL) {
  throw new Error(
    'API base URL is not defined. Please set the VITE_API_BASE_URL environment variable.',
  );
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;

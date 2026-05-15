import axios from 'axios';
import { API_URL } from '../config.js';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jrq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jrq_token');
      localStorage.removeItem('jrq_user');
    }
    return Promise.reject(error);
  }
);


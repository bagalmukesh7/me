import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ugova_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ugova_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const getOpportunities = (params) => api.get('/api/opportunities', { params });
export const getOpportunity = (id) => api.get(`/api/opportunities/${id}`);

export const getApplications = () => api.get('/api/applications');
export const createApplication = (opportunityId) => api.post('/api/applications', { opportunity_id: opportunityId });

export const getProfile = () => api.get('/api/auth/profile');
export const updateProfile = (data) => api.put('/api/auth/profile', data);

export const getAdminStats = () => api.get('/api/admin/dashboard');
export const getAdminUsers = (params) => api.get('/api/admin/users', { params });
export const getAdminApplications = (params) => api.get('/api/admin/applications', { params });
export const updateApplicationStatus = (id, data) => api.put(`/api/admin/applications/${id}/status`, data);
export const triggerAI = () => api.post('/api/fetcher/trigger');

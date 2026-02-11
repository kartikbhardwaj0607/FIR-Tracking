import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// FIR APIs
export const firAPI = {
  getAllFIRs: () => api.get('/firs'),
  getFIRById: (id) => api.get(`/firs/${id}`),
  createFIR: (firData) => api.post('/firs', firData),
  updateFIR: (id, firData) => api.put(`/firs/${id}`, firData),
  deleteFIR: (id) => api.delete(`/firs/${id}`),
  getStats: () => api.get('/firs/stats/dashboard'),
};

export default api;

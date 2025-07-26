import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Crear instancia de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage (solo en el cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('🔍 [AXIOS] Request to:', config.url);
      console.log('🔍 [AXIOS] Token exists:', !!token);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ [AXIOS] Token added to request');
      } else {
        console.log('⚠️ [AXIOS] No token found or no headers');
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [AXIOS] Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 
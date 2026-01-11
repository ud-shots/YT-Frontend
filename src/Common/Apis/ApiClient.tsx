import axios, { InternalAxiosRequestConfig } from 'axios';
import ENDPOINTS from '../endpoints';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  is_file?: boolean;
  customHeaders?: Record<string, string>;
}

const apiClient = axios.create({
  baseURL: ENDPOINTS.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials : true
});

// Interceptor to dynamically get token and set headers
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    const vr = localStorage.getItem('vr');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (vr) {
      config.headers['vr'] = vr; // custom header name
    }

    if (config.is_file) {
      console.log(config.headers, 'headers')
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['vr'] = vr;
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    // Merge any additional custom headers
    if (config.customHeaders) {
      Object.keys(config.customHeaders).forEach(key => {
        config.headers[key] = config.customHeaders![key];
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
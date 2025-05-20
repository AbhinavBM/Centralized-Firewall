import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private cacheExpiry = 60000; // 1 minute in milliseconds

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(this.handleRequestConfig);
    this.api.interceptors.response.use(this.handleResponse, this.handleError);
  }

  private handleRequestConfig = (config: any): any => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    // Handle 304 responses (Not Modified)
    if (response.status === 304) {
      console.log(`Resource not modified: ${response.config.url}`);
    }
    return response;
  };

  private handleError = (error: any): Promise<never> => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  };

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Check if we have a valid cached response
    const cacheKey = `${url}-${JSON.stringify(config)}`;
    const cachedResponse = this.cache.get(cacheKey);
    const now = Date.now();

    if (cachedResponse && (now - cachedResponse.timestamp) < this.cacheExpiry) {
      // Return cached data if it's still valid
      return Promise.resolve(cachedResponse.data);
    }

    // Add cache control headers to GET requests
    const configWithCache = {
      ...config,
      headers: {
        ...config?.headers,
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
        'If-None-Match': cachedResponse?.data?.etag || '',
      }
    };

    return this.api.get<T>(url, configWithCache)
      .then((response) => {
        // Store the response in our cache
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: now
        });
        return response.data;
      });
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post<T>(url, data, config).then((response) => response.data);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put<T>(url, data, config).then((response) => response.data);
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch<T>(url, data, config).then((response) => response.data);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete<T>(url, config).then((response) => response.data);
  }
}

export const apiService = new ApiService();

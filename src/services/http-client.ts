import { API_CONFIG, STORAGE_KEYS } from '../config/api.config';

// Custom error class
export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message || `HTTP Error ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

// Type definitions
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
}

// Token management
const getStoredToken = (type: 'access' | 'refresh'): string | null => {
  const key = type === 'access' ? STORAGE_KEYS.ACCESS_TOKEN : STORAGE_KEYS.REFRESH_TOKEN;
  return localStorage.getItem(key);
};

const setStoredToken = (type: 'access' | 'refresh', token: string): void => {
  const key = type === 'access' ? STORAGE_KEYS.ACCESS_TOKEN : STORAGE_KEYS.REFRESH_TOKEN;
  localStorage.setItem(key, token);
};

const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Global token refresh flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeToRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// Refresh access token
async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeToRefresh(() => resolve(true));
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = getStoredToken('refresh');
    if (!refreshToken) {
      clearTokens();
      return false;
    }

    const response = await fetch(`${API_CONFIG.GATEWAY_URL}/user/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = (await response.json()) as TokenResponse;
      setStoredToken('access', data.accessToken);
      if (data.refreshToken) {
        setStoredToken('refresh', data.refreshToken);
      }
      isRefreshing = false;
      notifyRefreshSubscribers();
      return true;
    }

    clearTokens();
    isRefreshing = false;
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    isRefreshing = false;
    return false;
  }
}

// Main HTTP client
export async function httpClient(
  endpoint: string,
  config: RequestConfig = {}
): Promise<unknown> {
  const { method = 'GET', headers = {}, body, signal } = config;
  const url = `${API_CONFIG.GATEWAY_URL}${endpoint}`;

  // Prepare headers
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Inject auth token
  const accessToken = getStoredToken('access');
  if (accessToken) {
    finalHeaders.Authorization = `Bearer ${accessToken}`;
    console.log(`[HTTP] Adding auth header for ${method} ${endpoint}`);
  } else {
    console.warn(`[HTTP] ⚠ No access token for ${method} ${endpoint}`);
  }

  // Prepare options
  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    signal,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(url, fetchOptions);

    // Handle 401 - token expired, try refresh
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry request with new token
        const newToken = getStoredToken('access');
        finalHeaders.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, { ...fetchOptions, headers: finalHeaders });
      } else {
        // Refresh failed - clear auth and redirect to login
        clearTokens();
        window.location.href = '/auth/login';
        throw new HttpError(401, null, 'Session expired. Please login again.');
      }
    }

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error(`[HTTP] Failed to parse JSON response from ${endpoint}:`, parseErr);
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP Error ${response.status}`;
      console.error(`[HTTP] ${method} ${endpoint} → ${response.status}:`, errorMsg);
      throw new HttpError(response.status, data, errorMsg);
    }

    console.log(`[HTTP] ${method} ${endpoint} → 200`);
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof TypeError) {
      console.error(`[HTTP] Network error on ${method} ${endpoint}:`, error);
      throw new HttpError(0, null, 'Network error. Please check your connection.');
    }

    console.error(`[HTTP] Unknown error on ${method} ${endpoint}:`, error);
    throw new HttpError(500, null, String(error));
  }
}

// Convenience methods
export const http = {
  get: (endpoint: string, config?: RequestConfig) =>
    httpClient(endpoint, { ...config, method: 'GET' }),

  post: (endpoint: string, body?: unknown, config?: RequestConfig) =>
    httpClient(endpoint, { ...config, method: 'POST', body }),

  put: (endpoint: string, body?: unknown, config?: RequestConfig) =>
    httpClient(endpoint, { ...config, method: 'PUT', body }),

  patch: (endpoint: string, body?: unknown, config?: RequestConfig) =>
    httpClient(endpoint, { ...config, method: 'PATCH', body }),

  delete: (endpoint: string, config?: RequestConfig) =>
    httpClient(endpoint, { ...config, method: 'DELETE' }),
};

// Token getters for external use
export const tokenManager = {
  getAccessToken: () => getStoredToken('access'),
  getRefreshToken: () => getStoredToken('refresh'),
  setAccessToken: (token: string) => setStoredToken('access', token),
  setRefreshToken: (token: string) => setStoredToken('refresh', token),
  clearTokens,
};

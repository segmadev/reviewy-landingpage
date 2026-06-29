// API Configuration
const isProduction = import.meta.env.PROD;

export const API_CONFIG = {
  // In development, use relative URLs for Vite proxy
  // In production, use the full gateway URL
  GATEWAY_URL: isProduction
    ? import.meta.env.VITE_API_GATEWAY_URL || 'https://reviewyme-marketplace-yalzf.ondigitalocean.app'
    : '',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  TOKEN_REFRESH_THRESHOLD: parseInt(
    import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || '300000',
    10
  ), // 5 minutes
};

// Storage keys for tokens
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'rym_access_token',
  REFRESH_TOKEN: 'rym_refresh_token',
  USER: 'rym_user',
  RESUMED_ID: 'rym_resume_id',
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  SIGNUP: '/user/signup',
  LOGIN: '/user/login',
  LOGOUT: (userId: string) => `/user/logout/${userId}`,
  REFRESH_TOKEN: '/user/refresh-token',
  GET_PROFILE: '/user/profile',
  GET_USER: (userId: string) => `/user/${userId}`,

  // Resumes
  CREATE_RESUME: '/resume/resumes',
  GET_RESUME: (id: string) => `/resume/resumes/${id}`,
  UPDATE_RESUME: (id: string) => `/resume/resumes/${id}`,
  DELETE_RESUME: (id: string) => `/resume/resumes/${id}`,
  GET_USER_RESUMES: '/resume/resumes/user',
  AI_SUGGESTIONS: '/resume/resumes/ai-suggestions',

  // Products
  LIST_ACTIVE_PRODUCTS: '/product/active',
  GET_PRODUCT: (id: string) => `/product/find/${id}`,
  CREATE_PRODUCT: '/product/create',
  UPDATE_PRODUCT: (id: string) => `/product/update/${id}`,
  DEACTIVATE_PRODUCT: (id: string) => `/product/deactivate/${id}`,
  GET_ALL_PRODUCTS: '/product/get-all',

  // Payments
  INITIATE_PAYMENT: '/payment/initiate',
  VERIFY_PAYMENT: (transactionId: string) => `/payment/verify/${transactionId}`,
  GET_PAYMENT_HISTORY: '/payment/user-payments',

  // Notifications
  GET_USER_NOTIFICATIONS: '/notification/user-notifications',
  SEND_NOTIFICATION: '/notification/send',

  // User Products
  GET_USER_PURCHASED_PRODUCTS: (userId: string) => `/user-product/get/${userId}`,
};

/**
 * Application Configuration
 * Centralized configuration for feature flags and app behavior
 */

export const appConfig = {
  /**
   * AI Auto-Call Feature Flag
   * When true: AI endpoints are called automatically (e.g., skill suggestions, professional summary)
   * When false: AI features require explicit user action (clicking a button)
   *
   * Default: false (require user to opt-in to AI features)
   * This helps:
   * - Reduce unnecessary API calls
   * - Give users control over credit usage
   * - Improve performance
   * - Better user experience (no surprising AI-generated content)
   */
  AI_AUTO_CALL: false,

  /**
   * API Configuration
   */
  API: {
    // Base URL is handled by http-client.ts using VITE_API_GATEWAY_URL
    TIMEOUT: 30000, // 30 seconds
  },

  /**
   * Payment Configuration
   */
  PAYMENT: {
    POLLING_INTERVAL: 2000, // 2 seconds
    POLLING_MAX_ATTEMPTS: 150, // 5 minutes total
  },

  /**
   * Cache Configuration
   */
  CACHE: {
    BUILDER_DRAFT_INTERVAL: 1000, // Auto-save every 1 second
    ANONYMOUS_SESSION_EXPIRY: 78 * 60 * 60 * 1000, // 78 hours in milliseconds
  },

  /**
   * Feature Flags
   */
  FEATURES: {
    WATERMARK_ON_PREVIEW: true, // Show watermark on preview when user has no credits
    ENABLE_ANALYTICS: false, // Enable analytics tracking
  },
};

export default appConfig;

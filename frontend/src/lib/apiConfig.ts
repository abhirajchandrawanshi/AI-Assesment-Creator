/**
 * Centralized API Configuration
 * 
 * This module manages all backend API configuration for the VedaAI platform.
 * It supports environment-based configuration for development, staging, and production.
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_API_URL: Full backend API base URL
 * - NEXT_PUBLIC_WS_URL: WebSocket server URL (optional, defaults to API_URL)
 * 
 * Default Fallback:
 * - Development: http://localhost:5000
 * - Production: https://ai-assesment-creator-x2jv.onrender.com
 */

/**
 * Get the API base URL from environment variables or fallback to localhost
 * 
 * Priority:
 * 1. NEXT_PUBLIC_API_URL environment variable
 * 2. Localhost for development
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get the WebSocket URL from environment variables or use API_URL
 * 
 * Priority:
 * 1. NEXT_PUBLIC_WS_URL environment variable
 * 2. API_URL as fallback
 */
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || API_URL;

/**
 * API Endpoints Configuration
 * All API routes are prefixed with /api
 */
export const API_ENDPOINTS = {
  // Assignment endpoints
  ASSIGNMENTS: '/api/assignments',
  ASSIGNMENT_DETAIL: (id: string) => `/api/assignments/${id}`,
  ASSIGNMENT_PAPER: (id: string) => `/api/assignments/${id}/paper`,
  
  // User endpoints
  USER_PROFILE: '/api/user/profile',
  USER_PROFILE_PICTURE: '/api/user/profile-picture',
  
  // Notification endpoints
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_READ: (id: string) => `/api/notifications/${id}/read`,
  
  // Health check
  HEALTH: '/health',
};

/**
 * Build full API URL for given endpoint
 * 
 * @param endpoint - Relative API endpoint
 * @returns Full API URL
 * 
 * @example
 * buildApiUrl('/api/assignments') 
 * // Returns: 'https://api.example.com/api/assignments'
 */
export function buildApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
}

/**
 * Fetch configuration with sensible defaults
 * Includes credentials for cookie-based auth (if implemented)
 */
export const FETCH_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' as const, // Include cookies in requests
  cache: 'no-store' as const, // Disable caching for API calls
};

/**
 * Socket.IO connection configuration
 * 
 * Options:
 * - transports: WebSocket preferred over polling
 * - reconnection: Enable automatic reconnection
 * - reconnectionDelay: Initial delay before reconnection attempt
 * - reconnectionDelayMax: Maximum delay between reconnection attempts
 */
export const SOCKET_CONFIG = {
  url: WS_URL,
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
};

/**
 * API Client Configuration
 * Used for consistency across all API calls
 */
export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials
};

/**
 * Validate that required environment variables are set
 * Call this during app initialization
 * 
 * @example
 * validateApiConfig();
 */
export function validateApiConfig(): void {
  if (!API_URL) {
    console.warn(
      '⚠️ API_URL not configured. Using default localhost:5000. ' +
      'Set NEXT_PUBLIC_API_URL environment variable for production.'
    );
  }

  if (typeof window === 'undefined') {
    // Server-side logging
    console.info(`✅ API Configuration loaded: ${API_URL}`);
  }
}

/**
 * Get environment name for logging/debugging
 */
export function getEnvironment(): 'development' | 'production' {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }
  return 'development';
}

/**
 * Check if running in production
 */
export const isProduction = getEnvironment() === 'production';

/**
 * Log API configuration (useful for debugging)
 * Should only be used in development
 */
export function logApiConfig(): void {
  if (!isProduction) {
    console.group('🔧 API Configuration');
    console.log('API URL:', API_URL);
    console.log('WS URL:', WS_URL);
    console.log('Environment:', getEnvironment());
    console.groupEnd();
  }
}

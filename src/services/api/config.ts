
// Binance API Configuration

// API configuration
export const API_CONFIG = {
  backendUrl: '/api/binance', // Using proxy
  apiKeyHeader: 'x-api-key', // Backend API key header
  frontendApiKey: import.meta.env.VITE_API_KEY || 'development-api-key', // Frontend API key
  supportedPairs: ['ADAEUR', 'BTCEUR'], // Only support these pairs
  isDevMode: import.meta.env.DEV // Check if we're in development mode
};

// Local storage keys
export const STORAGE_KEYS = {
  apiKey: 'binance_api_key',
  apiSecret: 'binance_api_secret'
};

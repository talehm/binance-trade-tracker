
// Binance API Configuration

// API configuration
export const API_CONFIG = {
  backendUrl: '/api/binance', // Using proxy
  apiKeyHeader: 'x-api-key', // Backend API key header
  frontendApiKey: import.meta.env.VITE_API_KEY || 'development-api-key', // Frontend API key
  supportedPairs: ['ADAEUR', 'BTCEUR', 'ETHEUR'], // Added ETHEUR to supported pairs
  isDevMode: import.meta.env.DEV, // Check if we're in development mode
  binanceApiKey: import.meta.env.VITE_BINANCE_API_KEY,
  binanceApiSecret: import.meta.env.VITE_BINANCE_API_SECRET,
  // We'll initialize with default value, but it will be updated by the TradingContext
  useMockData: localStorage.getItem('simulationMode') !== null 
    ? JSON.parse(localStorage.getItem('simulationMode') as string) 
    : true
};

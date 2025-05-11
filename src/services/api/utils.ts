
import { toast } from "@/components/ui/sonner";
import { API_CONFIG, STORAGE_KEYS } from "./config";

// Helper functions for the Binance API

/**
 * Load credentials from localStorage
 */
export function loadCredentials(): { apiKey: string | null; apiSecret: string | null } {
  const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
  const apiSecret = localStorage.getItem(STORAGE_KEYS.apiSecret);
  return { apiKey, apiSecret };
}

/**
 * Save credentials to localStorage
 */
export function saveCredentials(apiKey: string, apiSecret: string): void {
  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
  localStorage.setItem(STORAGE_KEYS.apiSecret, apiSecret);
}

/**
 * Clear credentials from localStorage
 */
export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEYS.apiKey);
  localStorage.removeItem(STORAGE_KEYS.apiSecret);
}

/**
 * Build headers for API requests
 */
export function buildHeaders(apiKey: string | null, apiSecret: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [API_CONFIG.apiKeyHeader]: API_CONFIG.frontendApiKey
  };
  
  if (apiKey) {
    headers['binance-api-key'] = apiKey;
  }
  
  if (apiSecret) {
    headers['binance-api-secret'] = apiSecret;
  }
  
  return headers;
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown, message: string): null {
  console.error(`${message}:`, error);
  toast.error(message);
  return null;
}

/**
 * Validate if a symbol is supported
 */
export function validateSymbol(symbol: string): boolean {
  if (!API_CONFIG.supportedPairs.includes(symbol)) {
    const errorMessage = `Symbol ${symbol} is not supported. Only ${API_CONFIG.supportedPairs.join(', ')} are supported.`;
    toast.error(errorMessage);
    return false;
  }
  return true;
}


import { toast } from "@/components/ui/sonner";
import { API_CONFIG } from "./config";

// Helper functions for the Binance API

/**
 * Build headers for API requests
 */
export function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    [API_CONFIG.apiKeyHeader]: API_CONFIG.frontendApiKey
  };
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

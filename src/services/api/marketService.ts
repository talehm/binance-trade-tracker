
import { TickerPrice } from "./types";
import { API_CONFIG } from "./config";
import { buildHeaders, handleApiError, validateSymbol } from "./utils";

export class MarketService {
  private apiKey: string | null;
  private apiSecret: string | null;
  
  constructor(apiKey: string | null, apiSecret: string | null) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
  
  /**
   * Get ticker price for a symbol
   */
  async getTickerPrice(symbol: string): Promise<TickerPrice | null> {
    try {
      if (!validateSymbol(symbol)) {
        return null;
      }
      
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/ticker/price?symbol=${symbol}`, {
        headers: buildHeaders(this.apiKey, this.apiSecret)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Failed to load price for ${symbol}`);
    }
  }
  
  /**
   * Get all ticker prices for supported pairs
   */
  async getAllTickerPrices(): Promise<TickerPrice[] | null> {
    try {
      // Create separate requests for each symbol
      const promises = API_CONFIG.supportedPairs.map(symbol =>
        fetch(`${API_CONFIG.backendUrl}/api/v3/ticker/price?symbol=${symbol}`, {
          headers: buildHeaders(this.apiKey, this.apiSecret)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`API error for ${symbol}: ${response.statusText}`);
          }
          return response.json();
        })
      );
      
      const results = await Promise.all(promises);
      
      if (results.length === 0) {
        throw new Error('Failed to fetch any price information');
      }
      
      return results;
    } catch (error) {
      return handleApiError(error, 'Failed to load price information');
    }
  }
}

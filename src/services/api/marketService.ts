
import { TickerPrice } from "./types";
import { API_CONFIG } from "./config";
import { buildHeaders, handleApiError, validateSymbol } from "./utils";
import { mockTickerPrices, mockPriceHistory, mockOrderBook } from "./mockData/marketMock";

export class MarketService {
  /**
   * Get ticker price for a symbol
   */
  async getTickerPrice(symbol: string): Promise<TickerPrice | null> {
    try {
      if (!validateSymbol(symbol)) {
        return null;
      }
      
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log(`Using mock price data for ${symbol}`);
        const mockPrice = mockTickerPrices.find(ticker => ticker.symbol === symbol);
        return mockPrice || { symbol, price: "0" };
      }
      
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/ticker/price?symbol=${symbol}`, {
        headers: buildHeaders()
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
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log('Using mock ticker prices data');
        return mockTickerPrices;
      }
      
      // Create separate requests for each symbol
      const promises = API_CONFIG.supportedPairs.map(symbol =>
        fetch(`${API_CONFIG.backendUrl}/api/v3/ticker/price?symbol=${symbol}`, {
          headers: buildHeaders()
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
  
  /**
   * Get price history for a symbol
   */
  async getPriceHistory(symbol: string, interval = "1d", limit = 7): Promise<any | null> {
    try {
      if (!validateSymbol(symbol)) {
        return null;
      }
      
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log(`Using mock price history data for ${symbol}`);
        return mockPriceHistory[symbol] || [];
      }
      
      const response = await fetch(
        `${API_CONFIG.backendUrl}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
        { headers: buildHeaders() }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Failed to load price history for ${symbol}`);
    }
  }
  
  /**
   * Get order book for a symbol
   */
  async getOrderBook(symbol: string, limit = 5): Promise<any | null> {
    try {
      if (!validateSymbol(symbol)) {
        return null;
      }
      
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log(`Using mock order book data for ${symbol}`);
        return mockOrderBook[symbol] || { bids: [], asks: [] };
      }
      
      const response = await fetch(
        `${API_CONFIG.backendUrl}/api/v3/depth?symbol=${symbol}&limit=${limit}`,
        { headers: buildHeaders() }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Failed to load order book for ${symbol}`);
    }
  }
}

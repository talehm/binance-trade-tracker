
import { Order, OrderRequest, TradeHistory } from "./types";
import { API_CONFIG } from "./config";
import { buildHeaders, handleApiError, validateSymbol } from "./utils";

export class TradeService {
  /**
   * Get open orders
   */
  async getOpenOrders(): Promise<Order[] | null> {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/openOrders`, {
        headers: buildHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const orders = await response.json();
      
      // Filter to only include supported pairs
      return orders.filter((order: Order) => 
        API_CONFIG.supportedPairs.includes(order.symbol)
      );
    } catch (error) {
      return handleApiError(error, 'Failed to load open orders');
    }
  }
  
  /**
   * Create a new order
   */
  async createOrder(order: OrderRequest): Promise<Order | null> {
    try {
      if (!validateSymbol(order.symbol)) {
        return null;
      }
      
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/order`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(order)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.msg || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Get trade history for a symbol
   */
  async getTradeHistory(symbol: string): Promise<TradeHistory[] | null> {
    try {
      if (!validateSymbol(symbol)) {
        return null;
      }
      
      const response = await fetch(`${API_CONFIG.backendUrl}/api/v3/myTrades?symbol=${symbol}`, {
        headers: buildHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Failed to load trade history for ${symbol}`);
    }
  }
}

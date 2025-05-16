
import { Order, OrderRequest, TradeHistory } from "./types";
import { API_CONFIG } from "./config";
import { buildHeaders, handleApiError, validateSymbol } from "./utils";
import { mockOpenOrders, mockTradeHistory } from "./mockData";

export class TradeService {
  /**
   * Get open orders
   */
  async getOpenOrders(): Promise<Order[] | null> {
    try {
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log('Using mock open orders data');
        return mockOpenOrders;
      }
      
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
      
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log('Using mock order creation data');
        // Create a synthetic order based on the request
        const mockOrder: Order = {
          symbol: order.symbol,
          orderId: Math.floor(Math.random() * 10000000),
          orderListId: -1,
          clientOrderId: `mock-${Date.now()}`,
          price: order.price?.toString() || "0",
          origQty: order.quantity.toString(),
          executedQty: "0",
          cummulativeQuoteQty: "0",
          status: "NEW",
          timeInForce: order.timeInForce || "GTC",
          type: order.type,
          side: order.side,
          stopPrice: order.stopPrice?.toString() || "0",
          icebergQty: order.icebergQty?.toString() || "0",
          time: Date.now(),
          updateTime: Date.now(),
          isWorking: true,
          origQuoteOrderQty: "0"
        };
        
        return mockOrder;
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
      
      // In development mode or if USE_MOCK_DATA is true, return mock data
      if (API_CONFIG.isDevMode || API_CONFIG.useMockData) {
        console.log(`Using mock trade history data for ${symbol}`);
        return mockTradeHistory[symbol] || [];
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

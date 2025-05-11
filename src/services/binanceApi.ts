
import { toast } from "@/components/ui/sonner";

// Types
export interface Asset {
  asset: string;
  free: string;
  locked: string;
  freeze: string;
  withdrawing: string;
  ipoable: string;
  btcValuation: string;
}

export interface AccountInfo {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: Asset[];
  permissions: string[];
}

export interface TickerPrice {
  symbol: string;
  price: string;
}

export interface Order {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: boolean;
  origQuoteOrderQty: string;
}

export interface TradeHistory {
  id: number;
  symbol: string;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  isBestMatch: boolean;
}

export interface OrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
  quantity: number;
  price?: number;
  newClientOrderId?: string;
  stopPrice?: number;
  icebergQty?: number;
}

class BinanceApi {
  private apiKey: string | null = null;
  private apiSecret: string | null = null;
  private backendUrl = '/api/binance'; // Using proxy
  private apiKeyHeader = 'x-api-key'; // Backend API key header
  private frontendApiKey = import.meta.env.VITE_API_KEY || 'development-api-key'; // Frontend API key
  private supportedPairs = ['ADAEUR', 'BTCEUR']; // Only support these pairs
  private isDevMode = import.meta.env.DEV; // Check if we're in development mode
  
  constructor() {
    // Load API key and secret from localStorage if available
    this.loadCredentials();
  }
  
  private loadCredentials() {
    this.apiKey = localStorage.getItem('binance_api_key');
    this.apiSecret = localStorage.getItem('binance_api_secret');
  }
  
  setCredentials(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    localStorage.setItem('binance_api_key', apiKey);
    localStorage.setItem('binance_api_secret', apiSecret);
    return this.testConnection();
  }
  
  clearCredentials() {
    this.apiKey = null;
    this.apiSecret = null;
    localStorage.removeItem('binance_api_key');
    localStorage.removeItem('binance_api_secret');
  }
  
  hasCredentials(): boolean {
    return !!(this.apiKey && this.apiSecret);
  }
  
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      [this.apiKeyHeader]: this.frontendApiKey
    };
    
    if (this.apiKey) {
      headers['binance-api-key'] = this.apiKey;
    }
    
    if (this.apiSecret) {
      headers['binance-api-secret'] = this.apiSecret;
    }
    
    return headers;
  }

  // Test connectivity to the API and validate API key
  async testConnection() {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('API key and secret are required');
      }
      
      const response = await fetch(`${this.backendUrl}/api/v3/ping`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Binance API');
      }
      
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Failed to connect to Binance API');
      return false;
    }
  }
  
  // Get account information
  async getAccountInfo(): Promise<AccountInfo | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      const response = await fetch(`${this.backendUrl}/api/v3/account`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch account info:', error);
      toast.error('Failed to load account information');
      return null;
    }
  }
  
  // Get ticker price for a symbol
  async getTickerPrice(symbol: string): Promise<TickerPrice | null> {
    try {
      if (!this.supportedPairs.includes(symbol)) {
        throw new Error(`Symbol ${symbol} is not supported. Only ${this.supportedPairs.join(', ')} are supported.`);
      }
      
      const response = await fetch(`${this.backendUrl}/api/v3/ticker/price?symbol=${symbol}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      toast.error(`Failed to load price for ${symbol}`);
      return null;
    }
  }
  
  // Get all ticker prices for supported pairs
  async getAllTickerPrices(): Promise<TickerPrice[] | null> {
    try {
      // Create separate requests for each symbol
      const promises = this.supportedPairs.map(symbol =>
        fetch(`${this.backendUrl}/api/v3/ticker/price?symbol=${symbol}`, {
          headers: this.getHeaders()
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
      console.error('Failed to fetch prices:', error);
      toast.error('Failed to load price information');
      return null;
    }
  }
  
  // Get open orders
  async getOpenOrders(): Promise<Order[] | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      const response = await fetch(`${this.backendUrl}/api/v3/openOrders`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const orders = await response.json();
      
      // Filter to only include supported pairs
      return orders.filter((order: Order) => 
        this.supportedPairs.includes(order.symbol)
      );
    } catch (error) {
      console.error('Failed to fetch open orders:', error);
      toast.error('Failed to load open orders');
      return null;
    }
  }
  
  // Create a new order
  async createOrder(order: OrderRequest): Promise<Order | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      if (!this.supportedPairs.includes(order.symbol)) {
        throw new Error(`Symbol ${order.symbol} is not supported. Only ${this.supportedPairs.join(', ')} are supported.`);
      }
      
      const response = await fetch(`${this.backendUrl}/api/v3/order`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(order)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.msg || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
  
  // Get trade history for a symbol
  async getTradeHistory(symbol: string): Promise<TradeHistory[] | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      if (!this.supportedPairs.includes(symbol)) {
        throw new Error(`Symbol ${symbol} is not supported. Only ${this.supportedPairs.join(', ')} are supported.`);
      }
      
      const response = await fetch(`${this.backendUrl}/api/v3/myTrades?symbol=${symbol}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch trade history for ${symbol}:`, error);
      toast.error(`Failed to load trade history for ${symbol}`);
      return null;
    }
  }
}

export const binanceApi = new BinanceApi();
export default binanceApi;

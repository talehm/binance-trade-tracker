
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

// Mock data for development
const MOCK_DATA = {
  prices: {
    ADAEUR: { symbol: "ADAEUR", price: "0.40" },
    BTCEUR: { symbol: "BTCEUR", price: "62000.00" }
  }
};

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
      
      // In development mode, just return true
      if (this.isDevMode) {
        console.log('DEV MODE: Bypassing API connection test');
        return true;
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
      return this.isDevMode; // Return true in dev mode even if connection fails
    }
  }
  
  // Get account information
  async getAccountInfo(): Promise<AccountInfo | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      // In development mode, return mock data
      if (this.isDevMode) {
        console.log('DEV MODE: Returning mock account data');
        return {
          makerCommission: 10,
          takerCommission: 10,
          buyerCommission: 0,
          sellerCommission: 0,
          canTrade: true,
          canWithdraw: true,
          canDeposit: true,
          updateTime: Date.now(),
          accountType: 'SPOT',
          balances: [
            { asset: 'BTC', free: '0.5', locked: '0', freeze: '0', withdrawing: '0', ipoable: '0', btcValuation: '0.5' },
            { asset: 'ADA', free: '1000', locked: '0', freeze: '0', withdrawing: '0', ipoable: '0', btcValuation: '0.002' },
            { asset: 'EUR', free: '10000', locked: '0', freeze: '0', withdrawing: '0', ipoable: '0', btcValuation: '0' }
          ],
          permissions: ['SPOT']
        };
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
      
      // Return mock data in case of error if in dev mode
      if (this.isDevMode) {
        return {
          makerCommission: 10,
          takerCommission: 10,
          buyerCommission: 0,
          sellerCommission: 0,
          canTrade: true,
          canWithdraw: true,
          canDeposit: true,
          updateTime: Date.now(),
          accountType: 'SPOT',
          balances: [
            { asset: 'BTC', free: '0.5', locked: '0', freeze: '0', withdrawing: '0', ipoable: '0', btcValuation: '0.5' },
            { asset: 'ADA', free: '1000', locked: '0', freeze: '0', withdrawing: '0', ipoable: '0', btcValuation: '0.002' },
            { asset: 'EUR', free: '10000', locked: '0', freeze: '0', withdrawing: '0', ipoable: '0', btcValuation: '0' }
          ],
          permissions: ['SPOT']
        };
      }
      
      return null;
    }
  }
  
  // Get ticker price for a symbol
  async getTickerPrice(symbol: string): Promise<TickerPrice | null> {
    try {
      if (!this.supportedPairs.includes(symbol)) {
        throw new Error(`Symbol ${symbol} is not supported. Only ${this.supportedPairs.join(', ')} are supported.`);
      }
      
      // In development mode, return mock data
      if (this.isDevMode) {
        console.log(`DEV MODE: Returning mock price for ${symbol}`);
        return MOCK_DATA.prices[symbol as keyof typeof MOCK_DATA.prices];
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
      
      // Return mock data in case of error if in dev mode
      if (this.isDevMode) {
        return MOCK_DATA.prices[symbol as keyof typeof MOCK_DATA.prices];
      }
      
      toast.error(`Failed to load price for ${symbol}`);
      return null;
    }
  }
  
  // Get all ticker prices for supported pairs
  async getAllTickerPrices(): Promise<TickerPrice[] | null> {
    try {
      // In development mode, return all mock prices
      if (this.isDevMode) {
        console.log('DEV MODE: Returning mock prices for all supported pairs');
        return this.supportedPairs.map(symbol => MOCK_DATA.prices[symbol as keyof typeof MOCK_DATA.prices]);
      }
      
      const results: TickerPrice[] = [];
      
        try {
          const response = await fetch(`${this.backendUrl}/api/v3/ticker/price?symbols=${encodeURIComponent(JSON.stringify(this.supportedPairs))}`, {
            headers: this.getHeaders()
          });
          
          if (response.ok) {
            const data = await response.json();
            results.push(data);
          } else {
            console.warn(`Failed to fetch price for ${pair}: ${response.status} ${response.statusText}`);
          }
        } catch (e) {
          console.error(`Error fetching price for ${pair}:`, e);
        }
      
      
      if (results.length === 0) {
        throw new Error('Failed to fetch any price information');
      }
      
      return results;
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      
      // Return mock data in case of error if in dev mode
      if (this.isDevMode) {
        return this.supportedPairs.map(symbol => MOCK_DATA.prices[symbol as keyof typeof MOCK_DATA.prices]);
      }
      
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
      
      // In development mode, return mock data
      if (this.isDevMode) {
        console.log('DEV MODE: Returning mock open orders');
        return [];
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
      
      // Return mock data in case of error if in dev mode
      if (this.isDevMode) {
        return [];
      }
      
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
      
      // In development mode, return mock data
      if (this.isDevMode) {
        console.log('DEV MODE: Creating mock order', order);
        toast.success(`Created mock ${order.side} order for ${order.quantity} ${order.symbol} at ${order.price || 'market price'}`);
        return {
          symbol: order.symbol,
          orderId: Math.floor(Math.random() * 1000000),
          orderListId: -1,
          clientOrderId: 'mock-order-' + Date.now(),
          price: order.price ? order.price.toString() : '0',
          origQty: order.quantity.toString(),
          executedQty: '0',
          cummulativeQuoteQty: '0',
          status: 'NEW',
          timeInForce: order.timeInForce || 'GTC',
          type: order.type,
          side: order.side,
          stopPrice: '0',
          icebergQty: '0',
          time: Date.now(),
          updateTime: Date.now(),
          isWorking: true,
          origQuoteOrderQty: '0'
        };
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
      
      // In development mode, return mock data
      if (this.isDevMode) {
        console.log(`DEV MODE: Returning mock trade history for ${symbol}`);
        return [
          {
            id: 1,
            symbol,
            price: symbol === 'ADAEUR' ? '0.38' : '61500.00',
            qty: symbol === 'ADAEUR' ? '500' : '0.05',
            quoteQty: symbol === 'ADAEUR' ? '190' : '3075',
            time: Date.now() - 3600000,
            isBuyer: true,
            isMaker: false,
            isBestMatch: true
          },
          {
            id: 2,
            symbol,
            price: symbol === 'ADAEUR' ? '0.41' : '62300.00',
            qty: symbol === 'ADAEUR' ? '300' : '0.03',
            quoteQty: symbol === 'ADAEUR' ? '123' : '1869',
            time: Date.now() - 7200000,
            isBuyer: false,
            isMaker: true,
            isBestMatch: true
          }
        ];
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
      
      // Return mock data in case of error if in dev mode
      if (this.isDevMode) {
        return [
          {
            id: 1,
            symbol,
            price: symbol === 'ADAEUR' ? '0.38' : '61500.00',
            qty: symbol === 'ADAEUR' ? '500' : '0.05',
            quoteQty: symbol === 'ADAEUR' ? '190' : '3075',
            time: Date.now() - 3600000,
            isBuyer: true,
            isMaker: false,
            isBestMatch: true
          },
          {
            id: 2,
            symbol,
            price: symbol === 'ADAEUR' ? '0.41' : '62300.00',
            qty: symbol === 'ADAEUR' ? '300' : '0.03',
            quoteQty: symbol === 'ADAEUR' ? '123' : '1869',
            time: Date.now() - 7200000,
            isBuyer: false,
            isMaker: true,
            isBestMatch: true
          }
        ];
      }
      
      toast.error(`Failed to load trade history for ${symbol}`);
      return null;
    }
  }
}

export const binanceApi = new BinanceApi();
export default binanceApi;

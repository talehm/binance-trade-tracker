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
  private backendUrl = 'http://localhost:5000/api/binance'; // New backend URL
  private apiKeyHeader = 'x-api-key'; // Backend API key header
  private frontendApiKey = 'your-frontend-api-key'; // Should be environment variable in production
  
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
      
      // For demo purposes, use mock data
      return this.getMockAccountInfo();
      
      // Real implementation:
      // const response = await fetch(`${this.backendUrl}/api/v3/account`, {
      //   headers: this.getHeaders()
      // });
      
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.statusText}`);
      // }
      
      // return await response.json();
    } catch (error) {
      console.error('Failed to fetch account info:', error);
      toast.error('Failed to load account information');
      return null;
    }
  }
  
  // Get ticker prices
  async getTickerPrice(symbol: string): Promise<TickerPrice | null> {
    try {
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
  
  // Get all ticker prices
  async getAllTickerPrices(): Promise<TickerPrice[] | null> {
    try {
      const response = await fetch(`${this.backendUrl}/api/v3/ticker/price`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
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
      
      // Mock implementation for demo
      return this.getMockOpenOrders();
      
      // Real implementation:
      // const response = await fetch(`${this.backendUrl}/api/v3/openOrders`, {
      //   headers: this.getHeaders()
      // });
      
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.statusText}`);
      // }
      
      // return await response.json();
    } catch (error) {
      console.error('Failed to fetch open orders:', error);
      toast.error('Failed to load open orders');
      return null;
    }
  }
  
  // Create a new order - fix the TypeScript error
  async createOrder(order: OrderRequest): Promise<Order | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      // Mock implementation for demo
      return this.createMockOrder(order);
      
      // Real implementation:
      // const response = await fetch(`${this.backendUrl}/api/v3/order`, {
      //   method: 'POST',
      //   headers: this.getHeaders(),
      //   body: JSON.stringify(order)
      // });
      
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.statusText}`);
      // }
      
      // return await response.json();
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to create order');
      return null;
    }
  }
  
  // Get trade history for a symbol
  async getTradeHistory(symbol: string): Promise<TradeHistory[] | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API credentials required');
      }
      
      // Mock implementation for demo
      return this.getMockTradeHistory(symbol);
      
      // Real implementation:
      // const response = await fetch(`${this.backendUrl}/api/v3/myTrades?symbol=${symbol}`, {
      //   headers: this.getHeaders()
      // });
      
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.statusText}`);
      // }
      
      // return await response.json();
    } catch (error) {
      console.error(`Failed to fetch trade history for ${symbol}:`, error);
      toast.error(`Failed to load trade history for ${symbol}`);
      return null;
    }
  }
  
  // Mock data methods for demonstration
  private getMockAccountInfo(): AccountInfo {
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
        { 
          asset: 'BTC',
          free: '0.01234000',
          locked: '0.00000000',
          freeze: '0.00000000',
          withdrawing: '0.00000000',
          ipoable: '0.00000000',
          btcValuation: '0.01234000'
        },
        { 
          asset: 'ETH',
          free: '0.56789000',
          locked: '0.10000000',
          freeze: '0.00000000',
          withdrawing: '0.00000000',
          ipoable: '0.00000000',
          btcValuation: '0.03456000'
        },
        { 
          asset: 'USDT',
          free: '1234.56789000',
          locked: '100.00000000',
          freeze: '0.00000000',
          withdrawing: '0.00000000',
          ipoable: '0.00000000',
          btcValuation: '0.05678000'
        },
        { 
          asset: 'ADA',
          free: '500.00000000',
          locked: '0.00000000',
          freeze: '0.00000000',
          withdrawing: '0.00000000',
          ipoable: '0.00000000',
          btcValuation: '0.00123000'
        },
        { 
          asset: 'BNB',
          free: '2.50000000',
          locked: '0.00000000',
          freeze: '0.00000000',
          withdrawing: '0.00000000',
          ipoable: '0.00000000',
          btcValuation: '0.00890000'
        },
        { 
          asset: 'SOL',
          free: '10.00000000',
          locked: '5.00000000',
          freeze: '0.00000000',
          withdrawing: '0.00000000',
          ipoable: '0.00000000',
          btcValuation: '0.00345000'
        }
      ],
      permissions: ['SPOT']
    };
  }
  
  private getMockOpenOrders(): Order[] {
    return [
      {
        symbol: 'BTCUSDT',
        orderId: 123456789,
        orderListId: -1,
        clientOrderId: 'mock-order-001',
        price: '30000.00',
        origQty: '0.01',
        executedQty: '0.00',
        cummulativeQuoteQty: '0.00',
        status: 'NEW',
        timeInForce: 'GTC',
        type: 'LIMIT',
        side: 'SELL',
        stopPrice: '0.00',
        icebergQty: '0.00',
        time: Date.now() - 3600000,
        updateTime: Date.now() - 1800000,
        isWorking: true,
        origQuoteOrderQty: '0.00'
      },
      {
        symbol: 'ETHUSDT',
        orderId: 123456790,
        orderListId: -1,
        clientOrderId: 'mock-order-002',
        price: '2000.00',
        origQty: '0.1',
        executedQty: '0.00',
        cummulativeQuoteQty: '0.00',
        status: 'NEW',
        timeInForce: 'GTC',
        type: 'LIMIT',
        side: 'SELL',
        stopPrice: '0.00',
        icebergQty: '0.00',
        time: Date.now() - 7200000,
        updateTime: Date.now() - 3600000,
        isWorking: true,
        origQuoteOrderQty: '0.00'
      },
      {
        symbol: 'ADAUSDT',
        orderId: 123456791,
        orderListId: -1,
        clientOrderId: 'mock-order-003',
        price: '0.77',
        origQty: '100',
        executedQty: '0.00',
        cummulativeQuoteQty: '0.00',
        status: 'NEW',
        timeInForce: 'GTC',
        type: 'LIMIT',
        side: 'SELL',
        stopPrice: '0.00',
        icebergQty: '0.00',
        time: Date.now() - 10800000,
        updateTime: Date.now() - 5400000,
        isWorking: true,
        origQuoteOrderQty: '0.00'
      }
    ];
  }
  
  private createMockOrder(orderRequest: OrderRequest): Order {
    const mockOrder: Order = {
      symbol: orderRequest.symbol,
      orderId: Math.floor(Math.random() * 1000000000),
      orderListId: -1,
      clientOrderId: `mock-order-${Date.now()}`,
      price: orderRequest.price ? orderRequest.price.toString() : '0.00',
      origQty: orderRequest.quantity.toString(),
      executedQty: '0.00',
      cummulativeQuoteQty: '0.00',
      status: 'NEW',
      timeInForce: orderRequest.timeInForce || 'GTC',
      type: orderRequest.type,
      side: orderRequest.side,
      stopPrice: orderRequest.stopPrice ? orderRequest.stopPrice.toString() : '0.00',
      icebergQty: orderRequest.icebergQty ? orderRequest.icebergQty.toString() : '0.00',
      time: Date.now(),
      updateTime: Date.now(),
      isWorking: true,
      origQuoteOrderQty: '0.00'
    };
    
    // Add to mock open orders for demonstration
    const mockOpenOrders = this.getMockOpenOrders();
    mockOpenOrders.push(mockOrder);
    
    toast.success(`${orderRequest.side} order created for ${orderRequest.symbol}`);
    return mockOrder;
  }
  
  private getMockTradeHistory(symbol: string): TradeHistory[] {
    // Generate some mock trades based on the symbol
    const trades: TradeHistory[] = [];
    
    // Generate 10 mock trades
    for (let i = 0; i < 10; i++) {
      const isBuyer = Math.random() > 0.5;
      const timestamp = Date.now() - (i * 86400000); // One day apart
      
      let price = '0.00';
      let qty = '0.00';
      
      switch(symbol) {
        case 'BTCUSDT':
          price = (28000 + Math.random() * 4000).toFixed(2);
          qty = (0.001 + Math.random() * 0.02).toFixed(6);
          break;
        case 'ETHUSDT':
          price = (1800 + Math.random() * 400).toFixed(2);
          qty = (0.01 + Math.random() * 0.2).toFixed(6);
          break;
        case 'ADAUSDT':
          price = (0.6 + Math.random() * 0.2).toFixed(4);
          qty = (100 + Math.random() * 400).toFixed(2);
          break;
        default:
          price = (10 + Math.random() * 20).toFixed(2);
          qty = (1 + Math.random() * 10).toFixed(2);
      }
      
      const quoteQty = (parseFloat(price) * parseFloat(qty)).toString();
      
      trades.push({
        id: 100000000 + i,
        symbol,
        price,
        qty,
        quoteQty,
        time: timestamp,
        isBuyer,
        isMaker: Math.random() > 0.7,
        isBestMatch: true
      });
    }
    
    return trades;
  }
}

export const binanceApi = new BinanceApi();
export default binanceApi;

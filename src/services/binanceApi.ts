
import { toast } from "@/components/ui/sonner";
import { AccountService } from "./api/accountService";
import { MarketService } from "./api/marketService";
import { TradeService } from "./api/tradeService";
import { loadCredentials, saveCredentials, clearCredentials } from "./api/utils";

// Re-export all types
export type { 
  Asset, 
  AccountInfo, 
  TickerPrice, 
  Order, 
  TradeHistory, 
  OrderRequest 
} from "./api/types";

class BinanceApi {
  private apiKey: string | null = null;
  private apiSecret: string | null = null;
  private accountService: AccountService;
  private marketService: MarketService;
  private tradeService: TradeService;
  
  constructor() {
    // Load API key and secret from localStorage if available
    const credentials = loadCredentials();
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    
    // Initialize services
    this.accountService = new AccountService(this.apiKey, this.apiSecret);
    this.marketService = new MarketService(this.apiKey, this.apiSecret);
    this.tradeService = new TradeService(this.apiKey, this.apiSecret);
  }
  
  setCredentials(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    
    // Save credentials to localStorage
    saveCredentials(apiKey, apiSecret);
    
    // Update services with new credentials
    this.accountService = new AccountService(this.apiKey, this.apiSecret);
    this.marketService = new MarketService(this.apiKey, this.apiSecret);
    this.tradeService = new TradeService(this.apiKey, this.apiSecret);
    
    return this.testConnection();
  }
  
  clearCredentials() {
    this.apiKey = null;
    this.apiSecret = null;
    clearCredentials();
    
    // Reinitialize services with null credentials
    this.accountService = new AccountService(null, null);
    this.marketService = new MarketService(null, null);
    this.tradeService = new TradeService(null, null);
  }
  
  hasCredentials(): boolean {
    return !!(this.apiKey && this.apiSecret);
  }

  // Proxy methods to the services
  
  // Account service methods
  testConnection() {
    return this.accountService.testConnection();
  }
  
  getAccountInfo() {
    return this.accountService.getAccountInfo();
  }
  
  // Market service methods
  getTickerPrice(symbol: string) {
    return this.marketService.getTickerPrice(symbol);
  }
  
  getAllTickerPrices() {
    return this.marketService.getAllTickerPrices();
  }
  
  // Trade service methods
  getOpenOrders() {
    return this.tradeService.getOpenOrders();
  }
  
  createOrder(order: OrderRequest) {
    return this.tradeService.createOrder(order);
  }
  
  getTradeHistory(symbol: string) {
    return this.tradeService.getTradeHistory(symbol);
  }
}

export const binanceApi = new BinanceApi();
export default binanceApi;

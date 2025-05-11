import { toast } from "@/components/ui/sonner";
import { AccountService } from "./api/accountService";
import { MarketService } from "./api/marketService";
import { TradeService } from "./api/tradeService";
import { loadCredentials, saveCredentials, clearCredentials } from "./api/utils";
import { API_CONFIG } from "./api/config";

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
    // Load API key and secret from env vars or localStorage if available
    const credentials = loadCredentials();
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    
    // Initialize services
    this.accountService = new AccountService(this.apiKey, this.apiSecret);
    this.marketService = new MarketService(this.apiKey, this.apiSecret);
    this.tradeService = new TradeService(this.apiKey, this.apiSecret);
  }
  
  setCredentials(apiKey: string, apiSecret: string) {
    // Only set and save credentials if env vars aren't available
    if (!API_CONFIG.binanceApiKey || !API_CONFIG.binanceApiSecret) {
      this.apiKey = apiKey;
      this.apiSecret = apiSecret;
      
      // Save credentials to localStorage as fallback
      saveCredentials(apiKey, apiSecret);
      
      // Update services with new credentials
      this.accountService = new AccountService(this.apiKey, this.apiSecret);
      this.marketService = new MarketService(this.apiKey, this.apiSecret);
      this.tradeService = new TradeService(this.apiKey, this.apiSecret);
    } else {
      // If env vars are available, just use those (already loaded in constructor)
      toast.info("Using API credentials from environment variables");
    }
    
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
  
  createOrder(order: import("./api/types").OrderRequest) {
    return this.tradeService.createOrder(order);
  }
  
  getTradeHistory(symbol: string) {
    return this.tradeService.getTradeHistory(symbol);
  }
}

export const binanceApi = new BinanceApi();
export default binanceApi;

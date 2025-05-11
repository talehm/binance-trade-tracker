
import { toast } from "@/components/ui/sonner";
import { AccountService } from "./api/accountService";
import { MarketService } from "./api/marketService";
import { TradeService } from "./api/tradeService";
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
  private accountService: AccountService;
  private marketService: MarketService;
  private tradeService: TradeService;
  
  constructor() {
    // Initialize services with API keys from environment variables
    this.accountService = new AccountService(API_CONFIG.binanceApiKey, API_CONFIG.binanceApiSecret);
    this.marketService = new MarketService(API_CONFIG.binanceApiKey, API_CONFIG.binanceApiSecret);
    this.tradeService = new TradeService(API_CONFIG.binanceApiKey, API_CONFIG.binanceApiSecret);
  }
  
  hasCredentials(): boolean {
    return !!(API_CONFIG.binanceApiKey && API_CONFIG.binanceApiSecret);
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

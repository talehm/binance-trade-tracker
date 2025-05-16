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
    // Initialize services
    this.accountService = new AccountService();
    this.marketService = new MarketService();
    this.tradeService = new TradeService();
  }
  
  hasCredentials(): boolean {
    // For mock data, always return true
    if (API_CONFIG.useMockData) {
      return true;
    }
    // Otherwise check if backend URL is available
    return API_CONFIG.backendUrl !== '';
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
  
  getPriceHistory(symbol: string, interval?: string, limit?: number) {
    return this.marketService.getPriceHistory(symbol, interval, limit);
  }
  
  getOrderBook(symbol: string, limit?: number) {
    return this.marketService.getOrderBook(symbol, limit);
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

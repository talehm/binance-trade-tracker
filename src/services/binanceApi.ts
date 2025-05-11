
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
    // Initialize services without API keys since they're now handled by the backend
    this.accountService = new AccountService();
    this.marketService = new MarketService();
    this.tradeService = new TradeService();
  }
  
  hasCredentials(): boolean {
    // Check if backend URL is available
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

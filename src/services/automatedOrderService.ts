import { OrderRequest, Order, TradeHistory } from "./api/types";
import binanceApi from "./binanceApi";
import { API_CONFIG } from "./api/config";
import { toast } from "@/components/ui/sonner";

// Constants for order creation
const PRICE_ADJUSTMENT_PERCENTAGE = 10; // 10% lower for buy orders, 10% higher for sell orders
const ORDER_STORAGE_KEY = "automated_orders";

interface StoredOrder {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
  timestamp: number;
  orderId?: number;
  status: "PENDING" | "CREATED" | "EXECUTED" | "FAILED";
}

class AutomatedOrderService {
  private storedOrders: StoredOrder[] = [];
  
  constructor() {
    this.loadStoredOrders();
  }
  
  /**
   * Load previously stored orders from localStorage
   */
  private loadStoredOrders(): void {
    try {
      const savedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
      if (savedOrders) {
        this.storedOrders = JSON.parse(savedOrders);
      } else {
        this.storedOrders = [];
      }
    } catch (error) {
      console.error("Failed to load stored orders:", error);
      this.storedOrders = [];
    }
  }
  
  /**
   * Save orders to localStorage
   */
  private saveStoredOrders(): void {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(this.storedOrders));
    } catch (error) {
      console.error("Failed to save stored orders:", error);
      toast.error("Failed to save order information");
    }
  }
  
  /**
   * Process all supported pairs and create orders as needed
   */
  async processAutomatedOrders(): Promise<void> {
    for (const symbol of API_CONFIG.supportedPairs) {
      try {
        await this.processSymbol(symbol);
      } catch (error) {
        console.error(`Error processing automated orders for ${symbol}:`, error);
      }
    }
  }
  
  /**
   * Process a specific symbol
   */
  private async processSymbol(symbol: string): Promise<void> {
    console.log(`Processing automated orders for ${symbol}...`);
    
    // Get trade history for the symbol
    const tradeHistory = await binanceApi.getTradeHistory(symbol);
    if (!tradeHistory) {
      console.log(`No trade history for ${symbol}, creating initial BUY order`);
      await this.createInitialBuyOrder(symbol);
      return;
    }
    
    // Get open orders for the symbol
    const allOpenOrders = await binanceApi.getOpenOrders();
    const openOrdersForSymbol = allOpenOrders?.filter(order => order.symbol === symbol) || [];
    
    // If there are open orders for this symbol, don't create new ones
    if (openOrdersForSymbol.length > 0) {
      console.log(`There are already open orders for ${symbol}, skipping`);
      return;
    }
    
    // Get stored orders for this symbol
    const storedOrdersForSymbol = this.storedOrders.filter(order => order.symbol === symbol);
    
    // Check last executed order to determine next step
    const lastExecutedOrderForSymbol = storedOrdersForSymbol
      .filter(order => order.status === "EXECUTED")
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (!lastExecutedOrderForSymbol) {
      console.log(`No executed orders for ${symbol}, creating initial BUY order`);
      await this.createInitialBuyOrder(symbol);
      return;
    }
    
    // If last executed order was a BUY, create a SELL order
    if (lastExecutedOrderForSymbol.side === "BUY") {
      console.log(`Last executed order for ${symbol} was a BUY, creating SELL order`);
      await this.createSellOrder(symbol, parseFloat(lastExecutedOrderForSymbol.quantity));
    } 
    // If last executed order was a SELL, create a BUY order
    else {
      console.log(`Last executed order for ${symbol} was a SELL, creating BUY order`);
      await this.createBuyOrder(symbol, parseFloat(lastExecutedOrderForSymbol.quantity));
    }
  }
  
  /**
   * Create an initial BUY order
   */
  private async createInitialBuyOrder(symbol: string): Promise<void> {
    const tickerPrice = await binanceApi.getTickerPrice(symbol);
    if (!tickerPrice) {
      console.error(`Failed to get current price for ${symbol}`);
      return;
    }
    
    const currentPrice = parseFloat(tickerPrice.price);
    const buyPrice = currentPrice * (1 - PRICE_ADJUSTMENT_PERCENTAGE / 100);
    
    // Default quantity based on the symbol
    let quantity = 0.001; // Default for BTC
    if (symbol.includes("ADA")) {
      quantity = 100; // For ADA
    } else if (symbol.includes("ETH")) {
      quantity = 0.1; // For ETH
    }
    
    await this.createBuyOrder(symbol, quantity);
  }
  
  /**
   * Create a BUY order
   */
  private async createBuyOrder(symbol: string, quantity: number): Promise<void> {
    const tickerPrice = await binanceApi.getTickerPrice(symbol);
    if (!tickerPrice) {
      console.error(`Failed to get current price for ${symbol}`);
      return;
    }
    
    const currentPrice = parseFloat(tickerPrice.price);
    const buyPrice = currentPrice * (1 - PRICE_ADJUSTMENT_PERCENTAGE / 100);
    
    const orderRequest: OrderRequest = {
      symbol: symbol,
      side: "BUY",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: quantity,
      price: buyPrice
    };
    
    // Create a stored order record
    const storedOrder: StoredOrder = {
      id: `${symbol}-BUY-${Date.now()}`,
      symbol: symbol,
      side: "BUY",
      price: buyPrice.toString(),
      quantity: quantity.toString(),
      timestamp: Date.now(),
      status: "PENDING"
    };
    
    try {
      // Create the order
      const order = await binanceApi.createOrder(orderRequest);
      
      if (order) {
        // Update the stored order with the order ID
        storedOrder.orderId = order.orderId;
        storedOrder.status = "CREATED";
        toast.success(`Created BUY order for ${symbol} at ${buyPrice.toFixed(2)}`);
      } else {
        storedOrder.status = "FAILED";
        toast.error(`Failed to create BUY order for ${symbol}`);
      }
    } catch (error) {
      console.error(`Error creating BUY order for ${symbol}:`, error);
      storedOrder.status = "FAILED";
    }
    
    // Store the order
    this.storedOrders.push(storedOrder);
    this.saveStoredOrders();
  }
  
  /**
   * Create a SELL order
   */
  private async createSellOrder(symbol: string, quantity: number): Promise<void> {
    const tickerPrice = await binanceApi.getTickerPrice(symbol);
    if (!tickerPrice) {
      console.error(`Failed to get current price for ${symbol}`);
      return;
    }
    
    const currentPrice = parseFloat(tickerPrice.price);
    const sellPrice = currentPrice * (1 + PRICE_ADJUSTMENT_PERCENTAGE / 100);
    
    const orderRequest: OrderRequest = {
      symbol: symbol,
      side: "SELL",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: quantity,
      price: sellPrice
    };
    
    // Create a stored order record
    const storedOrder: StoredOrder = {
      id: `${symbol}-SELL-${Date.now()}`,
      symbol: symbol,
      side: "SELL",
      price: sellPrice.toString(),
      quantity: quantity.toString(),
      timestamp: Date.now(),
      status: "PENDING"
    };
    
    try {
      // Create the order
      const order = await binanceApi.createOrder(orderRequest);
      
      if (order) {
        // Update the stored order with the order ID
        storedOrder.orderId = order.orderId;
        storedOrder.status = "CREATED";
        toast.success(`Created SELL order for ${symbol} at ${sellPrice.toFixed(2)}`);
      } else {
        storedOrder.status = "FAILED";
        toast.error(`Failed to create SELL order for ${symbol}`);
      }
    } catch (error) {
      console.error(`Error creating SELL order for ${symbol}:`, error);
      storedOrder.status = "FAILED";
    }
    
    // Store the order
    this.storedOrders.push(storedOrder);
    this.saveStoredOrders();
  }
  
  /**
   * Update status of existing orders
   */
  async updateOrderStatus(): Promise<void> {
    // Get all open orders
    const openOrders = await binanceApi.getOpenOrders();
    if (!openOrders) {
      return;
    }
    
    // For each supported symbol
    for (const symbol of API_CONFIG.supportedPairs) {
      // Get trade history for the symbol
      const tradeHistory = await binanceApi.getTradeHistory(symbol);
      if (!tradeHistory) {
        continue;
      }
      
      // Get stored orders for this symbol that are not yet executed
      const pendingStoredOrders = this.storedOrders.filter(
        order => order.symbol === symbol && 
        order.status === "CREATED" && 
        order.orderId !== undefined
      );
      
      // Check if any of these orders have been executed
      for (const storedOrder of pendingStoredOrders) {
        // Check if order is still open
        const isStillOpen = openOrders.some(order => order.orderId === storedOrder.orderId);
        
        if (!isStillOpen) {
          // Check if it's in the trade history
          const matchingTrade = tradeHistory.find(
            trade => parseFloat(trade.price).toFixed(2) === parseFloat(storedOrder.price).toFixed(2)
          );
          
          if (matchingTrade) {
            // Order has been executed
            console.log(`Order ${storedOrder.id} (${storedOrder.symbol} ${storedOrder.side}) has been executed`);
            storedOrder.status = "EXECUTED";
            storedOrder.timestamp = Date.now();
            
            // Create the opposite order
            if (storedOrder.side === "BUY") {
              await this.createSellOrder(
                storedOrder.symbol, 
                parseFloat(storedOrder.quantity)
              );
            } else {
              await this.createBuyOrder(
                storedOrder.symbol, 
                parseFloat(storedOrder.quantity)
              );
            }
          }
        }
      }
    }
    
    // Save updated stored orders
    this.saveStoredOrders();
  }
}

// Export a singleton instance
export const automatedOrderService = new AutomatedOrderService();
export default automatedOrderService;


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";
import binanceApi, { 
  AccountInfo, 
  Asset, 
  Order, 
  OrderRequest, 
  TickerPrice, 
  TradeHistory 
} from '@/services/binanceApi';

interface TradingContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  accountInfo: AccountInfo | null;
  assetPrices: Map<string, string>;
  openOrders: Order[] | null;
  selectedAsset: string | null;
  tradeHistory: Map<string, TradeHistory[]>;
  authenticate: (apiKey: string, apiSecret: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
  selectAsset: (asset: string) => void;
  createOrder: (order: OrderRequest) => Promise<Order | null>;
  getAssetTradeHistory: (symbol: string) => Promise<TradeHistory[] | null>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [assetPrices, setAssetPrices] = useState<Map<string, string>>(new Map());
  const [openOrders, setOpenOrders] = useState<Order[] | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Map<string, TradeHistory[]>>(new Map());
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (binanceApi.hasCredentials()) {
        setIsLoading(true);
        const isConnected = await binanceApi.testConnection();
        setIsAuthenticated(isConnected);
        
        if (isConnected) {
          await refreshData();
        }
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Set up price refresh interval
  useEffect(() => {
    if (isAuthenticated && accountInfo) {
      const intervalId = setInterval(() => {
        refreshPrices();
      }, 10000); // Refresh every 10 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, accountInfo]);
  
  const authenticate = async (apiKey: string, apiSecret: string) => {
    setIsLoading(true);
    try {
      const isConnected = await binanceApi.setCredentials(apiKey, apiSecret);
      setIsAuthenticated(isConnected);
      
      if (isConnected) {
        await refreshData();
        toast.success('Successfully connected to Binance');
      }
      
      return isConnected;
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Failed to authenticate with Binance');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    binanceApi.clearCredentials();
    setIsAuthenticated(false);
    setAccountInfo(null);
    setAssetPrices(new Map());
    setOpenOrders(null);
    setSelectedAsset(null);
    setTradeHistory(new Map());
    toast.info('Logged out from Binance');
  };
  
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Load account info
      const account = await binanceApi.getAccountInfo();
      if (account) {
        setAccountInfo(account);
        
        // Set default selected asset if not already set
        if (!selectedAsset && account.balances.length > 0) {
          const nonZeroBalances = account.balances.filter(
            asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0
          );
          
          if (nonZeroBalances.length > 0) {
            setSelectedAsset(nonZeroBalances[0].asset);
          }
        }
      }
      
      // Load prices
      await refreshPrices();
      
      // Load open orders
      const orders = await binanceApi.getOpenOrders();
      if (orders) {
        setOpenOrders(orders);
      }
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to load trading data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshPrices = async () => {
    try {
      const allPrices = await binanceApi.getAllTickerPrices();
      if (allPrices) {
        const pricesMap = new Map<string, string>();
        allPrices.forEach(ticker => {
          pricesMap.set(ticker.symbol, ticker.price);
        });
        setAssetPrices(pricesMap);
      }
    } catch (error) {
      console.error('Error refreshing prices:', error);
    }
  };
  
  const selectAsset = (asset: string) => {
    setSelectedAsset(asset);
    
    // Load trade history for this asset if we don't already have it
    if (!tradeHistory.has(`${asset}USDT`)) {
      getAssetTradeHistory(`${asset}USDT`);
    }
  };
  
  const createOrder = async (order: OrderRequest) => {
    setIsLoading(true);
    try {
      const newOrder = await binanceApi.createOrder(order);
      if (newOrder) {
        // Refresh open orders
        const orders = await binanceApi.getOpenOrders();
        if (orders) {
          setOpenOrders(orders);
        }
      }
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAssetTradeHistory = async (symbol: string) => {
    try {
      const history = await binanceApi.getTradeHistory(symbol);
      if (history) {
        setTradeHistory(prev => new Map(prev).set(symbol, history));
      }
      return history;
    } catch (error) {
      console.error(`Error loading trade history for ${symbol}:`, error);
      toast.error(`Failed to load trade history for ${symbol}`);
      return null;
    }
  };
  
  const value = {
    isLoading,
    isAuthenticated,
    accountInfo,
    assetPrices,
    openOrders,
    selectedAsset,
    tradeHistory,
    authenticate,
    logout,
    refreshData,
    selectAsset,
    createOrder,
    getAssetTradeHistory
  };
  
  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}

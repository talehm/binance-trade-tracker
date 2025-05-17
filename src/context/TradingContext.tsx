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
import { API_CONFIG } from '@/services/api/config';
import automatedOrderService from '@/services/automatedOrderService';

interface TradingContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  accountInfo: AccountInfo | null;
  assetPrices: Map<string, string>;
  openOrders: Order[] | null;
  selectedAsset: string | null;
  tradeHistory: Map<string, TradeHistory[]>;
  isSimulationMode: boolean;
  toggleSimulationMode: () => void;
  refreshData: () => Promise<void>;
  selectAsset: (asset: string) => void;
  createOrder: (order: OrderRequest) => Promise<Order | null>;
  getAssetTradeHistory: (symbol: string) => Promise<TradeHistory[] | null>;
  processAutomatedOrders: () => Promise<void>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Supported pairs
const SUPPORTED_PAIRS = API_CONFIG.supportedPairs;
const SUPPORTED_ASSETS = SUPPORTED_PAIRS.map(pair => pair.replace('EUR', ''));

// Get simulation mode from localStorage or default to true
const getInitialSimulationMode = (): boolean => {
  const saved = localStorage.getItem('simulationMode');
  return saved !== null ? JSON.parse(saved) : true;
};

export function TradingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [assetPrices, setAssetPrices] = useState<Map<string, string>>(new Map());
  const [openOrders, setOpenOrders] = useState<Order[] | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Map<string, TradeHistory[]>>(new Map());
  const [isSimulationMode, setIsSimulationMode] = useState(getInitialSimulationMode);
  
  // Update API_CONFIG when simulation mode changes
  useEffect(() => {
    API_CONFIG.useMockData = isSimulationMode;
    
    // Save to localStorage
    localStorage.setItem('simulationMode', JSON.stringify(isSimulationMode));
    
    // Refresh data when simulation mode changes
    refreshData();
    
    // Show toast message
    if (isSimulationMode) {
      toast.success('Switched to simulation mode');
    } else {
      toast.success('Switched to real API mode');
    }
  }, [isSimulationMode]);
  
  // Toggle simulation mode
  const toggleSimulationMode = () => {
    setIsSimulationMode(prev => !prev);
  };
  
  // Check if API credentials are available
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        if (binanceApi.hasCredentials()) {
          const isConnected = await binanceApi.testConnection();
          setIsAuthenticated(isConnected);
          
          if (isConnected) {
            await refreshData();
            toast.success('Successfully connected to Binance API');
            
            // Process automated orders on initial load
            await processAutomatedOrders();
          } else {
            toast.error('Could not connect to Binance API. Please check your API keys in the environment variables.');
          }
        } else {
          toast.error('No API credentials found. Please set VITE_BINANCE_API_KEY and VITE_BINANCE_API_SECRET in your .env file.');
        }
      } catch (error) {
        console.error('Connection error:', error);
        toast.error('Failed to connect to Binance API');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);
  
  // Set up price refresh interval
  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        refreshPrices();
      }, 10000); // Refresh every 10 seconds
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isAuthenticated]);
  
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Load account info
      const account = await binanceApi.getAccountInfo();
      if (account) {
        // Filter account balances to only include supported assets
        account.balances = account.balances.filter(asset => 
          SUPPORTED_ASSETS.includes(asset.asset)
        );
        
        setAccountInfo(account);
        
        // Set default selected asset if not already set
        if (!selectedAsset && account.balances.length > 0) {
          const supportedBalances = account.balances.filter(
            asset => SUPPORTED_ASSETS.includes(asset.asset) && 
            (parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0)
          );
          
          if (supportedBalances.length > 0) {
            setSelectedAsset(supportedBalances[0].asset);
          } else if (account.balances.length > 0) {
            setSelectedAsset(SUPPORTED_ASSETS[0]);
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
    if (!SUPPORTED_ASSETS.includes(asset)) {
      toast.error(`Asset ${asset} is not supported. Only ${SUPPORTED_ASSETS.join(', ')} are supported.`);
      return;
    }
    
    setSelectedAsset(asset);
    
    // Load trade history for this asset if we don't already have it
    const symbol = `${asset}EUR`;
    if (!tradeHistory.has(symbol)) {
      getAssetTradeHistory(symbol);
    }
  };
  
  const createOrder = async (order: OrderRequest) => {
    setIsLoading(true);
    try {
      if (!SUPPORTED_ASSETS.includes(order.symbol.replace('EUR', ''))) {
        toast.error(`Symbol ${order.symbol} is not supported. Only ${SUPPORTED_PAIRS.join(', ')} are supported.`);
        return null;
      }
      
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
      if (!SUPPORTED_PAIRS.includes(symbol)) {
        toast.error(`Symbol ${symbol} is not supported. Only ${SUPPORTED_PAIRS.join(', ')} are supported.`);
        return null;
      }
      
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
  
  const processAutomatedOrders = async () => {
    try {
      // First update status of existing orders
      await automatedOrderService.updateOrderStatus();
      
      // Then process new automated orders
      await automatedOrderService.processAutomatedOrders();
      
      // Refresh data to show new orders
      await refreshData();
      
      return true;
    } catch (error) {
      console.error('Error processing automated orders:', error);
      throw error; // Re-throw the error so component can handle it
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
    isSimulationMode,
    toggleSimulationMode,
    refreshData,
    selectAsset,
    createOrder,
    getAssetTradeHistory,
    processAutomatedOrders
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

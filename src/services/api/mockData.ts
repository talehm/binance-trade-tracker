
// This file is kept for backward compatibility but all mock data has been moved to the mockData folder
// Import mock data from the new location
import { mockAccountInfo } from './mockData/accountMock';
import { mockTickerPrices, mockPriceHistory, mockOrderBook } from './mockData/marketMock';
import { mockOpenOrders, mockTradeHistory, mockCreateOrderResponse } from './mockData/tradeMock';

// Re-export all mock data
export {
  mockAccountInfo,
  mockTickerPrices,
  mockPriceHistory,
  mockOrderBook,
  mockOpenOrders,
  mockTradeHistory,
  mockCreateOrderResponse
};

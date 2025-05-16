
/**
 * Mock data for the Binance trading application
 * This data is used when the API connection is not available
 */

import { AccountInfo, Asset, TickerPrice, Order, TradeHistory } from "./types";

// Mock account info
export const mockAccountInfo: AccountInfo = {
  makerCommission: 10,
  takerCommission: 10,
  buyerCommission: 0,
  sellerCommission: 0,
  canTrade: true,
  canWithdraw: true,
  canDeposit: true,
  updateTime: Date.now() - 5000,
  accountType: "SPOT",
  balances: [
    {
      asset: "BTC",
      free: "0.00123456",
      locked: "0.00000500",
      freeze: "0",
      withdrawing: "0",
      ipoable: "0",
      btcValuation: "1.0"
    },
    {
      asset: "ADA",
      free: "150.5",
      locked: "25.0",
      freeze: "0",
      withdrawing: "0",
      ipoable: "0",
      btcValuation: "0.00005"
    }
  ],
  permissions: ["SPOT"]
};

// Mock ticker prices
export const mockTickerPrices: TickerPrice[] = [
  {
    symbol: "BTCEUR",
    price: "51245.67"
  },
  {
    symbol: "ADAEUR",
    price: "0.3954"
  }
];

// Mock open orders
export const mockOpenOrders: Order[] = [
  {
    symbol: "BTCEUR",
    orderId: 12345678,
    orderListId: -1,
    clientOrderId: "xc3df456zaq1",
    price: "49000.00",
    origQty: "0.005",
    executedQty: "0.000",
    cummulativeQuoteQty: "0.00",
    status: "NEW",
    timeInForce: "GTC",
    type: "LIMIT",
    side: "BUY",
    stopPrice: "0.0",
    icebergQty: "0.0",
    time: Date.now() - 3600000, // 1 hour ago
    updateTime: Date.now() - 1800000, // 30 min ago
    isWorking: true,
    origQuoteOrderQty: "0.0"
  },
  {
    symbol: "ADAEUR",
    orderId: 87654321,
    orderListId: -1,
    clientOrderId: "87yuj4rf3aq2",
    price: "0.3500",
    origQty: "100.00",
    executedQty: "0.00",
    cummulativeQuoteQty: "0.00",
    status: "NEW",
    timeInForce: "GTC",
    type: "LIMIT",
    side: "BUY",
    stopPrice: "0.0",
    icebergQty: "0.0",
    time: Date.now() - 7200000, // 2 hours ago
    updateTime: Date.now() - 3600000, // 1 hour ago
    isWorking: true,
    origQuoteOrderQty: "0.0"
  }
];

// Mock trade history
export const mockTradeHistory: Record<string, TradeHistory[]> = {
  "BTCEUR": [
    {
      id: 123456,
      symbol: "BTCEUR",
      price: "50123.45",
      qty: "0.002",
      quoteQty: "100.25",
      time: Date.now() - 86400000 * 2, // 2 days ago
      isBuyer: true,
      isMaker: false,
      isBestMatch: true
    },
    {
      id: 123457,
      symbol: "BTCEUR",
      price: "51045.30",
      qty: "0.001",
      quoteQty: "51.05",
      time: Date.now() - 86400000 * 5, // 5 days ago
      isBuyer: false,
      isMaker: true,
      isBestMatch: true
    }
  ],
  "ADAEUR": [
    {
      id: 345678,
      symbol: "ADAEUR",
      price: "0.4123",
      qty: "100",
      quoteQty: "41.23",
      time: Date.now() - 86400000 * 1, // 1 day ago
      isBuyer: true,
      isMaker: false,
      isBestMatch: true
    },
    {
      id: 345679,
      symbol: "ADAEUR",
      price: "0.3987",
      qty: "50",
      quoteQty: "19.94",
      time: Date.now() - 86400000 * 3, // 3 days ago
      isBuyer: false,
      isMaker: true,
      isBestMatch: true
    }
  ]
};

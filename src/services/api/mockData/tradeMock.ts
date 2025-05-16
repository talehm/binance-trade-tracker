
import { Order, TradeHistory } from "../types";

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
  },
  {
    symbol: "ETHEUR",
    orderId: 23456789,
    orderListId: -1,
    clientOrderId: "eth45rfvbn78",
    price: "2200.00",
    origQty: "0.25",
    executedQty: "0.00",
    cummulativeQuoteQty: "0.00",
    status: "NEW",
    timeInForce: "GTC",
    type: "LIMIT",
    side: "BUY",
    stopPrice: "0.0",
    icebergQty: "0.0",
    time: Date.now() - 14400000, // 4 hours ago
    updateTime: Date.now() - 7200000, // 2 hours ago
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
    },
    {
      id: 123458,
      symbol: "BTCEUR",
      price: "50845.20",
      qty: "0.003",
      quoteQty: "152.54",
      time: Date.now() - 86400000 * 7, // 7 days ago
      isBuyer: true,
      isMaker: false,
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
    },
    {
      id: 345680,
      symbol: "ADAEUR",
      price: "0.4056",
      qty: "75",
      quoteQty: "30.42",
      time: Date.now() - 86400000 * 6, // 6 days ago
      isBuyer: true,
      isMaker: false,
      isBestMatch: true
    }
  ],
  "ETHEUR": [
    {
      id: 567890,
      symbol: "ETHEUR",
      price: "2320.45",
      qty: "0.5",
      quoteQty: "1160.23",
      time: Date.now() - 86400000 * 1, // 1 day ago
      isBuyer: true,
      isMaker: false,
      isBestMatch: true
    },
    {
      id: 567891,
      symbol: "ETHEUR",
      price: "2290.30",
      qty: "0.25",
      quoteQty: "572.58",
      time: Date.now() - 86400000 * 4, // 4 days ago
      isBuyer: false,
      isMaker: true,
      isBestMatch: true
    }
  ]
};

// Mock order response
export const mockCreateOrderResponse = (orderRequest: any): Order => {
  return {
    symbol: orderRequest.symbol,
    orderId: Math.floor(Math.random() * 10000000),
    orderListId: -1,
    clientOrderId: `mock-${Date.now()}`,
    price: orderRequest.price?.toString() || "0",
    origQty: orderRequest.quantity.toString(),
    executedQty: "0",
    cummulativeQuoteQty: "0",
    status: "NEW",
    timeInForce: orderRequest.timeInForce || "GTC",
    type: orderRequest.type,
    side: orderRequest.side,
    stopPrice: orderRequest.stopPrice?.toString() || "0",
    icebergQty: orderRequest.icebergQty?.toString() || "0",
    time: Date.now(),
    updateTime: Date.now(),
    isWorking: true,
    origQuoteOrderQty: "0"
  };
};


import { TickerPrice } from "../types";

// Mock ticker prices
export const mockTickerPrices: TickerPrice[] = [
  {
    symbol: "BTCEUR",
    price: "51245.67"
  },
  {
    symbol: "ADAEUR",
    price: "0.3954"
  },
  {
    symbol: "ETHEUR",
    price: "2342.18"
  }
];

// Mock price history for charts
export const mockPriceHistory = {
  "BTCEUR": [
    { timestamp: Date.now() - 86400000 * 30, price: 48500.25 },
    { timestamp: Date.now() - 86400000 * 25, price: 49200.50 },
    { timestamp: Date.now() - 86400000 * 20, price: 50100.75 },
    { timestamp: Date.now() - 86400000 * 15, price: 49800.30 },
    { timestamp: Date.now() - 86400000 * 10, price: 50500.10 },
    { timestamp: Date.now() - 86400000 * 5, price: 51000.25 },
    { timestamp: Date.now(), price: 51245.67 }
  ],
  "ADAEUR": [
    { timestamp: Date.now() - 86400000 * 30, price: 0.3654 },
    { timestamp: Date.now() - 86400000 * 25, price: 0.3754 },
    { timestamp: Date.now() - 86400000 * 20, price: 0.3854 },
    { timestamp: Date.now() - 86400000 * 15, price: 0.3754 },
    { timestamp: Date.now() - 86400000 * 10, price: 0.3854 },
    { timestamp: Date.now() - 86400000 * 5, price: 0.3904 },
    { timestamp: Date.now(), price: 0.3954 }
  ],
  "ETHEUR": [
    { timestamp: Date.now() - 86400000 * 30, price: 2105.45 },
    { timestamp: Date.now() - 86400000 * 25, price: 2156.23 },
    { timestamp: Date.now() - 86400000 * 20, price: 2210.58 },
    { timestamp: Date.now() - 86400000 * 15, price: 2184.30 },
    { timestamp: Date.now() - 86400000 * 10, price: 2251.47 },
    { timestamp: Date.now() - 86400000 * 5, price: 2310.85 },
    { timestamp: Date.now(), price: 2342.18 }
  ]
};

// Mock market depth (order book)
export const mockOrderBook = {
  "BTCEUR": {
    bids: [
      [51200.25, 0.25],
      [51150.50, 0.5],
      [51100.75, 0.75],
      [51050.30, 1.0],
      [51000.10, 1.5]
    ],
    asks: [
      [51300.25, 0.2],
      [51350.50, 0.4],
      [51400.75, 0.6],
      [51450.30, 0.8],
      [51500.10, 1.0]
    ]
  },
  "ADAEUR": {
    bids: [
      [0.3950, 1000],
      [0.3940, 2000],
      [0.3930, 3000],
      [0.3920, 4000],
      [0.3910, 5000]
    ],
    asks: [
      [0.3960, 1000],
      [0.3970, 2000],
      [0.3980, 3000],
      [0.3990, 4000],
      [0.4000, 5000]
    ]
  },
  "ETHEUR": {
    bids: [
      [2340.00, 2.5],
      [2335.00, 3.0],
      [2330.00, 3.5],
      [2325.00, 4.0],
      [2320.00, 4.5]
    ],
    asks: [
      [2345.00, 2.0],
      [2350.00, 2.5],
      [2355.00, 3.0],
      [2360.00, 3.5],
      [2365.00, 4.0]
    ]
  }
};

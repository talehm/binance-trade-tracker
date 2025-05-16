
import { AccountInfo } from "../types";

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
    },
    {
      asset: "ETH",
      free: "1.25",
      locked: "0.5",
      freeze: "0",
      withdrawing: "0",
      ipoable: "0",
      btcValuation: "0.07"
    },
    {
      asset: "EUR",
      free: "2500.00",
      locked: "0.00",
      freeze: "0",
      withdrawing: "0",
      ipoable: "0",
      btcValuation: "0"
    }
  ],
  permissions: ["SPOT"]
};

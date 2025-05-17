
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from '@/services/api/config';

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

interface ProfitData {
  symbol: string;
  totalBought: number;
  totalSold: number;
  totalProfit: number;
  trades: number;
}

const AutomatedOrderStats = () => {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [profitData, setProfitData] = useState<Record<string, ProfitData>>({});
  const [totalProfit, setTotalProfit] = useState(0);
  
  // Load orders from localStorage and calculate profits
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('automated_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        
        // Calculate profit for each symbol
        const profits: Record<string, ProfitData> = {};
        let overallProfit = 0;
        
        // Only look at executed orders
        const executedOrders = parsedOrders.filter((order: StoredOrder) => order.status === "EXECUTED");
        
        // Group orders by symbol and calculate profits
        for (const order of executedOrders) {
          if (!profits[order.symbol]) {
            profits[order.symbol] = {
              symbol: order.symbol,
              totalBought: 0,
              totalSold: 0,
              totalProfit: 0,
              trades: 0
            };
          }
          
          const value = parseFloat(order.price) * parseFloat(order.quantity);
          
          if (order.side === "BUY") {
            profits[order.symbol].totalBought += value;
          } else if (order.side === "SELL") {
            profits[order.symbol].totalSold += value;
          }
          
          profits[order.symbol].trades++;
        }
        
        // Calculate total profit for each symbol
        for (const symbol in profits) {
          profits[symbol].totalProfit = profits[symbol].totalSold - profits[symbol].totalBought;
          overallProfit += profits[symbol].totalProfit;
        }
        
        setProfitData(profits);
        setTotalProfit(overallProfit);
      }
    } catch (error) {
      console.error('Failed to calculate profits:', error);
    }
  }, [orders]);
  
  // Get all the symbols we trade
  const symbols = API_CONFIG.supportedPairs;
  
  // Count orders by status
  const pendingOrders = orders.filter(order => order.status === "PENDING").length;
  const createdOrders = orders.filter(order => order.status === "CREATED").length;
  const executedOrders = orders.filter(order => order.status === "EXECUTED").length;
  const failedOrders = orders.filter(order => order.status === "FAILED").length;
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            €{totalProfit.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalProfit >= 0 ? 'Overall profit' : 'Overall loss'} from all automated trades
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{executedOrders}</div>
              <p className="text-xs text-muted-foreground">Executed</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{createdOrders}</div>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{failedOrders}</div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Asset Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.values(profitData).map((data) => (
              <div key={data.symbol} className="flex justify-between items-center">
                <span className="font-medium">{data.symbol.replace('EUR', '')}</span>
                <span className={data.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                  €{data.totalProfit.toFixed(2)}
                </span>
              </div>
            ))}
            {Object.keys(profitData).length === 0 && (
              <p className="text-xs text-muted-foreground">No completed trades yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AutomatedOrderStats;

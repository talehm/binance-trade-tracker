
import { useTrading } from '@/context/TradingContext';
import AssetTable from '@/components/AssetTable';
import OpenOrdersTable from '@/components/OpenOrdersTable';
import PriceChart from '@/components/PriceChart';
import TradeHistory from '@/components/TradeHistory';
import CreateOrderForm from '@/components/CreateOrderForm';
import { Button } from '@/components/ui/button';
import { Settings, History, Wallet, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { logout, refreshData, selectedAsset, isLoading } = useTrading();
  
  const handleRefresh = () => {
    refreshData();
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <Wallet className="mr-2 h-8 w-8 text-binance" /> Binance Trading Dashboard
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </div>
      
      <AssetTable />
      
      {selectedAsset && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PriceChart symbol={`${selectedAsset}USDT`} />
          </div>
          <div>
            <CreateOrderForm />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Open Orders</h2>
          </div>
          <OpenOrdersTable />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <History className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Trade History</h2>
          </div>
          <TradeHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

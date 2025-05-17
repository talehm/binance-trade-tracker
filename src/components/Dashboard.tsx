
import { useTrading } from "@/context/TradingContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetTable from "./AssetTable";
import PriceChart from "./PriceChart";
import CreateOrderForm from "./CreateOrderForm";
import OpenOrdersTable from "./OpenOrdersTable";
import TradeHistory from "./TradeHistory";
import AutomatedOrdersControl from "./AutomatedOrdersControl";

const Dashboard = () => {
  // Use the trading context
  const { selectedAsset } = useTrading();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crypto Trading Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <AssetTable />
        </div>
        <div>
          <AutomatedOrdersControl />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <PriceChart />
        </div>
        <div>
          <CreateOrderForm />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <OpenOrdersTable />
        </div>
        <div>
          <TradeHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

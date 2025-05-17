
import { useTrading } from "@/context/TradingContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AssetTable from "./AssetTable";
import PriceChart from "./PriceChart";
import CreateOrderForm from "./CreateOrderForm";
import OpenOrdersTable from "./OpenOrdersTable";
import TradeHistory from "./TradeHistory";
import AutomatedOrdersControl from "./AutomatedOrdersControl";
import SimulationToggle from "./SimulationToggle";

const Dashboard = () => {
  // Use the trading context
  const { selectedAsset } = useTrading();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Trading Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/automated-orders">Automated Orders</Link>
          </Button>
          <SimulationToggle />
        </div>
      </div>
      
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

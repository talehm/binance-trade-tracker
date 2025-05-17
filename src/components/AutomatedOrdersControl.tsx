
import { Button } from "@/components/ui/button";
import { useTrading } from "@/context/TradingContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const AutomatedOrdersControl = () => {
  const { processAutomatedOrders, isLoading, isSimulationMode } = useTrading();
  const [lastProcessed, setLastProcessed] = useState<Date | null>(null);
  
  const handleProcessOrders = async () => {
    await processAutomatedOrders();
    setLastProcessed(new Date());
  };
  
  return (
    <div className="crypto-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Automated Orders</h2>
        {isSimulationMode && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Simulation
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground mb-4">
        Process orders automatically based on trade history. System will create BUY orders at 10% below current price,
        and SELL orders at 10% above current price after a BUY order is executed.
      </p>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleProcessOrders} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Process Automated Orders'}
        </Button>
        
        {lastProcessed && (
          <p className="text-xs text-muted-foreground text-center">
            Last processed: {lastProcessed.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default AutomatedOrdersControl;

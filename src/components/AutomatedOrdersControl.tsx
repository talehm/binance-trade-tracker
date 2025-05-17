
import { Button } from "@/components/ui/button";
import { useTrading } from "@/context/TradingContext";
import { useState } from "react";

const AutomatedOrdersControl = () => {
  const { processAutomatedOrders, isLoading } = useTrading();
  const [lastProcessed, setLastProcessed] = useState<Date | null>(null);
  
  const handleProcessOrders = async () => {
    await processAutomatedOrders();
    setLastProcessed(new Date());
  };
  
  return (
    <div className="crypto-card">
      <h2 className="text-xl font-semibold mb-4">Automated Orders</h2>
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

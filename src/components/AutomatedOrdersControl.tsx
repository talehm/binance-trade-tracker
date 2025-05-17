
import { Button } from "@/components/ui/button";
import { useTrading } from "@/context/TradingContext";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const AutomatedOrdersControl = () => {
  const { processAutomatedOrders, isLoading, isSimulationMode } = useTrading();
  const [lastProcessed, setLastProcessed] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const COOLDOWN_TIME = 10000; // 10 seconds cooldown
  
  // Reset cooldown when component mounts or unmounts
  useEffect(() => {
    return () => setCooldownActive(false);
  }, []);
  
  const handleProcessOrders = async () => {
    if (cooldownActive || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setCooldownActive(true);
      
      // Process orders
      await processAutomatedOrders();
      
      // Update last processed time
      const now = new Date();
      setLastProcessed(now);
      
      toast.success("Automated orders processed successfully");
      
      // Set cooldown timer
      setTimeout(() => {
        setCooldownActive(false);
      }, COOLDOWN_TIME);
      
    } catch (error) {
      toast.error("Failed to process automated orders");
      console.error("Error processing orders:", error);
    } finally {
      setIsProcessing(false);
    }
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
          disabled={isLoading || cooldownActive || isProcessing}
          className="w-full"
        >
          {isLoading || isProcessing ? 'Processing...' : cooldownActive ? 'Cooldown...' : 'Process Automated Orders'}
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

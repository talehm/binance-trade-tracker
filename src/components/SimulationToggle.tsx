
import { useTrading } from "@/context/TradingContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleRight } from "lucide-react";
import { useState, useEffect } from "react";

const SimulationToggle = () => {
  const { isSimulationMode, toggleSimulationMode } = useTrading();
  const [mounted, setMounted] = useState(false);
  
  // Only show the toggle after the component has mounted
  // This prevents hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="simulation-mode" className="text-sm font-medium">
        <div className="flex items-center">
          <ToggleRight className="mr-1" />
          Simulation Mode
        </div>
      </Label>
      <Switch
        id="simulation-mode"
        checked={isSimulationMode}
        onCheckedChange={toggleSimulationMode}
      />
    </div>
  );
};

export default SimulationToggle;


import { useTrading } from '@/context/TradingContext';
import Dashboard from '@/components/Dashboard';
import { API_CONFIG } from '@/services/api/config';

const Index = () => {
  const { isAuthenticated, isLoading } = useTrading();

  // No credentials provided message
  const NoCredentials = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">API Credentials Missing</h2>
        <p className="text-muted-foreground mb-4">
          No Binance API credentials found. Please set the following environment variables:
        </p>
        <div className="bg-muted p-3 rounded-md text-left mb-4">
          <code>VITE_BINANCE_API_KEY=your_api_key</code><br />
          <code>VITE_BINANCE_API_SECRET=your_api_secret</code>
        </div>
        <p className="text-sm text-muted-foreground">
          Restart the application after setting these variables.
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-bold mb-4">Connecting to Binance...</h2>
            <p className="text-muted-foreground">Please wait while we establish a connection.</p>
          </div>
        </div>
      )}
      
      {!isLoading && !isAuthenticated && !API_CONFIG.binanceApiKey && (
        <NoCredentials />
      )}
      
      {!isLoading && isAuthenticated && (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;

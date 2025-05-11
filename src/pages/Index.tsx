
import { useTrading } from '@/context/TradingContext';
import Dashboard from '@/components/Dashboard';
import AuthForm from '@/components/AuthForm';

const Index = () => {
  const { isAuthenticated, isLoading } = useTrading();

  return (
    <div className="container mx-auto py-8 px-4">
      {isLoading && !isAuthenticated && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-bold mb-4">Connecting to Binance...</h2>
            <p className="text-muted-foreground">Please wait while we establish a connection.</p>
          </div>
        </div>
      )}
      
      {!isLoading && !isAuthenticated && (
        <div className="max-w-md mx-auto py-12">
          <AuthForm />
        </div>
      )}
      
      {isAuthenticated && (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;

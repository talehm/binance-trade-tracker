
import { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AuthForm = () => {
  const { authenticate, isLoading } = useTrading();
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect to Binance</CardTitle>
        <CardDescription>
          Connect to your Binance account using the server's configured API keys.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect to Binance'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-muted-foreground">
        <p>API keys are securely stored on the server.</p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;

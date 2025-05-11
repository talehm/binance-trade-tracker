
import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Lock, LogIn } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AuthForm: React.FC = () => {
  const { authenticate, isLoading } = useTrading();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast.error("Please enter both API Key and Secret");
      return;
    }
    
    const success = await authenticate(apiKey, apiSecret);
    
    if (!success) {
      toast.error("Failed to authenticate. Please check your credentials.");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold">
          <LogIn className="mr-2" /> Connect to Binance
        </CardTitle>
        <CardDescription>
          Enter your Binance API credentials to access your trading account.
          Please ensure your API key has the necessary permissions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="apiKey">
              API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-10"
                placeholder="Enter your Binance API Key"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="apiSecret">
              API Secret
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="apiSecret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="pl-10"
                placeholder="Enter your Binance API Secret"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connecting..." : "Connect to Binance"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;

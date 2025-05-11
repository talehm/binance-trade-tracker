
import { useState, useEffect } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const CreateOrderForm = () => {
  const { selectedAsset, assetPrices, createOrder, accountInfo } = useTrading();
  
  const [selectedTab, setSelectedTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('LIMIT');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [targetPercent, setTargetPercent] = useState('');
  const [usePercentTarget, setUsePercentTarget] = useState(true);
  
  // When selected asset changes, update price field with current price
  useEffect(() => {
    if (selectedAsset) {
      const symbol = `${selectedAsset}EUR`;
      const currentPrice = assetPrices.get(symbol);
      
      if (currentPrice) {
        setPrice(parseFloat(currentPrice).toFixed(4));
      }
    }
  }, [selectedAsset, assetPrices]);
  
  // Calculate price based on target percent if applicable
  useEffect(() => {
    if (usePercentTarget && targetPercent && price) {
      const basePrice = parseFloat(price);
      const percent = parseFloat(targetPercent);
      
      if (!isNaN(basePrice) && !isNaN(percent)) {
        const targetPrice = selectedTab === 'sell' 
          ? basePrice * (1 + percent / 100) // Selling at higher price
          : basePrice * (1 - percent / 100); // Buying at lower price
        
        setPrice(targetPrice.toFixed(4));
      }
    }
  }, [usePercentTarget, targetPercent, selectedTab]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset) {
      toast.error('Please select an asset first');
      return;
    }
    
    if (!quantity || !price) {
      toast.error('Please enter quantity and price');
      return;
    }
    
    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(price);
    
    if (isNaN(numQuantity) || isNaN(numPrice)) {
      toast.error('Invalid quantity or price');
      return;
    }
    
    const symbol = `${selectedAsset}EUR`;
    
    // Check if user has enough balance for this order
    if (selectedTab === 'buy') {
      const totalCost = numQuantity * numPrice;
      const eurBalance = accountInfo?.balances.find(b => b.asset === 'EUR');
      
      if (eurBalance && parseFloat(eurBalance.free) < totalCost) {
        toast.error(`Insufficient EUR balance. Need €${totalCost.toFixed(2)}`);
        return;
      }
    } else {
      // Selling, check asset balance
      const assetBalance = accountInfo?.balances.find(b => b.asset === selectedAsset);
      
      if (assetBalance && parseFloat(assetBalance.free) < numQuantity) {
        toast.error(`Insufficient ${selectedAsset} balance`);
        return;
      }
    }
    
    const order = {
      symbol,
      side: selectedTab === 'buy' ? 'BUY' : 'SELL' as 'BUY' | 'SELL',
      type: orderType as any,
      timeInForce: 'GTC' as 'GTC' | 'IOC' | 'FOK',
      quantity: numQuantity,
      price: numPrice
    };
    
    const result = await createOrder(order);
    
    if (result) {
      toast.success(`${order.side} order created for ${symbol}`);
      setQuantity('');
    }
  };
  
  if (!selectedAsset) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Select an asset to create orders</p>
        </CardContent>
      </Card>
    );
  }
  
  const currentPrice = assetPrices.get(`${selectedAsset}EUR`);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Order</CardTitle>
        <CardDescription>
          {selectedAsset}/EUR • Current Price: {currentPrice ? `€${parseFloat(currentPrice).toFixed(4)}` : 'Loading...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'buy' | 'sell')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="buy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Sell</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIMIT">Limit</SelectItem>
                  <SelectItem value="MARKET">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity ({selectedAsset})</Label>
              <Input
                id="quantity"
                type="number"
                step="0.000001"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Amount of ${selectedAsset} to ${selectedTab}`}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="price">Price (EUR)</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-percent"
                    checked={usePercentTarget}
                    onCheckedChange={setUsePercentTarget}
                  />
                  <Label htmlFor="use-percent" className="text-sm">Target %</Label>
                </div>
              </div>
              
              {usePercentTarget ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    id="targetPercent"
                    type="number"
                    step="0.1"
                    min="0"
                    value={targetPercent}
                    onChange={(e) => setTargetPercent(e.target.value)}
                    placeholder={selectedTab === 'sell' ? "% above current" : "% below current"}
                  />
                  <Input
                    id="price"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Target price"
                    disabled
                  />
                </div>
              ) : (
                <Input
                  id="price"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price in EUR"
                />
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              variant={selectedTab === 'buy' ? 'default' : 'destructive'}
            >
              {selectedTab === 'buy' ? 'Buy' : 'Sell'} {selectedAsset}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreateOrderForm;

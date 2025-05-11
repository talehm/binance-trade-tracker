
import { useState, useEffect } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  symbol?: string;
}

const PriceChart = ({ symbol = 'BTCEUR' }: PriceChartProps) => {
  const { assetPrices, selectedAsset } = useTrading();
  const [priceData, setPriceData] = useState<any[]>([]);
  
  const effectiveSymbol = selectedAsset ? `${selectedAsset}EUR` : symbol;
  
  // Generate some fake historical data for visualization
  useEffect(() => {
    if (assetPrices.has(effectiveSymbol)) {
      const currentPrice = parseFloat(assetPrices.get(effectiveSymbol) || '0');
      if (currentPrice > 0) {
        // Generate some historical price points based on current price
        const historicalData = [];
        const now = new Date();
        
        for (let i = 24; i >= 0; i--) {
          const time = new Date(now);
          time.setHours(time.getHours() - i);
          
          // Create some random price movement
          const randomFactor = 0.98 + Math.random() * 0.04; // Between 0.98 and 1.02
          const price = currentPrice * (1 + (Math.sin(i / 4) * 0.03)) * randomFactor;
          
          historicalData.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: price
          });
        }
        
        setPriceData(historicalData);
      }
    }
  }, [effectiveSymbol, assetPrices]);
  
  const currentPrice = assetPrices.get(effectiveSymbol) || '0';
  const currentPriceNum = parseFloat(currentPrice);
  
  // Calculate a simulated price change (this would be real in a production app)
  const previousPrice = priceData.length > 1 ? priceData[0].price : currentPriceNum;
  const priceChange = currentPriceNum - previousPrice;
  const percentChange = previousPrice ? (priceChange / previousPrice) * 100 : 0;
  
  const isPositive = percentChange >= 0;
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const gradientColor = isPositive ? '#22c55e' : '#ef4444';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{effectiveSymbol}</CardTitle>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold">€{currentPriceNum > 0 ? currentPriceNum.toFixed(currentPriceNum > 10 ? 2 : 4) : 'N/A'}</span>
            <span className={`text-sm ${colorClass}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        {priceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: 'var(--foreground)' }} 
                tickMargin={10}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                domain={['dataMin - 10', 'dataMax + 10']} 
                tick={{ fontSize: 12, fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={gradientColor} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading price data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;

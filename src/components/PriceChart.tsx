
import { useState, useEffect } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock price data for chart visualization
const generateMockPriceData = (symbol: string, currentPrice: number) => {
  const data = [];
  let price = currentPrice * 0.95; // Start 5% lower
  
  // Generate 24 hourly data points (for past 24 hours)
  for (let i = 0; i < 24; i++) {
    // Add some randomness to price
    const change = (Math.random() - 0.5) * 0.02; // -1% to +1%
    price = price * (1 + change);
    
    data.push({
      time: new Date(Date.now() - ((23 - i) * 3600000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};

interface PriceChartProps {
  symbol?: string;
}

const PriceChart = ({ symbol = 'BTCUSDT' }: PriceChartProps) => {
  const { assetPrices } = useTrading();
  const [priceData, setPriceData] = useState<any[]>([]);
  
  useEffect(() => {
    if (assetPrices.has(symbol)) {
      const currentPrice = parseFloat(assetPrices.get(symbol) || '0');
      setPriceData(generateMockPriceData(symbol, currentPrice));
    }
  }, [symbol, assetPrices]);
  
  const currentPrice = assetPrices.get(symbol) || '0';
  
  // Calculate price change
  const firstPrice = priceData.length > 0 ? priceData[0].price : parseFloat(currentPrice);
  const lastPrice = parseFloat(currentPrice);
  const priceChange = lastPrice - firstPrice;
  const percentChange = (priceChange / firstPrice) * 100;
  
  const isPositive = percentChange >= 0;
  const colorClass = isPositive ? 'text-profit' : 'text-loss';
  const gradientColor = isPositive ? '#22c55e' : '#ef4444';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{symbol}</CardTitle>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold">${parseFloat(currentPrice).toFixed(2)}</span>
            <span className={`text-sm ${colorClass}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        {priceData.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;

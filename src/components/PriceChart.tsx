
import { useTrading } from '@/context/TradingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceChartProps {
  symbol?: string;
}

const PriceChart = ({ symbol = 'BTCEUR' }: PriceChartProps) => {
  const { assetPrices, selectedAsset } = useTrading();
  
  const effectiveSymbol = selectedAsset ? `${selectedAsset}EUR` : symbol;
  
  const currentPrice = assetPrices.get(effectiveSymbol) || '0';
  const currentPriceNum = parseFloat(currentPrice);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{effectiveSymbol}</CardTitle>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold">€{currentPriceNum > 0 ? currentPriceNum.toFixed(currentPriceNum > 10 ? 2 : 4) : 'N/A'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Current Price</h3>
          <p className="text-4xl font-bold mt-4">€{currentPriceNum > 0 ? 
            (currentPriceNum > 1000 ? currentPriceNum.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 
              currentPriceNum.toFixed(currentPriceNum > 10 ? 2 : 4)) : 'N/A'}</p>
          <p className="text-muted-foreground mt-2">{effectiveSymbol}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;

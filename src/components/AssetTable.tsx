
import { useTrading } from '@/context/TradingContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';

const AssetTable = () => {
  const { accountInfo, assetPrices, selectAsset, selectedAsset } = useTrading();

  if (!accountInfo) return null;

  // Filter out assets with zero balance
  const nonZeroAssets = accountInfo.balances.filter(
    asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0
  );
  
  // Helper for price color formatting
  const getPriceChangeClass = (change: number) => {
    if (change > 0) return 'text-profit';
    if (change < 0) return 'text-loss';
    return 'text-neutral';
  };
  
  // Mock price changes (would come from API in a real app)
  const getRandomPriceChange = () => {
    return (Math.random() * 10) - 5; // Random between -5% and +5%
  };
  
  return (
    <div className="crypto-card">
      <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">Locked</TableHead>
              <TableHead className="text-right">Price (USDT)</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">Value (USDT)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nonZeroAssets.map(asset => {
              const symbol = `${asset.asset}USDT`;
              const price = assetPrices.get(symbol) || '0';
              const priceValue = parseFloat(price);
              const freeAmount = parseFloat(asset.free);
              const lockedAmount = parseFloat(asset.locked);
              const totalAmount = freeAmount + lockedAmount;
              const totalValue = priceValue * totalAmount;
              
              // Mock price change data
              const change = getRandomPriceChange();
              const changeClass = getPriceChangeClass(change);
              
              return (
                <TableRow key={asset.asset} className={selectedAsset === asset.asset ? 'bg-primary/10' : ''}>
                  <TableCell className="font-medium">{asset.asset}</TableCell>
                  <TableCell className="text-right">{parseFloat(asset.free).toFixed(8)}</TableCell>
                  <TableCell className="text-right">{parseFloat(asset.locked).toFixed(8)}</TableCell>
                  <TableCell className="text-right">{priceValue ? priceValue.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className={`text-right flex justify-end items-center ${changeClass}`}>
                    {change > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(change).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">{totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      variant={selectedAsset === asset.asset ? "secondary" : "ghost"} 
                      size="sm" 
                      onClick={() => selectAsset(asset.asset)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetTable;

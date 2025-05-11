
import { useTrading } from '@/context/TradingContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Supported pairs
const SUPPORTED_PAIRS = ['ADAEUR', 'BTCEUR'];

const AssetTable = () => {
  const { accountInfo, assetPrices, selectAsset, selectedAsset } = useTrading();

  if (!accountInfo) return null;

  // Filter out assets that are not in our supported list
  const supportedAssets = accountInfo.balances.filter(
    asset => asset.asset === 'ADA' || asset.asset === 'BTC'
  );
  
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
              <TableHead className="text-right">Price (EUR)</TableHead>
              <TableHead className="text-right">Value (EUR)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supportedAssets.map(asset => {
              const symbol = `${asset.asset}EUR`;
              const price = assetPrices.get(symbol) || '0';
              const priceValue = parseFloat(price);
              const freeAmount = parseFloat(asset.free);
              const lockedAmount = parseFloat(asset.locked);
              const totalAmount = freeAmount + lockedAmount;
              const totalValue = priceValue * totalAmount;
              
              return (
                <TableRow key={asset.asset} className={selectedAsset === asset.asset ? 'bg-primary/10' : ''}>
                  <TableCell className="font-medium">{asset.asset}</TableCell>
                  <TableCell className="text-right">{parseFloat(asset.free).toFixed(8)}</TableCell>
                  <TableCell className="text-right">{parseFloat(asset.locked).toFixed(8)}</TableCell>
                  <TableCell className="text-right">€{priceValue ? priceValue.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className="text-right">€{totalValue.toFixed(2)}</TableCell>
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

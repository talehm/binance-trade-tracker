
import { useTrading } from '@/context/TradingContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const TradeHistory = () => {
  const { selectedAsset, tradeHistory } = useTrading();
  
  if (!selectedAsset) {
    return (
      <div className="crypto-card">
        <h2 className="text-xl font-semibold mb-4">Trade History</h2>
        <p className="text-muted-foreground text-center py-4">Select an asset to view trade history</p>
      </div>
    );
  }
  
  const symbol = `${selectedAsset}EUR`;
  const trades = tradeHistory.get(symbol) || [];
  
  if (trades.length === 0) {
    return (
      <div className="crypto-card">
        <h2 className="text-xl font-semibold mb-4">Trade History for {selectedAsset}</h2>
        <p className="text-muted-foreground text-center py-4">No trade history found</p>
      </div>
    );
  }
  
  return (
    <div className="crypto-card">
      <h2 className="text-xl font-semibold mb-4">Trade History for {selectedAsset}</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map(trade => {
              const total = parseFloat(trade.price) * parseFloat(trade.qty);
              
              return (
                <TableRow key={trade.id}>
                  <TableCell>
                    <Badge variant={trade.isBuyer ? 'default' : 'destructive'}>
                      {trade.isBuyer ? 'BUY' : 'SELL'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{parseFloat(trade.price).toFixed(4)}</TableCell>
                  <TableCell className="text-right">{parseFloat(trade.qty).toFixed(6)}</TableCell>
                  <TableCell className="text-right">{total.toFixed(2)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(trade.time), { addSuffix: true })}
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

export default TradeHistory;

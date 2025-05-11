
import { useTrading } from '@/context/TradingContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const OpenOrdersTable = () => {
  const { openOrders } = useTrading();

  if (!openOrders || openOrders.length === 0) {
    return (
      <div className="crypto-card">
        <h2 className="text-xl font-semibold mb-4">Open Orders</h2>
        <p className="text-muted-foreground text-center py-4">No open orders found</p>
      </div>
    );
  }

  return (
    <div className="crypto-card">
      <h2 className="text-xl font-semibold mb-4">Open Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openOrders.map(order => {
              const total = parseFloat(order.price) * parseFloat(order.origQty);
              const isRecent = Date.now() - order.time < 3600000; // Less than an hour
              
              return (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge variant={order.side === 'BUY' ? 'default' : 'destructive'}>
                      {order.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{parseFloat(order.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{parseFloat(order.origQty).toFixed(6)}</TableCell>
                  <TableCell className="text-right">{total.toFixed(2)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(order.time), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${isRecent ? 'animate-pulse-subtle' : ''}`}>
                      {order.status}
                    </Badge>
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

export default OpenOrdersTable;

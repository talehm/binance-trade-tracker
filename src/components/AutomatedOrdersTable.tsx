
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { API_CONFIG } from '@/services/api/config';

interface StoredOrder {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
  timestamp: number;
  orderId?: number;
  status: "PENDING" | "CREATED" | "EXECUTED" | "FAILED";
}

const AutomatedOrdersTable = () => {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  
  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('automated_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.error('Failed to load stored orders:', error);
      }
    };
    
    loadOrders();
    
    // Set up an interval to refresh orders
    const intervalId = setInterval(loadOrders, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === "PENDING" || order.status === "CREATED");
  const executedOrders = orders.filter(order => order.status === "EXECUTED");
  const failedOrders = orders.filter(order => order.status === "FAILED");
  
  // Get badge variant based on order status - fixed to return only allowed variants
  const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "PENDING": return "secondary";
      case "CREATED": return "default";
      case "EXECUTED": return "outline"; // Changed from 'success' to 'outline'
      case "FAILED": return "destructive";
      default: return "outline";
    }
  };
  
  // Get badge variant based on order side - fixed to return only allowed variants
  const getSideBadgeVariant = (side: "BUY" | "SELL"): "default" | "destructive" | "outline" | "secondary" => {
    return side === "BUY" ? "default" : "destructive";
  };
  
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
        <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
        <TabsTrigger value="executed">Executed ({executedOrders.length})</TabsTrigger>
        <TabsTrigger value="failed">Failed ({failedOrders.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <OrdersTable orders={orders} getBadgeVariant={getBadgeVariant} getSideBadgeVariant={getSideBadgeVariant} />
      </TabsContent>
      
      <TabsContent value="pending">
        <OrdersTable orders={pendingOrders} getBadgeVariant={getBadgeVariant} getSideBadgeVariant={getSideBadgeVariant} />
      </TabsContent>
      
      <TabsContent value="executed">
        <OrdersTable orders={executedOrders} getBadgeVariant={getBadgeVariant} getSideBadgeVariant={getSideBadgeVariant} />
      </TabsContent>
      
      <TabsContent value="failed">
        <OrdersTable orders={failedOrders} getBadgeVariant={getBadgeVariant} getSideBadgeVariant={getSideBadgeVariant} />
      </TabsContent>
    </Tabs>
  );
};

interface OrdersTableProps {
  orders: StoredOrder[];
  getBadgeVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
  getSideBadgeVariant: (side: "BUY" | "SELL") => "default" | "destructive" | "outline" | "secondary";
}

const OrdersTable = ({ orders, getBadgeVariant, getSideBadgeVariant }: OrdersTableProps) => {
  if (orders.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No orders found</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(order => {
              const total = parseFloat(order.price) * parseFloat(order.quantity);
              
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={getSideBadgeVariant(order.side)}>
                      {order.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{parseFloat(order.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{parseFloat(order.quantity).toFixed(6)}</TableCell>
                  <TableCell className="text-right">{total.toFixed(2)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AutomatedOrdersTable;

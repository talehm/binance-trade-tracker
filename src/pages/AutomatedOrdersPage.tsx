
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useTrading } from '@/context/TradingContext';
import AutomatedOrdersTable from '@/components/AutomatedOrdersTable';
import AutomatedOrderStats from '@/components/AutomatedOrderStats';
import SimulationToggle from '@/components/SimulationToggle';

const AutomatedOrdersPage = () => {
  const { toast } = useToast();
  const { isLoading, refreshData, processAutomatedOrders } = useTrading();
  
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Data refreshed",
      description: "The orders data has been updated."
    });
  };
  
  const handleProcessOrders = async () => {
    await processAutomatedOrders();
    toast({
      title: "Orders processed",
      description: "Automated orders have been processed."
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Automated Trading</h1>
          <p className="text-muted-foreground">Monitor your automated trading activities</p>
        </div>
        <div className="flex items-center gap-4">
          <SimulationToggle />
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            Refresh
          </Button>
          <Button onClick={handleProcessOrders} disabled={isLoading}>
            Process Orders
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AutomatedOrderStats />
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Automated Orders</CardTitle>
            <CardDescription>All orders created by the automated trading system</CardDescription>
          </CardHeader>
          <CardContent>
            <AutomatedOrdersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomatedOrdersPage;

import { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { recentSales, dailySummaries } from '@/lib/mockData';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Search,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const todaySales = (dailySummaries[dailySummaries.length - 1] as any).totalSales;
  const yesterdaySales = (dailySummaries[dailySummaries.length - 2] as any).totalSales;
  const salesGrowth = ((todaySales - yesterdaySales) / yesterdaySales) * 100;

  const totalTransactions = recentSales.length;
  const averageTransaction = todaySales / totalTransactions;

  const filteredSales = recentSales.filter(sale =>
    sale.id.toString().includes(searchTerm) ||
    (sale as any).cashierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const salesChartData = dailySummaries.map(d => ({
    date: new Date((d as any).date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: (d as any).totalSales,
    transactions: Math.floor(Math.random() * 50) + 30,
  }));

  const handleExportReport = () => {
    try {
      const reportData = {
        summary: {
          todayRevenue: todaySales,
          yesterdayRevenue: yesterdaySales,
          salesGrowth: salesGrowth.toFixed(2),
          totalTransactions,
          averageTransaction,
          weeklySales: dailySummaries.reduce((sum, d) => sum + (d as any).totalSales, 0),
        },
        dailySummaries: dailySummaries,
        recentSales: filteredSales,
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Sales report exported successfully',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Management</h1>
          <p className="text-[#A1A1AA] mt-1">Track and analyze your sales performance</p>
        </div>
        <Button 
          onClick={handleExportReport}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Revenue"
          value={`$${todaySales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: salesGrowth, isPositive: salesGrowth > 0 }}
        />
        <MetricCard
          title="Total Transactions"
          value={totalTransactions}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Average Transaction"
          value={`$${averageTransaction.toFixed(2)}`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Weekly Sales"
          value={`$${dailySummaries.reduce((sum, d) => sum + (d as any).totalSales, 0).toLocaleString()}`}
          icon={Calendar}
        />
      </div>

      {/* Sales Trend Chart */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">Sales Trend (7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#71717A" />
              <YAxis yAxisId="left" stroke="#71717A" />
              <YAxis yAxisId="right" orientation="right" stroke="#71717A" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141414',
                  border: '1px solid #2A2A2A',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Revenue ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="transactions"
                stroke="#10B981"
                strokeWidth={3}
                name="Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Transaction History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#71717A]" />
              <Input
                placeholder="Search by ID or cashier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#141414] border-[#2A2A2A] text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <div key={sale.id} className="p-4 bg-[#141414] rounded-lg border border-[#2A2A2A] hover:border-[#3B82F6] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">Sale #{sale.id}</h3>
                      <Badge variant="outline" className="border-[#10B981] text-[#10B981]">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-[#71717A] mt-1">
                      {new Date((sale as any).date).toLocaleString()} • Cashier: {(sale as any).cashierName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#10B981]">${(sale as any).totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-[#71717A]">{(sale as any).items?.length || 0} items</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(sale as any).items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-[#A1A1AA]">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="text-white font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
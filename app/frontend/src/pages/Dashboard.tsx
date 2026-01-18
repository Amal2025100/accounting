import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { dailySummaries, products, recentSales, aiAlerts } from '@/lib/mockData';
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingCart,
  Users,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();

  const todaySummary = dailySummaries[dailySummaries.length - 1];
  const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);

  const salesChartData = dailySummaries.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: d.totalSales,
    profit: d.profit,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#A1A1AA] mt-1">Welcome back, {user?.username}! Here's your business overview.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Sales"
          value={`$${todaySummary.totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 8.2, isPositive: true }}
        />
        <MetricCard
          title="Today's Profit"
          value={`$${todaySummary.profit.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Inventory Value"
          value={`$${totalInventoryValue.toLocaleString()}`}
          icon={Package}
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          className={lowStockProducts.length > 5 ? 'border-[#F59E0B]' : ''}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales & Profit Trend */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white">Sales & Profit Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="date" stroke="#71717A" />
                <YAxis stroke="#71717A" />
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
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white">Top Products by Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={products
                  .map(p => ({
                    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
                    value: p.quantity * p.sellPrice,
                  }))
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 6)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="name" stroke="#71717A" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#71717A" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
                  <div>
                    <p className="text-sm font-medium text-white">Sale #{sale.id}</p>
                    <p className="text-xs text-[#71717A]">
                      {new Date(sale.date).toLocaleString()} • {sale.cashierName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#10B981]">${sale.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-[#71717A]">{sale.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Alerts */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
              AI Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={
                        alert.type === 'Stock'
                          ? 'border-[#F59E0B] text-[#F59E0B]'
                          : alert.type === 'Anomaly'
                          ? 'border-[#EF4444] text-[#EF4444]'
                          : 'border-[#3B82F6] text-[#3B82F6]'
                      }
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-[#71717A]">
                      Risk: {alert.riskScore}/10
                    </span>
                  </div>
                  <p className="text-sm text-[#A1A1AA]">{alert.message}</p>
                  <p className="text-xs text-[#71717A] mt-1">
                    {new Date(alert.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
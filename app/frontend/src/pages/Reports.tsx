import { useState } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dailySummaries, products, recentSales } from '@/lib/mockData';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Reports() {
  const [reportType, setReportType] = useState('daily-summary');
  const [dateRange, setDateRange] = useState('7-days');

  const handleExport = () => {
    alert('Report export functionality would download the report as PDF/Excel in production');
  };

  const summaryData = dailySummaries.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: d.totalSales,
    expenses: d.totalExpenses,
    profit: d.profit,
  }));

  const categoryData = Array.from(new Set(products.map(p => p.category))).map(category => {
    const categoryProducts = products.filter(p => p.category === category);
    return {
      category,
      totalValue: categoryProducts.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0),
      totalStock: categoryProducts.reduce((sum, p) => sum + p.quantity, 0),
    };
  });

  return (
    <RoleGuard allowedRoles={['Manager', 'Accountant']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports Center</h1>
            <p className="text-[#A1A1AA] mt-1">Generate and export comprehensive business reports</p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Report Configuration */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-[#141414] border-[#2A2A2A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2A2A2A]">
                    <SelectItem value="daily-summary" className="text-white">Daily Summary</SelectItem>
                    <SelectItem value="sales-report" className="text-white">Sales Report</SelectItem>
                    <SelectItem value="inventory-report" className="text-white">Inventory Report</SelectItem>
                    <SelectItem value="financial-report" className="text-white">Financial Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-[#141414] border-[#2A2A2A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2A2A2A]">
                    <SelectItem value="today" className="text-white">Today</SelectItem>
                    <SelectItem value="7-days" className="text-white">Last 7 Days</SelectItem>
                    <SelectItem value="30-days" className="text-white">Last 30 Days</SelectItem>
                    <SelectItem value="custom" className="text-white">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Preview */}
        {reportType === 'daily-summary' && (
          <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Daily Summary Report</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={summaryData}>
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
                    <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} name="Sales" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A1A1AA]">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-[#3B82F6]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${dailySummaries.reduce((sum, d) => sum + d.totalSales, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-[#10B981] mt-1">↑ 12.5% from previous period</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A1A1AA]">Total Expenses</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#EF4444]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${dailySummaries.reduce((sum, d) => sum + d.totalExpenses, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-[#EF4444] mt-1">↑ 8.2% from previous period</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A1A1AA]">Net Profit</CardTitle>
                  <Calendar className="h-4 w-4 text-[#10B981]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${dailySummaries.reduce((sum, d) => sum + d.profit, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-[#10B981] mt-1">↑ 15.3% from previous period</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {reportType === 'inventory-report' && (
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-white">Inventory Report by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="category" stroke="#71717A" />
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
                  <Bar dataKey="totalValue" fill="#3B82F6" name="Total Value ($)" />
                  <Bar dataKey="totalStock" fill="#10B981" name="Total Stock" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Report Summary Table */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white">Detailed Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Sales</th>
                    <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Expenses</th>
                    <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Profit</th>
                    <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummaries.map((summary) => {
                    const margin = ((summary.profit / summary.totalSales) * 100).toFixed(1);
                    return (
                      <tr key={summary.date} className="border-b border-[#2A2A2A] hover:bg-[#141414]">
                        <td className="py-3 px-4 text-white">
                          {new Date(summary.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-[#3B82F6]">${summary.totalSales.toFixed(2)}</td>
                        <td className="py-3 px-4 text-[#EF4444]">${summary.totalExpenses.toFixed(2)}</td>
                        <td className="py-3 px-4 text-[#10B981]">${summary.profit.toFixed(2)}</td>
                        <td className="py-3 px-4 text-white">{margin}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
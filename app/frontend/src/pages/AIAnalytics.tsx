import { RoleGuard } from '@/components/RoleGuard';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiAlerts, salesForecast, profitPrediction, cashFlowPrediction } from '@/lib/mockData';
import {
  Brain,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AIAnalytics() {
  const avgSalesForecast = salesForecast.reduce((sum, p) => sum + p.value, 0) / salesForecast.length;
  const avgProfitPrediction = profitPrediction.reduce((sum, p) => sum + p.value, 0) / profitPrediction.length;
  const highRiskAlerts = aiAlerts.filter(a => a.riskScore >= 7);

  const forecastData = salesForecast.map((sf, idx) => ({
    date: new Date(sf.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: sf.value,
    confidence: sf.confidence ? sf.confidence * 100 : 0,
    profit: profitPrediction[idx]?.value || 0,
  }));

  const cashFlowData = cashFlowPrediction.map(cf => ({
    date: new Date(cf.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    balance: cf.value,
  }));

  return (
    <RoleGuard allowedRoles={['Manager', 'Accountant']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Analytics</h1>
            <p className="text-[#A1A1AA] mt-1">Intelligent predictions and insights powered by AI</p>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Avg Sales Forecast"
            value={`$${avgSalesForecast.toFixed(0)}`}
            icon={TrendingUp}
          />
          <MetricCard
            title="Avg Profit Prediction"
            value={`$${avgProfitPrediction.toFixed(0)}`}
            icon={DollarSign}
          />
          <MetricCard
            title="High Risk Alerts"
            value={highRiskAlerts.length}
            icon={AlertTriangle}
            className="border-[#EF4444]"
          />
          <MetricCard
            title="AI Confidence"
            value="87%"
            icon={Sparkles}
          />
        </div>

        {/* Sales & Profit Forecast */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#8B5CF6]" />
              Sales & Profit Forecast (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={forecastData}>
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
                  name="Predicted Sales ($)"
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Predicted Profit ($)"
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="confidence"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Confidence (%)"
                  dot={{ fill: '#8B5CF6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
              <p className="text-sm text-[#A1A1AA]">
                <span className="text-[#8B5CF6] font-semibold">AI Insight:</span> Sales are predicted to peak on{' '}
                {forecastData[3]?.date} with an expected revenue of ${forecastData[3]?.sales.toFixed(0)}.
                Confidence levels remain above 80% for the next 3 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Prediction */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#10B981]" />
              Cash Flow Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                  name="Cash Balance ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
              <p className="text-sm text-[#A1A1AA]">
                <span className="text-[#10B981] font-semibold">AI Insight:</span> Cash balance is projected to reach
                ${cashFlowData[3]?.balance.toLocaleString()} by {cashFlowData[3]?.date}. Maintain current
                trajectory for optimal liquidity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Alerts & Recommendations */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alerts */}
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                AI Alerts & Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={
                          alert.riskScore >= 8
                            ? 'border-[#EF4444] text-[#EF4444]'
                            : alert.riskScore >= 6
                            ? 'border-[#F59E0B] text-[#F59E0B]'
                            : 'border-[#3B82F6] text-[#3B82F6]'
                        }
                      >
                        {alert.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#71717A]">Risk:</span>
                        <span
                          className={`text-xs font-bold ${
                            alert.riskScore >= 8
                              ? 'text-[#EF4444]'
                              : alert.riskScore >= 6
                              ? 'text-[#F59E0B]'
                              : 'text-[#3B82F6]'
                          }`}
                        >
                          {alert.riskScore}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">{alert.message}</p>
                    <p className="text-xs text-[#71717A] mt-2">
                      {new Date(alert.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Recommendations */}
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#3B82F6]/10 rounded-lg border border-[#8B5CF6]">
                  <h4 className="text-white font-semibold mb-2">Inventory Optimization</h4>
                  <p className="text-sm text-[#A1A1AA] mb-3">
                    Restock Cheddar Cheese and Organic Eggs immediately. AI predicts 30% demand increase this week.
                  </p>
                  <Badge className="bg-[#8B5CF6] text-white">High Priority</Badge>
                </div>

                <div className="p-4 bg-gradient-to-r from-[#10B981]/10 to-[#3B82F6]/10 rounded-lg border border-[#10B981]">
                  <h4 className="text-white font-semibold mb-2">Sales Strategy</h4>
                  <p className="text-sm text-[#A1A1AA] mb-3">
                    Potato Chips showing unusual demand spike. Consider promotional pricing for related snack items.
                  </p>
                  <Badge className="bg-[#10B981] text-white">Opportunity</Badge>
                </div>

                <div className="p-4 bg-gradient-to-r from-[#F59E0B]/10 to-[#EF4444]/10 rounded-lg border border-[#F59E0B]">
                  <h4 className="text-white font-semibold mb-2">Cash Flow Management</h4>
                  <p className="text-sm text-[#A1A1AA] mb-3">
                    Potential cash shortage in 15 days. Review payment schedules and consider accelerating receivables.
                  </p>
                  <Badge className="bg-[#F59E0B] text-white">Action Required</Badge>
                </div>

                <div className="p-4 bg-[#141414] rounded-lg border border-[#2A2A2A]">
                  <h4 className="text-white font-semibold mb-2">Seasonal Trend</h4>
                  <p className="text-sm text-[#A1A1AA] mb-3">
                    AI detects early signs of seasonal buying patterns. Prepare inventory for expected 20% increase.
                  </p>
                  <Badge variant="outline" className="border-[#3B82F6] text-[#3B82F6]">
                    Insight
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
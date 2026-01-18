import { useState } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { accounts, journalEntries } from '@/lib/mockData';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Scale,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Accounting() {
  const assets = accounts.filter(a => a.type === 'Asset');
  const liabilities = accounts.filter(a => a.type === 'Liability');
  const equity = accounts.filter(a => a.type === 'Equity');
  const revenue = accounts.filter(a => a.type === 'Revenue');
  const expenses = accounts.filter(a => a.type === 'Expense');

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = revenue.reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  const accountTypeData = [
    { name: 'Assets', value: totalAssets, color: '#3B82F6' },
    { name: 'Liabilities', value: totalLiabilities, color: '#EF4444' },
    { name: 'Equity', value: totalEquity, color: '#10B981' },
  ];

  const incomeStatementData = [
    { name: 'Revenue', value: totalRevenue, color: '#10B981' },
    { name: 'Expenses', value: totalExpenses, color: '#EF4444' },
    { name: 'Net Income', value: netIncome, color: '#8B5CF6' },
  ];

  return (
    <RoleGuard allowedRoles={['Manager', 'Accountant']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Accounting</h1>
          <p className="text-[#A1A1AA] mt-1">Financial statements and journal entries</p>
        </div>

        {/* Financial Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Assets"
            value={`$${totalAssets.toLocaleString()}`}
            icon={DollarSign}
          />
          <MetricCard
            title="Total Liabilities"
            value={`$${totalLiabilities.toLocaleString()}`}
            icon={TrendingDown}
          />
          <MetricCard
            title="Total Equity"
            value={`$${totalEquity.toLocaleString()}`}
            icon={Scale}
          />
          <MetricCard
            title="Net Income"
            value={`$${netIncome.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: 15.3, isPositive: true }}
          />
        </div>

        {/* Financial Statements */}
        <Tabs defaultValue="balance-sheet" className="space-y-4">
          <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A]">
            <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-[#3B82F6]">
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger value="income-statement" className="data-[state=active]:bg-[#3B82F6]">
              Income Statement
            </TabsTrigger>
            <TabsTrigger value="journal-entries" className="data-[state=active]:bg-[#3B82F6]">
              Journal Entries
            </TabsTrigger>
          </TabsList>

          {/* Balance Sheet */}
          <TabsContent value="balance-sheet" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Balance Sheet Chart */}
              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">Account Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={accountTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {accountTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#141414',
                          border: '1px solid #2A2A2A',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Account Balances */}
              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">Account Balances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Asset', 'Liability', 'Equity'].map((type) => {
                      const typeAccounts = accounts.filter(a => a.type === type);
                      const typeTotal = typeAccounts.reduce((sum, a) => sum + a.balance, 0);
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{type}s</h3>
                            <span className="text-[#3B82F6] font-bold">
                              ${typeTotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="space-y-1 pl-4">
                            {typeAccounts.map((account) => (
                              <div key={account.id} className="flex items-center justify-between text-sm">
                                <span className="text-[#A1A1AA]">{account.name}</span>
                                <span className="text-white">${account.balance.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Income Statement */}
          <TabsContent value="income-statement" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Income Chart */}
              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">Income Statement Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incomeStatementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                      <XAxis dataKey="name" stroke="#71717A" />
                      <YAxis stroke="#71717A" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#141414',
                          border: '1px solid #2A2A2A',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="value">
                        {incomeStatementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Income Details */}
              <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">Income Statement Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Revenue</h3>
                      <div className="space-y-1 pl-4">
                        {revenue.map((account) => (
                          <div key={account.id} className="flex items-center justify-between text-sm">
                            <span className="text-[#A1A1AA]">{account.name}</span>
                            <span className="text-[#10B981]">${account.balance.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-[#2A2A2A]">
                          <span className="text-white">Total Revenue</span>
                          <span className="text-[#10B981]">${totalRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-2">Expenses</h3>
                      <div className="space-y-1 pl-4">
                        {expenses.map((account) => (
                          <div key={account.id} className="flex items-center justify-between text-sm">
                            <span className="text-[#A1A1AA]">{account.name}</span>
                            <span className="text-[#EF4444]">${account.balance.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-[#2A2A2A]">
                          <span className="text-white">Total Expenses</span>
                          <span className="text-[#EF4444]">${totalExpenses.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-[#3B82F6]">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-lg">Net Income</span>
                        <span className="text-[#8B5CF6] font-bold text-lg">
                          ${netIncome.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Journal Entries */}
          <TabsContent value="journal-entries">
            <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Recent Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-[#141414] rounded-lg border border-[#2A2A2A]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">Entry #{entry.id}</h3>
                          <p className="text-sm text-[#71717A] mt-1">{entry.description}</p>
                          <p className="text-xs text-[#71717A] mt-1">
                            {new Date(entry.date).toLocaleDateString()} • By: {entry.createdBy}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-[#3B82F6] text-[#3B82F6]">
                          Posted
                        </Badge>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#2A2A2A]">
                              <th className="text-left py-2 text-[#A1A1AA]">Account</th>
                              <th className="text-right py-2 text-[#A1A1AA]">Debit</th>
                              <th className="text-right py-2 text-[#A1A1AA]">Credit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.details.map((detail, idx) => (
                              <tr key={idx} className="border-b border-[#2A2A2A]">
                                <td className="py-2 text-[#A1A1AA]">{detail.accountName}</td>
                                <td className="text-right py-2 text-white">
                                  {detail.debit > 0 ? `$${detail.debit.toFixed(2)}` : '-'}
                                </td>
                                <td className="text-right py-2 text-white">
                                  {detail.credit > 0 ? `$${detail.credit.toFixed(2)}` : '-'}
                                </td>
                              </tr>
                            ))}
                            <tr className="font-semibold">
                              <td className="py-2 text-white">Total</td>
                              <td className="text-right py-2 text-[#10B981]">
                                ${entry.details.reduce((sum, d) => sum + d.debit, 0).toFixed(2)}
                              </td>
                              <td className="text-right py-2 text-[#10B981]">
                                ${entry.details.reduce((sum, d) => sum + d.credit, 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}
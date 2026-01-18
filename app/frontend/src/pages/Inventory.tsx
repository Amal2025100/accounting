import { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products } from '@/lib/mockData';
import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
} from 'lucide-react';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  const potentialRevenue = products.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: typeof products[0]) => {
    const percentage = (product.quantity / product.lowStockThreshold) * 100;
    if (percentage <= 50) return { label: 'Critical', color: 'border-[#EF4444] text-[#EF4444]' };
    if (percentage <= 100) return { label: 'Low', color: 'border-[#F59E0B] text-[#F59E0B]' };
    return { label: 'In Stock', color: 'border-[#10B981] text-[#10B981]' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
        <p className="text-[#A1A1AA] mt-1">Monitor and manage your product inventory</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          className={lowStockProducts.length > 5 ? 'border-[#F59E0B]' : ''}
        />
        <MetricCard
          title="Inventory Value"
          value={`$${totalInventoryValue.toLocaleString()}`}
          icon={DollarSign}
        />
        <MetricCard
          title="Potential Revenue"
          value={`$${potentialRevenue.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-[#1A1A1A] border-[#F59E0B]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-sm text-[#F59E0B] mt-1">
                    Only {product.quantity} units left
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Catalog */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-white">Product Catalog</CardTitle>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-[#71717A]" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#141414] border-[#2A2A2A] text-white"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] bg-[#141414] border-[#2A2A2A] text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#2A2A2A]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white">
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Cost Price</th>
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Sell Price</th>
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Value</th>
                  <th className="text-left py-3 px-4 text-[#A1A1AA] font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="border-b border-[#2A2A2A] hover:bg-[#141414] transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-[#A1A1AA]">{product.category}</td>
                      <td className="py-3 px-4 text-white">{product.quantity}</td>
                      <td className="py-3 px-4 text-[#A1A1AA]">${product.costPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-white">${product.sellPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-[#10B981]">
                        ${(product.quantity * product.sellPrice).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
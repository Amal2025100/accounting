import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Users as UsersIcon, Phone, Mail, MapPin, CreditCard, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import type { Customer, Sale } from '@/types';

export default function Customers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSales, setCustomerSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customer_code: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    membership_tier: 'Bronze' as 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
    loyalty_points: 0,
    status: 'Active' as 'Active' | 'Inactive',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsPageLoading(true);
    setError(null);
    try {
      const [customersData, salesData] = await Promise.all([
        api.customers.getAll().catch(() => []),
        api.sales.getAll().catch(() => []),
      ]);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
      setCustomers([]);
      setSales([]);
    } finally {
      setIsPageLoading(false);
    }
  };

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((c) => {
        if (!c || !c.name || !c.customer_code) return false;
        const query = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(query) ||
          c.customer_code.toLowerCase().includes(query) ||
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.phone && c.phone.includes(query))
        );
      })
    : [];

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        customer_code: customer.customer_code,
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        membership_tier: customer.membership_tier,
        loyalty_points: customer.loyalty_points,
        status: customer.status,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        customer_code: `CUST-${Date.now()}`,
        name: '',
        email: '',
        phone: '',
        address: '',
        membership_tier: 'Bronze',
        loyalty_points: 0,
        status: 'Active',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.customer_code) {
      toast({
        title: 'Validation Error',
        description: 'Customer code and name are required',
        variant: 'destructive',
      });
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];

      if (editingCustomer) {
        await api.customers.update(editingCustomer.id, formData);
        toast({
          title: 'Success',
          description: 'Customer updated successfully',
        });
      } else {
        await api.customers.create({
          user_id: user!.id,
          ...formData,
          total_purchases: 0,
          last_purchase_date: currentDateTime,
          created_at: currentDateTime,
        });
        toast({
          title: 'Success',
          description: 'Customer created successfully',
        });
      }

      await loadData();
      setShowDialog(false);
    } catch (error) {
      const detail = (error as { response?: { data?: { detail?: string } }; data?: { detail?: string }; message?: string })?.response?.data?.detail 
                  || (error as { data?: { detail?: string } })?.data?.detail 
                  || (error as Error).message 
                  || 'Failed to save customer';
      toast({
        title: 'Error',
        description: detail,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (customer: Customer) => {
    setSelectedCustomer(customer);
    const customerTransactions = sales.filter(s => s.customer_id === customer.id);
    setCustomerSales(customerTransactions);
    setShowDetailsDialog(true);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-[#E5E7EB] text-[#1F2937]';
      case 'Gold':
        return 'bg-[#FCD34D] text-[#92400E]';
      case 'Silver':
        return 'bg-[#D1D5DB] text-[#374151]';
      default:
        return 'bg-[#CD7F32] text-white';
    }
  };

  const calculateCustomerStats = (customer: Customer) => {
    const customerTransactions = sales.filter(s => s.customer_id === customer.id);
    const totalSpent = customerTransactions.reduce((sum, sale) => sum + sale.total_amount, 0);
    const avgTransaction = customerTransactions.length > 0 ? totalSpent / customerTransactions.length : 0;
    
    return {
      totalTransactions: customerTransactions.length,
      totalSpent,
      avgTransaction,
      lastPurchase: customerTransactions.length > 0 
        ? new Date(Math.max(...customerTransactions.map(s => new Date(s.sale_date).getTime())))
        : null,
    };
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-[#A1A1AA]">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-[#A1A1AA] mt-1">Manage customer relationships and loyalty programs</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#A1A1AA]">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{customers.length}</p>
            <p className="text-xs text-[#10B981] mt-1">
              {customers.filter(c => c.status === 'Active').length} Active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#A1A1AA]">Platinum Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {customers.filter(c => c.membership_tier === 'Platinum').length}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Premium tier</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#A1A1AA]">Total Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {customers.reduce((sum, c) => sum + c.loyalty_points, 0).toLocaleString()}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Across all customers</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#A1A1AA]">Avg Points/Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {customers.length > 0 
                ? Math.round(customers.reduce((sum, c) => sum + c.loyalty_points, 0) / customers.length)
                : 0}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Average balance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[#A1A1AA]" />
            <Input
              placeholder="Search by name, code, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
            />
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-8 text-center">
            <UsersIcon className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Customers</h3>
            <p className="text-[#A1A1AA] mb-4">{error}</p>
            <Button
              onClick={loadData}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && filteredCustomers.length === 0 && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-12 text-center">
            <UsersIcon className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No customers found</h3>
            <p className="text-[#A1A1AA] mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first customer or load demo data from Settings'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!error && filteredCustomers.length > 0 && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2A2A2A] hover:bg-[#1A1A1A]">
                  <TableHead className="text-[#A1A1AA]">Customer Code</TableHead>
                  <TableHead className="text-[#A1A1AA]">Name</TableHead>
                  <TableHead className="text-[#A1A1AA]">Contact</TableHead>
                  <TableHead className="text-[#A1A1AA]">Tier</TableHead>
                  <TableHead className="text-[#A1A1AA]">Loyalty Points</TableHead>
                  <TableHead className="text-[#A1A1AA]">Total Spent</TableHead>
                  <TableHead className="text-[#A1A1AA]">Status</TableHead>
                  <TableHead className="text-[#A1A1AA]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const stats = calculateCustomerStats(customer);
                  return (
                    <TableRow key={customer.id} className="border-[#2A2A2A] hover:bg-[#0A0A0A]">
                      <TableCell className="font-medium text-white">{customer.customer_code}</TableCell>
                      <TableCell className="text-white">{customer.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.email && (
                            <p className="text-xs text-[#A1A1AA] flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </p>
                          )}
                          {customer.phone && (
                            <p className="text-xs text-[#A1A1AA] flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(customer.membership_tier)}>
                          {customer.membership_tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-semibold">
                        {customer.loyalty_points.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white font-semibold">
                        ${stats.totalSpent.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(customer)}
                            className="text-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(customer)}
                            className="text-[#10B981] hover:text-[#10B981] hover:bg-[#10B981]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Customer Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Code *</Label>
              <Input
                value={formData.customer_code}
                onChange={(e) => setFormData({ ...formData, customer_code: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                disabled={!!editingCustomer}
              />
            </div>
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Membership Tier</Label>
              <Select value={formData.membership_tier} onValueChange={(value: 'Bronze' | 'Silver' | 'Gold' | 'Platinum') => setFormData({ ...formData, membership_tier: value })}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                  <SelectItem value="Bronze" className="text-white">Bronze</SelectItem>
                  <SelectItem value="Silver" className="text-white">Silver</SelectItem>
                  <SelectItem value="Gold" className="text-white">Gold</SelectItem>
                  <SelectItem value="Platinum" className="text-white">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Loyalty Points</Label>
              <Input
                type="number"
                value={formData.loyalty_points}
                onChange={(e) => setFormData({ ...formData, loyalty_points: parseInt(e.target.value) || 0 })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: 'Active' | 'Inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                  <SelectItem value="Active" className="text-white">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-white">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
            >
              {isLoading ? 'Saving...' : editingCustomer ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="bg-[#0A0A0A] border-[#2A2A2A]">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Customer Code</p>
                    <p className="font-semibold text-white">{selectedCustomer.customer_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Full Name</p>
                    <p className="font-semibold text-white">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Email</p>
                    <p className="font-semibold text-white">{selectedCustomer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Phone</p>
                    <p className="font-semibold text-white">{selectedCustomer.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#A1A1AA]">Address</p>
                    <p className="font-semibold text-white">{selectedCustomer.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Membership Tier</p>
                    <Badge className={getTierColor(selectedCustomer.membership_tier)}>
                      {selectedCustomer.membership_tier}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Loyalty Points</p>
                    <p className="font-semibold text-[#3B82F6] text-lg">{selectedCustomer.loyalty_points.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Status</p>
                    <Badge variant={selectedCustomer.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-[#A1A1AA]">Member Since</p>
                    <p className="font-semibold text-white">
                      {new Date(selectedCustomer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="purchases">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2A2A2A]">
                      <TableHead className="text-[#A1A1AA]">Receipt No.</TableHead>
                      <TableHead className="text-[#A1A1AA]">Date</TableHead>
                      <TableHead className="text-[#A1A1AA]">Items</TableHead>
                      <TableHead className="text-[#A1A1AA]">Amount</TableHead>
                      <TableHead className="text-[#A1A1AA]">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerSales.length > 0 ? (
                      customerSales.map((sale) => (
                        <TableRow key={sale.id} className="border-[#2A2A2A]">
                          <TableCell className="text-white">{sale.receipt_number}</TableCell>
                          <TableCell className="text-[#A1A1AA]">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white">{sale.items_count}</TableCell>
                          <TableCell className="text-white font-semibold">
                            ${sale.total_amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-[#A1A1AA]">{sale.payment_method}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-[#A1A1AA] py-8">
                          No purchase history available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="stats">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Total Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-white">{customerSales.length}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total Spent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#3B82F6]">
                        ${customerSales.reduce((sum, s) => sum + s.total_amount, 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Average Transaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-white">
                        ${customerSales.length > 0 
                          ? (customerSales.reduce((sum, s) => sum + s.total_amount, 0) / customerSales.length).toFixed(2)
                          : '0.00'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Last Purchase
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-white">
                        {customerSales.length > 0
                          ? new Date(Math.max(...customerSales.map(s => new Date(s.sale_date).getTime()))).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              onClick={() => setShowDetailsDialog(false)}
              className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
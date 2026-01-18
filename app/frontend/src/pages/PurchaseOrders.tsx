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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Eye, FileText, Calendar, DollarSign, Package, Trash2, CheckCircle } from 'lucide-react';
import type { PurchaseOrder, PurchaseOrderItem, Supplier, Product } from '@/types';

export default function PurchaseOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [poItems, setPOItems] = useState<PurchaseOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    items: [] as Array<{ product_id: number; quantity: number; unit_price: number }>,
  });
  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: '',
    unit_price: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsPageLoading(true);
    setError(null);
    try {
      const [posData, suppliersData, productsData] = await Promise.all([
        api.purchaseOrders.getAll().catch(() => []),
        api.suppliers.getAll().catch(() => []),
        api.products.getAll().catch(() => []),
      ]);
      setPurchaseOrders(Array.isArray(posData) ? posData : []);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData.filter(s => s.status === 'Active') : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
      setPurchaseOrders([]);
      setSuppliers([]);
      setProducts([]);
    } finally {
      setIsPageLoading(false);
    }
  };

  const filteredPOs = Array.isArray(purchaseOrders)
    ? purchaseOrders.filter((po) => {
        if (!po || !po.po_number || !po.supplier_name) return false;
        const query = searchQuery.toLowerCase();
        return (
          po.po_number.toLowerCase().includes(query) ||
          po.supplier_name.toLowerCase().includes(query)
        );
      })
    : [];

  const handleAddItem = () => {
    if (!newItem.product_id || !newItem.quantity || !newItem.unit_price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all item fields',
        variant: 'destructive',
      });
      return;
    }

    const product = products.find(p => p.id.toString() === newItem.product_id);
    if (!product) return;

    const quantity = parseInt(newItem.quantity);
    const unitPrice = parseFloat(newItem.unit_price);

    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product_id: product.id,
          quantity,
          unit_price: unitPrice,
        },
      ],
    });

    setNewItem({ product_id: '', quantity: '', unit_price: '' });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const handleSubmit = async () => {
    if (!formData.supplier_id || !formData.expected_delivery || formData.items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields and add at least one item',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];
      const supplier = suppliers.find(s => s.id.toString() === formData.supplier_id);
      
      if (!supplier) {
        throw new Error('Supplier not found');
      }

      const po = await api.purchaseOrders.create({
        user_id: user!.id,
        po_number: `PO-${Date.now()}`,
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        order_date: `${formData.order_date} 00:00:00`,
        expected_delivery: `${formData.expected_delivery} 00:00:00`,
        total_amount: calculateTotal(),
        status: 'Pending',
        created_by: user!.username,
        created_at: currentDateTime,
      });

      for (const item of formData.items) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          await api.purchaseOrderItems.create({
            user_id: user!.id,
            po_id: po.id,
            product_id: item.product_id,
            product_name: product.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price,
            received_quantity: 0,
            created_at: currentDateTime,
          });
        }
      }

      toast({
        title: 'Success',
        description: `Purchase order ${po.po_number} created successfully`,
      });

      await loadData();
      setShowDialog(false);
      setFormData({
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        items: [],
      });
    } catch (error) {
      const detail = (error as { response?: { data?: { detail?: string } }; data?: { detail?: string }; message?: string })?.response?.data?.detail 
                  || (error as { data?: { detail?: string } })?.data?.detail 
                  || (error as Error).message 
                  || 'Failed to create purchase order';
      toast({
        title: 'Error',
        description: detail,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (po: PurchaseOrder) => {
    setSelectedPO(po);
    try {
      const items = await api.purchaseOrderItems.getByPOId(po.id);
      setPOItems(Array.isArray(items) ? items : []);
      setShowDetailsDialog(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load purchase order items',
        variant: 'destructive',
      });
    }
  };

  const handleReceivePO = async (po: PurchaseOrder) => {
    try {
      const items = await api.purchaseOrderItems.getByPOId(po.id);
      
      for (const item of items) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          await api.products.update(product.id, {
            quantity: product.quantity + item.quantity,
          });
        }
      }

      await api.purchaseOrders.update(po.id, {
        status: 'Received',
      });

      toast({
        title: 'Success',
        description: `Purchase order ${po.po_number} received and inventory updated`,
      });

      await loadData();
    } catch (error) {
      const detail = (error as { response?: { data?: { detail?: string } }; data?: { detail?: string }; message?: string })?.response?.data?.detail 
                  || (error as { data?: { detail?: string } })?.data?.detail 
                  || (error as Error).message 
                  || 'Failed to receive purchase order';
      toast({
        title: 'Error',
        description: detail,
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#F59E0B] text-white';
      case 'Received':
        return 'bg-[#10B981] text-white';
      case 'Cancelled':
        return 'bg-[#EF4444] text-white';
      default:
        return 'bg-[#71717A] text-white';
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-[#A1A1AA]">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Purchase Orders</h1>
          <p className="text-[#A1A1AA] mt-1">Manage supplier orders and inventory replenishment</p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[#A1A1AA]" />
            <Input
              placeholder="Search by PO number or supplier..."
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
            <FileText className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Purchase Orders</h3>
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

      {!error && filteredPOs.length === 0 && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No purchase orders found</h3>
            <p className="text-[#A1A1AA] mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first purchase order or load demo data from Settings'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowDialog(true)}
                className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!error && filteredPOs.length > 0 && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2A2A2A] hover:bg-[#1A1A1A]">
                  <TableHead className="text-[#A1A1AA]">PO Number</TableHead>
                  <TableHead className="text-[#A1A1AA]">Supplier</TableHead>
                  <TableHead className="text-[#A1A1AA]">Order Date</TableHead>
                  <TableHead className="text-[#A1A1AA]">Expected Delivery</TableHead>
                  <TableHead className="text-[#A1A1AA]">Total Amount</TableHead>
                  <TableHead className="text-[#A1A1AA]">Status</TableHead>
                  <TableHead className="text-[#A1A1AA]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => (
                  <TableRow key={po.id} className="border-[#2A2A2A] hover:bg-[#0A0A0A]">
                    <TableCell className="font-medium text-white">{po.po_number}</TableCell>
                    <TableCell className="text-white">{po.supplier_name}</TableCell>
                    <TableCell className="text-[#A1A1AA]">
                      {new Date(po.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-[#A1A1AA]">
                      {new Date(po.expected_delivery).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      ${po.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(po)}
                          className="text-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {po.status === 'Pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReceivePO(po)}
                            className="text-[#10B981] hover:text-[#10B981] hover:bg-[#10B981]/10"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create PO Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Select value={formData.supplier_id} onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()} className="text-white">
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Order Date *</Label>
                <Input
                  type="date"
                  value={formData.order_date}
                  onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Delivery *</Label>
                <Input
                  type="date"
                  value={formData.expected_delivery}
                  onChange={(e) => setFormData({ ...formData, expected_delivery: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add Items</Label>
              <div className="grid grid-cols-4 gap-2">
                <Select value={newItem.product_id} onValueChange={(value) => setNewItem({ ...newItem, product_id: value })}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()} className="text-white">
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
                <Button onClick={handleAddItem} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.items.length > 0 && (
              <div className="space-y-2">
                <Label>Order Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2A2A2A]">
                      <TableHead className="text-[#A1A1AA]">Product</TableHead>
                      <TableHead className="text-[#A1A1AA]">Quantity</TableHead>
                      <TableHead className="text-[#A1A1AA]">Unit Price</TableHead>
                      <TableHead className="text-[#A1A1AA]">Total</TableHead>
                      <TableHead className="text-[#A1A1AA]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item, index) => {
                      const product = products.find(p => p.id === item.product_id);
                      return (
                        <TableRow key={index} className="border-[#2A2A2A]">
                          <TableCell className="text-white">{product?.name}</TableCell>
                          <TableCell className="text-white">{item.quantity}</TableCell>
                          <TableCell className="text-white">${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell className="text-white">${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex justify-end p-4 bg-[#0A0A0A] rounded-lg">
                  <div className="text-right">
                    <p className="text-sm text-[#A1A1AA]">Total Amount</p>
                    <p className="text-2xl font-bold text-[#3B82F6]">${calculateTotal().toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
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
              {isLoading ? 'Creating...' : 'Create Purchase Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                <div>
                  <p className="text-sm text-[#A1A1AA]">PO Number</p>
                  <p className="font-semibold text-white">{selectedPO.po_number}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A1A1AA]">Supplier</p>
                  <p className="font-semibold text-white">{selectedPO.supplier_name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A1A1AA]">Order Date</p>
                  <p className="font-semibold text-white">{new Date(selectedPO.order_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A1A1AA]">Expected Delivery</p>
                  <p className="font-semibold text-white">{new Date(selectedPO.expected_delivery).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A1A1AA]">Status</p>
                  <Badge className={getStatusColor(selectedPO.status)}>{selectedPO.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-[#A1A1AA]">Total Amount</p>
                  <p className="font-semibold text-[#3B82F6] text-lg">${selectedPO.total_amount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <Label className="mb-2">Order Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2A2A2A]">
                      <TableHead className="text-[#A1A1AA]">Product</TableHead>
                      <TableHead className="text-[#A1A1AA]">Quantity</TableHead>
                      <TableHead className="text-[#A1A1AA]">Unit Price</TableHead>
                      <TableHead className="text-[#A1A1AA]">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poItems.map((item) => (
                      <TableRow key={item.id} className="border-[#2A2A2A]">
                        <TableCell className="text-white">{item.product_name}</TableCell>
                        <TableCell className="text-white">{item.quantity}</TableCell>
                        <TableCell className="text-white">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell className="text-white">${item.total_price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
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
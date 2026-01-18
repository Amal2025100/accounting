import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, Smartphone, Receipt, X } from 'lucide-react';
import type { Product, Customer, PaymentMethod, POSCartItem } from '@/types';

export default function POS() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, customersData, paymentMethodsData] = await Promise.all([
        api.products.getAll(),
        api.customers.getAll(),
        api.paymentMethods.getActive(),
      ]);
      setProducts(productsData || []);
      setCustomers(customersData || []);
      setPaymentMethods(paymentMethodsData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try refreshing the page.',
        variant: 'destructive',
      });
      // Set empty arrays as fallback
      setProducts([]);
      setCustomers([]);
      setPaymentMethods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      toast({
        title: 'Out of Stock',
        description: `${product.name} is currently out of stock`,
        variant: 'destructive',
      });
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast({
          title: 'Insufficient Stock',
          description: `Only ${product.quantity} units available`,
          variant: 'destructive',
        });
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: POSCartItem = {
        product,
        quantity: 1,
        price: product.sell_price,
        discount: 0,
        total: product.sell_price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.quantity) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${product.quantity} units available`,
        variant: 'destructive',
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to cart before checkout',
        variant: 'destructive',
      });
      return;
    }
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    const total = calculateTotal();
    const received = parseFloat(amountReceived) || 0;

    if (selectedPaymentMethod === 'Cash' && received < total) {
      toast({
        title: 'Insufficient Amount',
        description: `Total: $${total.toFixed(2)}, Received: $${received.toFixed(2)}`,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];

      // Create sale
      const sale = await api.sales.create({
        user_id: user!.id,
        sale_date: currentDateTime,
        total_amount: total,
        cashier_name: user!.username,
        customer_id: selectedCustomer?.id,
        payment_method: selectedPaymentMethod,
        tax_amount: calculateTax(),
        created_at: currentDateTime,
      });

      // Create sale items and update inventory
      for (const item of cart) {
        await api.saleItems.create({
          user_id: user!.id,
          sale_id: sale.id,
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total,
          created_at: currentDateTime,
        });

        // Update product quantity
        await api.products.update(item.product.id, {
          quantity: item.product.quantity - item.quantity,
        });
      }

      // Create receipt
      const receiptNumber = `RCP-${Date.now()}`;
      await api.receipts.create({
        user_id: user!.id,
        receipt_number: receiptNumber,
        sale_id: sale.id,
        customer_id: selectedCustomer?.id,
        total_amount: total,
        payment_method: selectedPaymentMethod,
        cashier_name: user!.username,
        receipt_date: currentDateTime,
        created_at: currentDateTime,
      });

      // Update customer loyalty points if customer selected
      if (selectedCustomer) {
        const pointsEarned = Math.floor(total / 10);
        await api.customers.update(selectedCustomer.id, {
          loyalty_points: selectedCustomer.loyalty_points + pointsEarned,
          total_purchases: selectedCustomer.total_purchases + total,
          last_purchase_date: currentDate,
        });
      }

      toast({
        title: 'Sale Completed',
        description: `Receipt #${receiptNumber} - Total: $${total.toFixed(2)}`,
      });

      // Reset
      clearCart();
      setShowPaymentDialog(false);
      setSelectedPaymentMethod('');
      setAmountReceived('');
      await loadData(); // Reload products to update quantities
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: 'Payment Failed',
        description: 'An error occurred while processing the payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'Cash':
        return <DollarSign className="h-5 w-5" />;
      case 'Card':
        return <CreditCard className="h-5 w-5" />;
      case 'Mobile':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Receipt className="h-5 w-5" />;
    }
  };

  const change = selectedPaymentMethod === 'Cash' ? parseFloat(amountReceived || '0') - calculateTotal() : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-[#A1A1AA]">Loading POS...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-8 text-center max-w-md">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-[#A1A1AA] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Products Available</h2>
            <p className="text-[#A1A1AA] mb-4">
              There are no products in the system. Please add products first or load demo data from Settings.
            </p>
            <Button
              onClick={loadData}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4 p-6 bg-[#0A0A0A]">
      {/* Products Section */}
      <div className="flex-1 flex flex-col gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-[#A1A1AA]" />
              <Input
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3B82F6] transition-colors cursor-pointer"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-white text-sm line-clamp-2">{product.name}</h3>
                      {product.quantity <= product.low_stock_threshold && (
                        <Badge variant="destructive" className="text-xs">Low</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#A1A1AA]">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#3B82F6]">${product.sell_price.toFixed(2)}</span>
                      <span className="text-xs text-[#A1A1AA]">Stock: {product.quantity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Section */}
      <div className="w-96 flex flex-col gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {cart.map((item) => (
              <Card key={item.product.id} className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{item.product.name}</h4>
                        <p className="text-xs text-[#A1A1AA]">${item.price.toFixed(2)} each</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-[#3B82F6] font-bold">${item.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Subtotal</span>
                <span className="text-white">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Tax (15%)</span>
                <span className="text-white">${calculateTax().toFixed(2)}</span>
              </div>
              <Separator className="bg-[#2A2A2A]" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#3B82F6]">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Select value={selectedCustomer?.id.toString() || ''} onValueChange={(value) => {
              const customer = customers.find(c => c.id.toString() === value);
              setSelectedCustomer(customer || null);
            }}>
              <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                <SelectValue placeholder="Select Customer (Optional)" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()} className="text-white">
                    {customer.name} ({customer.loyalty_points} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-white font-semibold"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-[#0A0A0A] rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-[#3B82F6]">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#A1A1AA]">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={selectedPaymentMethod === method.name ? 'default' : 'outline'}
                    onClick={() => setSelectedPaymentMethod(method.name)}
                    className={
                      selectedPaymentMethod === method.name
                        ? 'bg-[#3B82F6] hover:bg-[#2563EB]'
                        : 'bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]'
                    }
                  >
                    {getPaymentIcon(method.type)}
                    <span className="ml-2">{method.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {selectedPaymentMethod === 'Cash' && (
              <div className="space-y-2">
                <label className="text-sm text-[#A1A1AA]">Amount Received</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
                {change >= 0 && amountReceived && (
                  <div className="flex justify-between text-sm p-2 bg-[#10B981]/10 rounded">
                    <span className="text-[#10B981]">Change</span>
                    <span className="text-[#10B981] font-bold">${change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
            >
              Cancel
            </Button>
            <Button
              onClick={processPayment}
              disabled={isProcessing}
              className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
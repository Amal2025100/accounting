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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Building, Phone, Mail, MapPin, FileText } from 'lucide-react';
import type { Supplier } from '@/types';

export default function Suppliers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplier_code: '',
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    payment_terms: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setIsPageLoading(true);
    setError(null);
    try {
      const data = await api.suppliers.getAll().catch(() => []);
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
      setError('Failed to load suppliers. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load suppliers',
        variant: 'destructive',
      });
      setSuppliers([]);
    } finally {
      setIsPageLoading(false);
    }
  };

  const filteredSuppliers = Array.isArray(suppliers)
    ? suppliers.filter((s) => {
        if (!s || !s.name || !s.supplier_code) return false;
        const query = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(query) ||
          s.supplier_code.toLowerCase().includes(query) ||
          (s.contact_person && s.contact_person.toLowerCase().includes(query))
        );
      })
    : [];

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        supplier_code: supplier.supplier_code,
        name: supplier.name,
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        payment_terms: supplier.payment_terms || '',
        status: supplier.status,
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        supplier_code: `SUP-${Date.now()}`,
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        payment_terms: '',
        status: 'Active',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.supplier_code) {
      toast({
        title: 'Validation Error',
        description: 'Supplier code and name are required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];

      if (editingSupplier) {
        await api.suppliers.update(editingSupplier.id, formData);
        toast({
          title: 'Success',
          description: 'Supplier updated successfully',
        });
      } else {
        await api.suppliers.create({
          user_id: user!.id,
          ...formData,
          created_at: currentDateTime,
        });
        toast({
          title: 'Success',
          description: 'Supplier created successfully',
        });
      }

      await loadSuppliers();
      setShowDialog(false);
    } catch (error) {
      const detail = (error as { response?: { data?: { detail?: string } }; data?: { detail?: string }; message?: string })?.response?.data?.detail 
                  || (error as { data?: { detail?: string } })?.data?.detail 
                  || (error as Error).message 
                  || 'Failed to save supplier';
      toast({
        title: 'Error',
        description: detail,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-[#A1A1AA]">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Supplier Management</h1>
          <p className="text-[#A1A1AA] mt-1">Manage your supplier relationships</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[#A1A1AA]" />
            <Input
              placeholder="Search suppliers by name, code, or contact person..."
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
            <Building className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Suppliers</h3>
            <p className="text-[#A1A1AA] mb-4">{error}</p>
            <Button
              onClick={loadSuppliers}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && filteredSuppliers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3B82F6] transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
                      <Building className="h-5 w-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{supplier.name}</CardTitle>
                      <p className="text-xs text-[#A1A1AA]">{supplier.supplier_code}</p>
                    </div>
                  </div>
                  <Badge variant={supplier.status === 'Active' ? 'default' : 'secondary'}>
                    {supplier.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.contact_person && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#A1A1AA]">Contact:</span>
                    <span className="text-white">{supplier.contact_person}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[#A1A1AA]" />
                    <span className="text-white">{supplier.phone}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-[#A1A1AA]" />
                    <span className="text-white truncate">{supplier.email}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#A1A1AA] mt-0.5" />
                    <span className="text-white line-clamp-2">{supplier.address}</span>
                  </div>
                )}
                {supplier.payment_terms && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-[#A1A1AA]" />
                    <span className="text-white">{supplier.payment_terms}</span>
                  </div>
                )}
                <Button
                  onClick={() => handleOpenDialog(supplier)}
                  variant="outline"
                  className="w-full mt-4 bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Supplier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!error && filteredSuppliers.length === 0 && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No suppliers found</h3>
            <p className="text-[#A1A1AA] mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first supplier or load demo data from Settings'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Supplier Code *</Label>
              <Input
                value={formData.supplier_code}
                onChange={(e) => setFormData({ ...formData, supplier_code: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                disabled={!!editingSupplier}
              />
            </div>
            <div className="space-y-2">
              <Label>Supplier Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
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
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Input
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                placeholder="e.g., Net 30"
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                rows={3}
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
              {isLoading ? 'Saving...' : editingSupplier ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
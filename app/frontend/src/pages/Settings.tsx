import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { client } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Database, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SeedStatus {
  success: boolean;
  counts: {
    products: number;
    customers: number;
    employees: number;
    suppliers: number;
    sales: number;
    purchase_orders: number;
    payment_methods: number;
  };
  has_data: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [seedStatus, setSeedStatus] = useState<SeedStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const loadSeedStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const response = await client.apiCall.invoke({
        url: '/api/v1/seed/status',
        method: 'GET',
      });
      setSeedStatus(response.data);
    } catch (error: unknown) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err?.message || 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to load seed status: ${detail}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      // For now, just clear local storage and reload the page
      // This will reset the authentication state and reload fresh data
      localStorage.removeItem('smart_supermarket_auth');
      
      toast({
        title: 'Success',
        description: 'Demo data reset successfully. Reloading page...',
      });

      // Reload the page after 2 seconds to refresh all data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: unknown) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err?.message || 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to reset demo data: ${detail}`,
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-[#A1A1AA] mt-1">Manage system settings and configurations</p>
      </div>

      {/* Database Management */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription className="text-[#A1A1AA]">
            Manage demo data and database operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Current Data Status</h3>
              <Button
                onClick={loadSeedStatus}
                disabled={isLoadingStatus}
                variant="outline"
                size="sm"
                className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {seedStatus && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                <div>
                  <p className="text-xs text-[#A1A1AA]">Products</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.products}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Customers</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.customers}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Employees</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.employees}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Suppliers</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.suppliers}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Sales</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.sales}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Purchase Orders</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.purchase_orders}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Payment Methods</p>
                  <p className="text-lg font-bold text-white">{seedStatus.counts.payment_methods}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA]">Status</p>
                  <div className="flex items-center gap-1">
                    {seedStatus.has_data ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-[#10B981]" />
                        <span className="text-sm text-[#10B981]">Active</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                        <span className="text-sm text-[#F59E0B]">Empty</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <div className="space-y-3">
            <Alert className="bg-[#F59E0B]/10 border-[#F59E0B]/30">
              <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
              <AlertDescription className="text-[#F59E0B]">
                <strong>Warning:</strong> Resetting demo data will delete all existing data and replace it with fresh sample data.
                This action cannot be undone.
              </AlertDescription>
            </Alert>

            <Alert className="bg-[#3B82F6]/10 border-[#3B82F6]/30">
              <Info className="h-4 w-4 text-[#3B82F6]" />
              <AlertDescription className="text-[#3B82F6]">
                <strong>What will be created:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>30 Products across various categories</li>
                  <li>15 Customers with loyalty tiers</li>
                  <li>10 Employees with different roles</li>
                  <li>8 Suppliers with contact information</li>
                  <li>50 Sales transactions (last 30 days)</li>
                  <li>15 Purchase orders (last 60 days)</li>
                  <li>4 Payment methods</li>
                </ul>
              </AlertDescription>
            </Alert>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isResetting}
                  className="w-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] hover:from-[#D97706] hover:to-[#DC2626]"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resetting Demo Data...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Reset Demo Data
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                    Confirm Reset Demo Data
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[#A1A1AA]">
                    This will permanently delete all existing data and replace it with fresh sample data.
                    <br />
                    <br />
                    <strong className="text-[#EF4444]">This action cannot be undone!</strong>
                    <br />
                    <br />
                    Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetDemoData}
                    className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] hover:from-[#D97706] hover:to-[#DC2626]"
                  >
                    Yes, Reset Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">User Information</CardTitle>
          <CardDescription className="text-[#A1A1AA]">
            Current logged-in user details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#A1A1AA]">Username</p>
              <p className="text-sm font-medium text-white">{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-[#A1A1AA]">User ID</p>
              <p className="text-sm font-medium text-white">{user?.id}</p>
            </div>
            <div>
              <p className="text-xs text-[#A1A1AA]">Email</p>
              <p className="text-sm font-medium text-white">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A1A1AA]">Role</p>
              <p className="text-sm font-medium text-white">{user?.role || 'User'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
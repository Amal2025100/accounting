import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Calculator,
  Brain,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  CreditCard,
  Truck,
  ShoppingBag,
  UserCheck,
  UsersRound,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Manager', 'Accountant', 'Cashier', 'Inventory Manager', 'Report Viewer'] as UserRole[] },
  { name: 'POS', href: '/pos', icon: CreditCard, roles: ['Manager', 'Cashier'] as UserRole[] },
  { name: 'Sales', href: '/sales', icon: ShoppingCart, roles: ['Manager', 'Accountant', 'Cashier'] as UserRole[] },
  { name: 'Inventory', href: '/inventory', icon: Package, roles: ['Manager', 'Accountant', 'Cashier', 'Inventory Manager'] as UserRole[] },
  { name: 'Suppliers', href: '/suppliers', icon: Truck, roles: ['Manager', 'Inventory Manager'] as UserRole[] },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingBag, roles: ['Manager', 'Inventory Manager'] as UserRole[] },
  { name: 'Customers', href: '/customers', icon: UsersRound, roles: ['Manager', 'Accountant'] as UserRole[] },
  { name: 'Employees', href: '/employees', icon: UserCheck, roles: ['Manager'] as UserRole[] },
  { name: 'Accounting', href: '/accounting', icon: Calculator, roles: ['Manager', 'Accountant'] as UserRole[] },
  { name: 'AI Analytics', href: '/ai-analytics', icon: Brain, roles: ['Manager', 'Accountant'] as UserRole[] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: ['Manager', 'Accountant', 'Report Viewer'] as UserRole[] },
  { name: 'Advanced Reports', href: '/advanced-reports', icon: BarChart3, roles: ['Manager', 'Accountant'] as UserRole[] },
  { name: 'Users', href: '/users', icon: Users, roles: ['Manager'] as UserRole[] },
  { name: 'Settings', href: '/settings', icon: SettingsIcon, roles: ['Manager', 'Accountant', 'Cashier', 'Inventory Manager', 'Report Viewer'] as UserRole[] },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavigation = navigation.filter(item =>
    hasPermission(item.roles)
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-[#141414] border-r border-[#2A2A2A] transition-transform duration-300 ease-in-out overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-[#2A2A2A]">
            <div className="p-2 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Smart Supermarket</h1>
              <p className="text-xs text-[#71717A]">AI-Powered System</p>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-[#71717A]">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20'
                      : 'text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-[#2A2A2A]">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-[#141414] border-b border-[#2A2A2A] lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h2 className="text-lg font-semibold text-white">Smart Supermarket</h2>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
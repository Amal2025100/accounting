import { RoleGuard } from '@/components/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { users } from '@/lib/mockData';
import {
  Users as UsersIcon,
  Shield,
  Activity,
  UserCheck,
} from 'lucide-react';

export default function Users() {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10';
      case 'Accountant':
        return 'border-[#10B981] text-[#10B981] bg-[#10B981]/10';
      case 'Cashier':
        return 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10';
      default:
        return 'border-[#71717A] text-[#71717A]';
    }
  };

  const rolePermissions = {
    Manager: ['Full System Access', 'User Management', 'Financial Reports', 'AI Analytics', 'System Settings'],
    Accountant: ['Accounting Module', 'Financial Reports', 'AI Analytics', 'Sales View', 'Inventory View'],
    Cashier: ['Sales Module', 'Inventory View', 'Basic Reports'],
  };

  return (
    <RoleGuard allowedRoles={['Manager']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-[#A1A1AA] mt-1">Manage system users and their permissions</p>
        </div>

        {/* User Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#A1A1AA]">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-[#3B82F6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#A1A1AA]">Managers</CardTitle>
              <Shield className="h-4 w-4 text-[#3B82F6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'Manager').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#A1A1AA]">Accountants</CardTitle>
              <UserCheck className="h-4 w-4 text-[#10B981]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'Accountant').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#A1A1AA]">Cashiers</CardTitle>
              <Activity className="h-4 w-4 text-[#F59E0B]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'Cashier').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white">System Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-[#141414] rounded-lg border border-[#2A2A2A] hover:border-[#3B82F6] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{user.username}</h3>
                        <p className="text-sm text-[#71717A]">
                          User ID: {user.id} • Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                    <h4 className="text-sm font-medium text-[#A1A1AA] mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rolePermissions[user.role as keyof typeof rolePermissions].map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="border-[#2A2A2A] text-[#A1A1AA] bg-[#0A0A0A]"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Descriptions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-[#1A1A1A] border-[#3B82F6]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#3B82F6]" />
                Manager Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#A1A1AA] mb-3">
                Full administrative access to all system features including user management, financial oversight, and system configuration.
              </p>
              <div className="space-y-1 text-xs text-[#71717A]">
                <p>✓ Complete system access</p>
                <p>✓ User management</p>
                <p>✓ All reports and analytics</p>
                <p>✓ System settings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#10B981]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#10B981]" />
                Accountant Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#A1A1AA] mb-3">
                Access to accounting, financial reports, and AI analytics. Can view sales and inventory but cannot modify user settings.
              </p>
              <div className="space-y-1 text-xs text-[#71717A]">
                <p>✓ Accounting module</p>
                <p>✓ Financial reports</p>
                <p>✓ AI analytics</p>
                <p>✓ Sales & inventory view</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#F59E0B]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#F59E0B]" />
                Cashier Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#A1A1AA] mb-3">
                Limited access focused on daily operations. Can process sales, view inventory, and access basic reports.
              </p>
              <div className="space-y-1 text-xs text-[#71717A]">
                <p>✓ Sales processing</p>
                <p>✓ Inventory viewing</p>
                <p>✓ Basic reports</p>
                <p>✗ No admin access</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
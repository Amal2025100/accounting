import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(allowedRoles)) {
    return fallback || (
      <Alert className="bg-[#1A1A1A] border-[#EF4444]">
        <ShieldAlert className="h-4 w-4 text-[#EF4444]" />
        <AlertDescription className="text-[#A1A1AA]">
          You don't have permission to access this section.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
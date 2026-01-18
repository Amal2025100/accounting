import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { UserRole } from '@/types';

interface User {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = 'smart_supermarket_auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const parsedUser = JSON.parse(storedAuth);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (username: string, password: string): boolean => {
    // Validate credentials against authorized users
    const validUsers = [
      { id: '1', username: 'admin', password: 'demo123', role: 'Manager' as UserRole, email: 'admin@supermarket.com' },
      { id: '2', username: 'accountant1', password: 'demo123', role: 'Accountant' as UserRole, email: 'accountant1@supermarket.com' },
      { id: '3', username: 'cashier1', password: 'demo123', role: 'Cashier' as UserRole, email: 'cashier1@supermarket.com' },
      { id: '4', username: 'cashier2', password: 'demo123', role: 'Cashier' as UserRole, email: 'cashier2@supermarket.com' },
      { id: '5', username: 'inventory1', password: 'demo123', role: 'Inventory Manager' as UserRole, email: 'inventory1@supermarket.com' },
    ];

    const foundUser = validUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const authenticatedUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        email: foundUser.email,
      };

      // Set user state
      setUser(authenticatedUser);

      // Persist to localStorage for session management
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
      } catch (error) {
        console.error('Failed to persist auth session:', error);
      }

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear auth session:', error);
    }
  };

  const hasPermission = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
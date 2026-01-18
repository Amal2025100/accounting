import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate that fields are not empty
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);

    try {
      // Attempt login with credentials
      const success = login(username.trim(), password);

      if (success) {
        // Successfully authenticated, navigate to dashboard
        navigate('/dashboard');
      } else {
        // Invalid credentials
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#1A1A1A] p-6">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://mgx-backend-cdn.metadl.com/generate/images/904185/2026-01-14/04d93b05-abd0-4df5-ba4e-979f66c3f2c5.png"
          alt="Dashboard Analytics"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <Card className="w-full max-w-md bg-[#1A1A1A] border-[#2A2A2A] shadow-2xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-2xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Smart Supermarket</CardTitle>
          <CardDescription className="text-[#A1A1AA]">
            AI-Powered Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#A1A1AA]">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-[#71717A]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#71717A] focus:border-[#3B82F6]"
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#A1A1AA]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#71717A]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#71717A] focus:border-[#3B82F6]"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <Alert className="bg-[#EF4444]/10 border-[#EF4444]">
                <AlertDescription className="text-[#EF4444] text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="mt-4 p-3 bg-[#141414] rounded-lg border border-[#2A2A2A]">
              <p className="text-xs text-[#71717A] text-center">
                Contact your system administrator for login credentials
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '@/lib/api';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await client.auth.login();
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
        <p className="text-white">Completing login...</p>
      </div>
    </div>
  );
}
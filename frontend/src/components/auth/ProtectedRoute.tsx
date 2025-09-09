import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/auth/login'
}) => {
  const { currentUser, loading, isGuest } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading your session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireAuth && !currentUser && !isGuest) {
    // Redirect to login page with return url only if not in guest mode
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && currentUser && !isGuest) {
    // Only redirect if user is actually logged in (not guest mode)
    // Check if they came from a specific page, otherwise go to dashboard
    const from = location.state?.from?.pathname;
    const redirectPath = from && from !== '/auth/login' && from !== '/auth/signup' 
      ? from 
      : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Hook to check if user has specific permissions
export const usePermissions = () => {
  const { currentUser, userProfile } = useAuth();

  const hasPermission = (permission: string) => {
    if (!currentUser || !userProfile) return false;
    
    // Add your permission logic here
    // For now, all authenticated users have basic permissions
    return true;
  };

  const isAdmin = () => {
    if (!userProfile) return false;
    // Add admin check logic
    return userProfile.email?.includes('admin') || false;
  };

  const isPremium = () => {
    if (!userProfile) return false;
    // Add premium check logic
    return userProfile.stats?.totalItineraries > 10 || false;
  };

  return {
    hasPermission,
    isAdmin,
    isPremium,
    isAuthenticated: !!currentUser
  };
};

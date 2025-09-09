import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, MapPin } from 'lucide-react';

interface LoginPromptProps {
  title?: string;
  description?: string;
  feature?: string;
  variant?: 'card' | 'inline';
  showSignup?: boolean;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({
  title = "Sign in required",
  description = "You need to be signed in to access this feature.",
  feature = "this feature",
  variant = 'card',
  showSignup = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/auth/login', { state: { from: location } });
  };

  const handleSignup = () => {
    navigate('/auth/signup', { state: { from: location } });
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            Please sign in to use {feature}.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={handleLogin}>
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          {showSignup && (
            <Button size="sm" variant="outline" onClick={handleSignup}>
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In to Continue
          </Button>
          
          {showSignup && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleSignup}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Account
              </Button>
            </>
          )}
          
          <p className="text-xs text-center text-gray-500 mt-4">
            You'll be redirected back to this page after signing in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

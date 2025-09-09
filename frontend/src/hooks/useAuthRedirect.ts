import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = (defaultPath: string = '/') => {
    // Get the intended destination from location state
    const from = location.state?.from?.pathname;
    
    // Check if it's a protected route that requires authentication
    const isProtectedRoute = from && (
      from.startsWith('/dashboard') || 
      from.startsWith('/profile') ||
      from.startsWith('/create-itinerary') ||
      from.startsWith('/my-')
    );

    // Determine where to redirect
    let redirectPath: string;

    if (isProtectedRoute) {
      // User was trying to access a protected route, send them there
      redirectPath = from;
    } else if (from && from !== '/' && !from.startsWith('/auth/')) {
      // User was on a public page, send them back there
      redirectPath = from;
    } else {
      // Default redirect (new signup or direct auth access)
      redirectPath = defaultPath;
    }

    navigate(redirectPath, { replace: true });
  };

  const getRedirectMessage = () => {
    const from = location.state?.from?.pathname;
    
    if (from && from !== '/' && !from.startsWith('/auth/')) {
      return `Redirecting you back to ${from}...`;
    }
    
    return 'Welcome! Taking you to your dashboard...';
  };

  return {
    redirectAfterAuth,
    getRedirectMessage,
    intendedPath: location.state?.from?.pathname
  };
};

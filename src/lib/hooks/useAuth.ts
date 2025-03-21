'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '../models/User';

type UseAuthOptions = {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
};

export const useAuth = (options: UseAuthOptions = {}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  const userRole = session?.user?.role || 'user';
  
  const checkRole = (requiredRole?: UserRole | UserRole[]): boolean => {
    if (!requiredRole) return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  };
  
  const hasRequiredRole = checkRole(options.requiredRole);
  
  useEffect(() => {
    if (isLoading) return;
    
    // If user is not authenticated and we're not on an auth page
    if (!isAuthenticated && options.redirectTo) {
      router.push(options.redirectTo);
      return;
    }
    
    // If user doesn't have the required role
    if (isAuthenticated && !hasRequiredRole && options.redirectTo) {
      router.push(options.redirectTo);
    }
  }, [isAuthenticated, hasRequiredRole, isLoading, options.redirectTo, router]);
  
  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    userRole,
    hasRequiredRole,
  };
};

export default useAuth; 
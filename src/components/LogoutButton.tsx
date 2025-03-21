'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

type LogoutButtonProps = {
  className?: string;
  variant?: 'primary' | 'secondary' | 'text';
};

const LogoutButton = ({ className = '', variant = 'primary' }: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 ${className}`;
      case 'secondary':
        return `${baseClasses} bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500 ${className}`;
      case 'text':
        return `text-red-500 hover:text-red-400 font-medium ${className}`;
      default:
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 ${className}`;
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={getButtonClasses()}
    >
      {isLoading ? 'Logging out...' : 'Sign out'}
    </button>
  );
};

export default LogoutButton; 
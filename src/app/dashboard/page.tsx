'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import LogoutButton from '@/components/LogoutButton';

const Dashboard = () => {
  const { session, isLoading, isAuthenticated, userRole } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }

  const RoleBasedGreeting = () => {
    switch (userRole) {
      case 'superadmin':
        return (
          <p className="text-blue-400">
            You have access to all features as a Super Admin. You can manage everything.
          </p>
        );
      case 'admin':
        return (
          <p className="text-green-400">
            You have admin privileges. You can manage most features except system settings.
          </p>
        );
      case 'member':
        return (
          <p className="text-yellow-400">
            You are a member. You have access to all club features and activities.
          </p>
        );
      default:
        return (
          <p className="text-gray-400">
            Welcome to our platform. Complete your profile to access more features.
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <LogoutButton variant="secondary" />
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {greeting}, {session?.user?.name}
              </h1>
              <p className="mt-1 text-gray-400">
                You are logged in as{' '}
                <span className="font-semibold text-blue-500">{userRole}</span>
              </p>
              <div className="mt-4">
                <RoleBasedGreeting />
              </div>
            </div>
            {session?.user?.image && (
              <div className="mt-4 md:mt-0">
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-16 w-16 rounded-full border-2 border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white">Quick Stats</h2>
              <div className="mt-4 space-y-2">
                <p className="text-gray-400">Profile completion: 70%</p>
                <div className="h-2 w-full rounded-full bg-gray-700">
                  <div className="h-2 w-[70%] rounded-full bg-blue-500"></div>
                </div>
                <p className="text-gray-400">Active since: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <div className="mt-4 space-y-4">
                <p className="text-gray-400">No recent activity to display</p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white">Actions</h2>
              <div className="mt-4 space-y-4">
                {userRole === 'superadmin' && (
                  <button 
                    onClick={() => router.push('/dashboard/superadmin')}
                    className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Super Admin Panel
                  </button>
                )}
                {(userRole === 'superadmin' || userRole === 'admin') && (
                  <button 
                    onClick={() => router.push('/dashboard/admin')}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Admin Panel
                  </button>
                )}
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
'use client';

import { useSession } from 'next-auth/react';
import MemberMeetings from '@/components/MemberMeetings';

export default function Dashboard() {
  const { data: session, status } = useSession();
  
  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const userRole = session?.user?.role || 'user';
  const userName = session?.user?.name || 'User';
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {userName}</h1>
        <p className="text-gray-400 mt-2">
          {userRole === 'superadmin' && 'You have full platform administrator access.'}
          {userRole === 'admin' && 'You have club administrator access.'}
          {userRole === 'member' && 'You are a club member.'}
          {userRole === 'user' && 'You are a registered user.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Account Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-md">
                <p className="text-gray-400 text-sm">Role</p>
                <p className="text-lg font-medium text-white">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-md">
                <p className="text-gray-400 text-sm">Club</p>
                <p className="text-lg font-medium text-white">{session?.user?.club || 'None'}</p>
              </div>
              {userRole === 'member' && (
                <>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <p className="text-gray-400 text-sm">Credit Score</p>
                    <p className="text-lg font-medium text-white">{session?.user?.creditScore || 0}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-lg font-medium text-green-400">Active</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Upcoming Meetings (for members and admins) */}
          {(userRole === 'member' || userRole === 'admin' || userRole === 'superadmin') && (
            <MemberMeetings />
          )}
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Admin/SuperAdmin Quick Actions */}
          {(userRole === 'admin' || userRole === 'superadmin') && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href={userRole === 'admin' ? '/dashboard/admin/meetings' : '/dashboard/superadmin/meetings'}
                  className="flex items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Schedule Meeting
                </a>
                <a 
                  href="/dashboard/events"
                  className="flex items-center p-3 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Manage Events
                </a>
                <a 
                  href={userRole === 'admin' ? '/dashboard/admin/members' : '/dashboard/superadmin/members'}
                  className="flex items-center p-3 bg-green-600 hover:bg-green-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  View Members
                </a>
                <a 
                  href="/dashboard/user-management"
                  className="flex items-center p-3 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zm0 2a6 6 0 016 6H2a6 6 0 016-6zM16 8a3 3 0 11-6 0 3 3 0 016 0zm-8 6a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                  </svg>
                  Manage Users
                </a>
              </div>
            </div>
          )}
          
          {/* Member Quick Actions */}
          {userRole === 'member' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Member Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="/dashboard/tasks"
                  className="flex items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  My Tasks
                </a>
                <a 
                  href="/dashboard/events"
                  className="flex items-center p-3 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Upcoming Events
                </a>
                <a 
                  href="/dashboard/profile"
                  className="flex items-center p-3 bg-green-600 hover:bg-green-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  My Profile
                </a>
                <a 
                  href="#"
                  className="flex items-center p-3 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Get Help
                </a>
              </div>
            </div>
          )}
          
          {/* Resources or Info */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Club Resources</h2>
            <ul className="space-y-3">
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors">
                <a href="#" className="flex items-center text-gray-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Club Handbook
                </a>
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors">
                <a href="#" className="flex items-center text-gray-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Resource Library
                </a>
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors">
                <a href="#" className="flex items-center text-gray-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
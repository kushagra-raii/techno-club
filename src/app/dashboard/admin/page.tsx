'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';

const AdminDashboard = () => {
  const { isLoading, isAuthenticated, userRole } = useAuth({
    requiredRole: ['admin', 'superadmin'],
    redirectTo: '/dashboard',
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');

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

  if (!isAuthenticated || !['admin', 'superadmin'].includes(userRole)) {
    return null; // Middleware will redirect
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-gray-400">Manage users, clubs, and content</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 md:mt-0 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="flex border-b border-gray-800 mb-8">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'users'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'clubs'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('clubs')}
          >
            Clubs
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'content'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'events'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </div>

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                Add New User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">Jane Cooper</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">jane.cooper@example.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Member
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-400 mr-3">Edit</button>
                      <button className="text-red-500 hover:text-red-400">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">John Smith</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">john.smith@example.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-400 mr-3">Edit</button>
                      <button className="text-red-500 hover:text-red-400">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div className="text-sm text-gray-400">Showing 2 of 2 users</div>
              <div className="flex space-x-2">
                <button className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm">Previous</button>
                <button className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Clubs Tab Content */}
        {activeTab === 'clubs' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Club Management</h2>
            <p className="text-gray-400">No clubs to display yet. Add a new club to get started.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Add New Club
            </button>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Content Management</h2>
            <p className="text-gray-400">No content to display yet. Add new content to get started.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Add New Content
            </button>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Event Management</h2>
            <p className="text-gray-400">No events to display yet. Add a new event to get started.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Add New Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
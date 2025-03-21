'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';

const SuperAdminDashboard = () => {
  const { isLoading, isAuthenticated, userRole } = useAuth({
    requiredRole: 'superadmin',
    redirectTo: '/dashboard',
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('system');

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

  if (!isAuthenticated || userRole !== 'superadmin') {
    return null; // Middleware will redirect
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="mt-1 text-gray-400">Advanced system administration</p>
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
              activeTab === 'system'
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'admins'
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('admins')}
          >
            Admins
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'analytics'
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'settings'
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* System Tab Content */}
        {activeTab === 'system' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">System Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">System Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Server Status:</span>
                    <span className="text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database Status:</span>
                    <span className="text-green-500">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Storage:</span>
                    <span className="text-blue-500">23% used</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory:</span>
                    <span className="text-yellow-500">67% used</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    <span className="text-blue-500">System:</span> Database backup completed (2 hours ago)
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-purple-500">Admin:</span> New admin user added (1 day ago)
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-green-500">User:</span> 5 new user registrations today
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-yellow-500">Warning:</span> High memory usage detected (3 hours ago)
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">System Updates</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Core System:</span>
                      <span className="text-green-500">Up to date (v1.2.4)</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Security Patches:</span>
                      <span className="text-green-500">Up to date</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Database Schema:</span>
                      <span className="text-yellow-500">Update available</span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm w-full">
                  Check for Updates
                </button>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                    Backup Database
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm">
                    Clear Cache
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm">
                    Restart Services
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm">
                    Maintenance Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Management Tab Content */}
        {activeTab === 'admins' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Admin Management</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
                Add New Admin
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
                      Last Active
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
                          <div className="h-10 w-10 rounded-full bg-purple-700"></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">Alex Johnson</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">alex.johnson@example.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Super Admin
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      Just now
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-400 mr-3">Edit</button>
                      <button className="text-red-500 hover:text-red-400">Remove</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-700"></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">Sarah Miller</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">sarah.miller@example.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      3 hours ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-400 mr-3">Edit</button>
                      <button className="text-red-500 hover:text-red-400">Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">System Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-gray-400 text-sm mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-white">1,259</p>
                <p className="text-green-500 text-sm">↑ 12% this month</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-gray-400 text-sm mb-1">Active Clubs</h3>
                <p className="text-2xl font-bold text-white">37</p>
                <p className="text-green-500 text-sm">↑ 5% this month</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-gray-400 text-sm mb-1">System Uptime</h3>
                <p className="text-2xl font-bold text-white">99.98%</p>
                <p className="text-gray-400 text-sm">Last 30 days</p>
              </div>
            </div>
            <p className="text-gray-400">Detailed analytics charts will be displayed here.</p>
            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
              Generate Reports
            </button>
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">System Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue="TechnoClub"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Environment
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenance-mode"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-400">
                      Enable Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Password Policy
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>High (12+ chars, special chars, numbers)</option>
                      <option>Medium (8+ chars, mixed case)</option>
                      <option>Basic (6+ chars)</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="two-factor"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                      defaultChecked
                    />
                    <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-400">
                      Require Two-Factor for Admins
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="audit-log"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                      defaultChecked
                    />
                    <label htmlFor="audit-log" className="ml-2 block text-sm text-gray-400">
                      Enable Audit Logging
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm mr-2">
                  Save Settings
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserRole = 'user' | 'member' | 'admin' | 'superadmin';
type ClubType = 'IEEE' | 'ACM' | 'AWS' | 'GDG' | 'STIC' | '';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  club: ClubType;
  creditScore: number;
};

type RequestData = {
  userId: string;
  action: string;
  data?: {
    role?: UserRole;
    name?: string;
    email?: string;
    club?: ClubType;
    creditScore?: number;
  };
};

type ApiError = {
  message: string;
};

const Sidebar = () => {
  const { data: session } = useSession();
  
  return (
    <div className="bg-gray-900 w-64 min-h-screen p-5 hidden md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Super Admin Panel</h2>
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name || 'User'} className="h-10 w-10 rounded-full" />
            ) : (
              <span className="text-white text-sm">{session?.user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <p className="text-white font-medium">{session?.user?.name}</p>
            <p className="text-purple-400 text-sm">{session?.user?.role}</p>
            {session?.user?.club && (
              <p className="text-purple-300 text-xs">{session.user.club}</p>
            )}
          </div>
        </div>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/superadmin" 
              className="flex items-center bg-purple-600 text-white px-4 py-3 rounded-lg"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              Manage All Users
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/user-management" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              User Management
            </Link>
          </li>
          <li>
            <Link 
              href="/profile" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              My Profile
            </Link>
          </li>
          <li>
            <Link 
              href="/auth/signup" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Create User
            </Link>
          </li>
          <li>
            <Link 
              href="/" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Back to Site
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const SuperAdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    club: '',
    creditScore: 0,
  });

  useEffect(() => {
    // Redirect if not authenticated or not a super admin
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'superadmin') {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      // Fetch users if authenticated as super admin
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('Error fetching users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser || !action) return;
    
    try {
      setLoading(true);
      
      const requestData: RequestData = {
        userId: selectedUser.id,
        action,
      };
      
      if (action === 'update-role') {
        requestData.data = { role: formData.role as UserRole };
      } else if (action === 'update-info') {
        requestData.data = {
          name: formData.name || undefined,
          email: formData.email || undefined,
        };
      } else if (action === 'assign-club') {
        requestData.data = { club: formData.club as ClubType };
      } else if (action === 'update-credit') {
        requestData.data = { creditScore: formData.creditScore };
      }
      
      const response = await fetch('/api/superadmin/manage-users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      // Update local state
      if (action === 'delete') {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setSuccessMessage(`Deleted user ${selectedUser.name}`);
      } else if (action === 'update-role') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, role: formData.role as UserRole };
          }
          return user;
        }));
        setSuccessMessage(`Updated ${selectedUser.name}'s role to ${formData.role}`);
      } else if (action === 'update-info') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { 
              ...user, 
              name: formData.name || user.name,
              email: formData.email || user.email,
            };
          }
          return user;
        }));
        setSuccessMessage(`Updated ${selectedUser.name}'s information`);
      } else if (action === 'assign-club') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, club: formData.club as ClubType };
          }
          return user;
        }));
        setSuccessMessage(`Assigned ${selectedUser.name} to ${formData.club} club`);
      } else if (action === 'update-credit') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, creditScore: formData.creditScore };
          }
          return user;
        }));
        setSuccessMessage(`Updated ${selectedUser.name}'s credit score to ${formData.creditScore}`);
      }
      
      // Reset state
      setSelectedUser(null);
      setAction('');
      setFormData({
        name: '',
        email: '',
        role: '',
        club: '',
        creditScore: 0,
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (user: User, actionType: string) => {
    setSelectedUser(user);
    setAction(actionType);
    
    if (actionType === 'update-info') {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
      });
    } else if (actionType === 'update-role') {
      setFormData({
        ...formData,
        role: user.role,
      });
    } else if (actionType === 'assign-club') {
      setFormData({
        ...formData,
        club: user.club,
      });
    } else if (actionType === 'update-credit') {
      setFormData({
        ...formData,
        creditScore: user.creditScore,
      });
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setAction('');
    setFormData({
      name: '',
      email: '',
      role: '',
      club: '',
      creditScore: 0,
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-500/20 text-purple-300';
      case 'admin':
        return 'bg-blue-500/20 text-blue-300';
      case 'member':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getClubBadgeClass = (club: string) => {
    switch (club) {
      case 'IEEE':
        return 'bg-blue-500/20 text-blue-300';
      case 'ACM':
        return 'bg-green-500/20 text-green-300';
      case 'AWS':
        return 'bg-orange-500/20 text-orange-300';
      case 'GDG':
        return 'bg-red-500/20 text-red-300';
      case 'STIC':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading && !error)) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile header with menu */}
      <div className="md:hidden w-full fixed top-0 left-0 bg-gray-900 z-10 px-4 py-3 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          Super Admin
        </h1>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 md:ml-64 mt-12 md:mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Super Admin Dashboard
            </h1>
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white"
                disabled={loading}
              >
                Refresh Users
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-white p-4 rounded-md mb-6">
              {successMessage}
            </div>
          )}
          
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage All Users</h2>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm"
              >
                Create New User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Club</th>
                    <th className="px-4 py-3 text-left">Credits</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 flex items-center space-x-3">
                        {user.image ? (
                          <img 
                            src={user.image} 
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-white text-sm">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <span>{user.name}</span>
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.club ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${getClubBadgeClass(user.club)}`}>
                            {user.club}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
                          {user.creditScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => openActionModal(user, 'update-role')}
                            className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm"
                          >
                            Role
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'assign-club')}
                            className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors text-white text-sm"
                          >
                            Club
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'update-credit')}
                            className="px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 transition-colors text-white text-sm"
                          >
                            Credits
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'update-info')}
                            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'delete')}
                            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white text-sm"
                            disabled={session?.user?.email === user.email}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Modal */}
      {selectedUser && action && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {action === 'update-role' ? 'Change User Role' : 
               action === 'update-info' ? 'Edit User Information' : 
               action === 'assign-club' ? 'Assign Club' :
               action === 'update-credit' ? 'Update Credit Score' :
               'Delete User'}
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-400">
                {action === 'delete' 
                  ? `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`
                  : `Modifying ${selectedUser.name} (${selectedUser.email})`
                }
              </p>
            </div>
            
            {action === 'update-role' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a role</option>
                  <option value="user">User</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            )}
            
            {action === 'assign-club' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Club</label>
                <select 
                  value={formData.club}
                  onChange={(e) => setFormData({...formData, club: e.target.value as ClubType})}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No Club</option>
                  <option value="IEEE">IEEE</option>
                  <option value="ACM">ACM</option>
                  <option value="AWS">AWS</option>
                  <option value="GDG">GDG</option>
                  <option value="STIC">STIC</option>
                </select>
                <p className="mt-2 text-xs text-gray-400">
                  As a Super Admin, you can assign users to any club
                </p>
              </div>
            )}
            
            {action === 'update-credit' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Credit Score</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.creditScore}
                  onChange={(e) => setFormData({...formData, creditScore: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            
            {action === 'update-info' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Email</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUserAction}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  action === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Processing...' : 
                 action === 'delete' ? 'Delete' : 
                 action === 'update-role' ? 'Update Role' : 
                 action === 'assign-club' ? 'Assign Club' :
                 action === 'update-credit' ? 'Update Credit' :
                 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;